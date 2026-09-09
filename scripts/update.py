#!/usr/bin/env python3
"""Record today's multi-model forecasts and score past ones against ERA5.

Runs daily from GitHub Actions (see .github/workflows/update.yml) with no
dependencies beyond the Python standard library.

  data/forecasts/YYYY-MM-DD.json   one file per issue date (NZ date)
  data/truth/<mountain>.json       cached ERA5 daily values per date
  data/skill.json                  per-mountain, per-variable model weights

Mountains and coordinates are read from js/mountains.js so there is one
source of truth for the site and the scorer.
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FORECAST_DIR = ROOT / 'data' / 'forecasts'
TRUTH_DIR = ROOT / 'data' / 'truth'
SKILL_FILE = ROOT / 'data' / 'skill.json'

MODELS = ['ecmwf_ifs025', 'gfs_global', 'icon_global', 'ukmo_global_deterministic_10km',
          'gem_global', 'jma_gsm', 'meteofrance_arpege_world', 'bom_access_global']
VARS = ['snowfall_sum', 'precipitation_sum', 'temperature_2m_max', 'temperature_2m_min', 'wind_speed_10m_max']
# Error floor per variable so a tiny MAE cannot produce a runaway weight.
EPS = {'snowfall_sum': 0.5, 'precipitation_sum': 0.5, 'temperature_2m_max': 0.3, 'temperature_2m_min': 0.3, 'wind_speed_10m_max': 2.0}
SHRINK_DAYS = 14        # weights move from equal toward skill-based as n grows past this
TRUTH_LAG_DAYS = 6      # ERA5 in Open-Meteo lags real time by about 5 days
TZ = 'Pacific/Auckland'
NZ_OFFSET_HOURS = 12    # used only to pick the "issue date"; NZDT vs NZST does not matter here


def nz_today():
    return (datetime.now(timezone.utc) + timedelta(hours=NZ_OFFSET_HOURS)).date()


def load_mountains():
    src = (ROOT / 'js' / 'mountains.js').read_text(encoding='utf-8')
    pat = re.compile(r"id:\s*'([^']+)'.*?lat:\s*(-?[\d.]+).*?lon:\s*(-?[\d.]+).*?mid:\s*(\d+)", re.S)
    out = [{'id': m.group(1), 'lat': float(m.group(2)), 'lon': float(m.group(3)), 'elev': int(m.group(4))} for m in pat.finditer(src)]
    if not out:
        sys.exit('No mountains found in js/mountains.js')
    return out


def get_json(url, params, retries=3):
    q = url + '?' + urllib.parse.urlencode(params)
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(q, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # network hiccup or 429; wait and retry
            if attempt == retries - 1:
                raise
            time.sleep(5 * (attempt + 1))
    return None


def record_forecasts(mountains, today):
    """Fetch today's 7-day daily forecast for every model and save it."""
    FORECAST_DIR.mkdir(parents=True, exist_ok=True)
    out_file = FORECAST_DIR / f'{today.isoformat()}.json'
    rec = {'issued': today.isoformat(), 'fetched_utc': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'mountains': {}}
    for m in mountains:
        d = get_json('https://api.open-meteo.com/v1/forecast', {
            'latitude': m['lat'], 'longitude': m['lon'], 'elevation': m['elev'],
            'daily': ','.join(VARS), 'models': ','.join(MODELS), 'timezone': TZ, 'forecast_days': 7, 'wind_speed_unit': 'kmh'})
        daily = d['daily']
        entry = {'time': daily['time'], 'models': {}}
        for mod in MODELS:
            vals = {v: daily.get(f'{v}_{mod}') for v in VARS}
            if any(x is not None for x in (vals['snowfall_sum'] or [])):
                entry['models'][mod] = vals
        rec['mountains'][m['id']] = entry
        print(f"recorded {m['id']}: {len(entry['models'])} models")
    out_file.write_text(json.dumps(rec, separators=(',', ':')), encoding='utf-8')
    return rec


def load_forecasts():
    return [json.loads(p.read_text(encoding='utf-8')) for p in sorted(FORECAST_DIR.glob('*.json'))]


def update_truth(mountains, forecasts, today):
    """Fetch ERA5 daily values for every target date that is old enough and not cached yet."""
    TRUTH_DIR.mkdir(parents=True, exist_ok=True)
    cutoff = today - timedelta(days=TRUTH_LAG_DAYS)
    truth = {}
    for m in mountains:
        f = TRUTH_DIR / f"{m['id']}.json"
        cache = json.loads(f.read_text(encoding='utf-8')) if f.exists() else {}
        needed = sorted({t for fc in forecasts for t in fc['mountains'].get(m['id'], {}).get('time', [])
                         if date.fromisoformat(t) <= cutoff and t not in cache})
        if needed:
            d = get_json('https://archive-api.open-meteo.com/v1/archive', {
                'latitude': m['lat'], 'longitude': m['lon'], 'elevation': m['elev'],
                'start_date': needed[0], 'end_date': needed[-1], 'daily': ','.join(VARS), 'timezone': TZ, 'wind_speed_unit': 'kmh'})
            daily = d['daily']
            added = 0
            for i, t in enumerate(daily['time']):
                if t in needed:
                    row = {v: daily[v][i] for v in VARS}
                    if all(row[v] is not None for v in VARS):
                        cache[t] = row
                        added += 1
            print(f"truth {m['id']}: +{added} days (cache {len(cache)})")
            f.write_text(json.dumps(cache, separators=(',', ':'), sort_keys=True), encoding='utf-8')
        truth[m['id']] = cache
    return truth


def score(mountains, forecasts, truth, today):
    """Mean absolute error and weights per mountain / variable / model."""
    result = {'generated': datetime.now(timezone.utc).isoformat(timespec='seconds'),
              'truth_source': 'ERA5 reanalysis via the Open-Meteo archive API',
              'method': f'weight = shrink * (1/(MAE+eps)) normalised + (1-shrink) * equal, shrink = n/(n+{SHRINK_DAYS})',
              'days_recorded': len(forecasts), 'days_scored': 0, 'mountains': {}}
    scored_issues = set()
    for m in mountains:
        mid = m['id']
        tr = truth.get(mid, {})
        errs = {v: {mod: [] for mod in MODELS} for v in VARS}
        lead_errs = {v: {mod: [[] for _ in range(7)] for mod in MODELS} for v in VARS}
        for fc in forecasts:
            ent = fc['mountains'].get(mid)
            if not ent:
                continue
            for lead, t in enumerate(ent['time']):
                if t not in tr:
                    continue
                scored_issues.add(fc['issued'])
                for mod, vals in ent['models'].items():
                    for v in VARS:
                        arr = vals.get(v)
                        if arr and lead < len(arr) and arr[lead] is not None:
                            e = arr[lead] - tr[t][v]
                            errs[v][mod].append(e)
                            lead_errs[v][mod][lead].append(abs(e))
        mres = {'vars': {}}
        for v in VARS:
            per = {}
            for mod in MODELS:
                e = errs[v][mod]
                if e:
                    per[mod] = {'n': len(e), 'mae': sum(abs(x) for x in e) / len(e), 'bias': sum(e) / len(e),
                                'mae_by_lead': [round(sum(l) / len(l), 3) if l else None for l in lead_errs[v][mod]]}
            if per:
                skill = {mod: 1.0 / (r['mae'] + EPS[v]) for mod, r in per.items()}
                tot = sum(skill.values())
                eq = 1.0 / len(per)
                for mod, r in per.items():
                    shrink = r['n'] / (r['n'] + SHRINK_DAYS)
                    r['weight'] = shrink * skill[mod] / tot + (1 - shrink) * eq
                wsum = sum(r['weight'] for r in per.values())
                for r in per.values():
                    r['weight'] = round(r['weight'] / wsum, 4)
                    r['mae'] = round(r['mae'], 3)
                    r['bias'] = round(r['bias'], 3)
            mres['vars'][v] = {'models': per}
        result['mountains'][mid] = mres
    result['days_scored'] = len(scored_issues)
    SKILL_FILE.write_text(json.dumps(result, indent=1), encoding='utf-8')
    print(f"skill.json: {result['days_recorded']} recorded, {result['days_scored']} scored")


def main():
    today = nz_today()
    mountains = load_mountains()
    if '--score-only' not in sys.argv:
        record_forecasts(mountains, today)
    forecasts = load_forecasts()
    truth = update_truth(mountains, forecasts, today)
    score(mountains, forecasts, truth, today)


if __name__ == '__main__':
    main()
