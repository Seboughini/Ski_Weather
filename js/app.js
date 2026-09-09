/* NZ Ski Weather. Plain browser JavaScript, no build step, no framework.
 * Data: Open-Meteo multi-model forecast API (free, no key, non-commercial).
 * Optional: data/skill.json written by scripts/update.py for model weighting.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- config
  const MODELS = [
    { id: 'ecmwf_ifs025', name: 'ECMWF IFS', org: 'Europe (ECMWF)', res: '25 km', color: 'var(--s1)' },
    { id: 'gfs_global', name: 'GFS', org: 'USA (NOAA)', res: '25 km', color: 'var(--s2)' },
    { id: 'icon_global', name: 'ICON', org: 'Germany (DWD)', res: '13 km', color: 'var(--s3)' },
    { id: 'ukmo_global_deterministic_10km', name: 'UKMO', org: 'UK Met Office', res: '10 km', color: 'var(--s4)' },
    { id: 'gem_global', name: 'GEM', org: 'Canada (ECCC)', res: '15 km', color: 'var(--s5)' },
    { id: 'jma_gsm', name: 'JMA GSM', org: 'Japan (JMA)', res: '20 km', color: 'var(--s6)' },
    { id: 'meteofrance_arpege_world', name: 'ARPEGE', org: 'Météo-France', res: '25 km', color: 'var(--s7)' },
    { id: 'bom_access_global', name: 'ACCESS-G', org: 'Australia (BoM)', res: '12 km', color: 'var(--s8)' }
  ];
  const HOURLY = ['temperature_2m', 'precipitation', 'snowfall', 'cloud_cover', 'wind_gusts_10m',
    'temperature_850hPa', 'temperature_700hPa', 'geopotential_height_850hPa', 'geopotential_height_700hPa',
    'wind_speed_850hPa', 'wind_direction_850hPa', 'wind_speed_700hPa', 'wind_direction_700hPa'];
  const DAILY = ['snowfall_sum', 'precipitation_sum', 'temperature_2m_max', 'temperature_2m_min',
    'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant'];
  const API = 'https://api.open-meteo.com/v1/forecast';
  const SKILL_URL = 'data/skill.json';
  const DAY_HOURS = [8, 16]; // "skiing hours" window used for daily wind / freezing level
  const LAPSE = 0.0065;      // °C per metre
  const SNOW_LINE_OFFSET = 250; // snow usually reaches 200–300 m below the freezing level

  // Metric definitions for the comparison table. `skillVar` maps to the
  // variable used in data/skill.json for weighting.
  const METRICS = {
    snow:   { label: 'Snowfall', unit: 'cm', key: 'snow', skillVar: 'snowfall_sum', fmt: v => v.toFixed(1), tint: v => Math.min(0.85, v / 25) },
    precip: { label: 'Precipitation', unit: 'mm', key: 'precip', skillVar: 'precipitation_sum', fmt: v => v.toFixed(1), tint: v => Math.min(0.85, v / 40) },
    wind:   { label: 'Summit wind (max)', unit: 'km/h', key: 'windMax', skillVar: 'wind_speed_10m_max', fmt: v => Math.round(v), dir: true, tint: v => Math.min(0.85, v / 100) },
    gust:   { label: 'Surface gusts (max)', unit: 'km/h', key: 'gust', skillVar: 'wind_speed_10m_max', fmt: v => Math.round(v), tint: v => Math.min(0.85, v / 120) },
    fl:     { label: 'Freezing level (day)', unit: 'm', key: 'fl', skillVar: 'temperature_2m_max', fmt: v => Math.round(v), tint: () => 0 },
    tmax:   { label: 'Max temp (mid-mtn)', unit: '°C', key: 'tmax', skillVar: 'temperature_2m_max', fmt: v => v.toFixed(1), tint: () => 0 },
    tmin:   { label: 'Min temp (mid-mtn)', unit: '°C', key: 'tmin', skillVar: 'temperature_2m_min', fmt: v => v.toFixed(1), tint: () => 0 }
  };

  const state = {
    mountain: null, proc: null, skill: null, skillLoaded: false,
    useSkill: true, metric: 'snow', day: 0, cache: {}, fetchedAt: null
  };

  // ---------------------------------------------------------------- helpers
  const $ = (sel, root) => (root || document).querySelector(sel);
  function h(tag, attrs, ...children) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') e.className = v;
      else if (k === 'style') e.style.cssText = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (v !== null && v !== undefined) e.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return e;
  }
  const NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, ...children) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) e.setAttribute(k, v);
    for (const c of children.flat()) if (c) e.append(c.nodeType ? c : document.createTextNode(String(c)));
    return e;
  }
  const isNum = v => typeof v === 'number' && !Number.isNaN(v);
  const mean = a => { const b = a.filter(isNum); return b.length ? b.reduce((x, y) => x + y, 0) / b.length : null; };
  const max = a => { const b = a.filter(isNum); return b.length ? Math.max(...b) : null; };
  const min = a => { const b = a.filter(isNum); return b.length ? Math.min(...b) : null; };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const toRad = d => d * Math.PI / 180;
  const COMPASS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const dirName = d => isNum(d) ? COMPASS[Math.round(d / 22.5) % 16] : '–';
  const inSector = (d, [from, to]) => from <= to ? (d >= from && d < to) : (d >= from || d < to);

  function fmtDay(iso, long) {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('en-NZ', long ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // Direction-weighted vector mean. Returns degrees FROM.
  function vectorMeanDir(dirs, weights) {
    let u = 0, v = 0, n = 0;
    dirs.forEach((d, i) => {
      const w = weights ? weights[i] : 1;
      if (!isNum(d) || !isNum(w)) return;
      u += -Math.sin(toRad(d)) * w; v += -Math.cos(toRad(d)) * w; n += w;
    });
    if (!n) return null;
    return (Math.atan2(-u, -v) * 180 / Math.PI + 360) % 360;
  }

  // Freezing level from 850 / 700 hPa temperatures and heights, consistent across models.
  function freezingLevel(t850, t700, z850, z700) {
    if (![t850, t700, z850, z700].every(isNum)) return null;
    if (t850 <= 0) return Math.max(0, z850 + t850 / LAPSE);
    if (t700 >= 0) return z700 + t700 / LAPSE;
    return z850 + (t850 / (t850 - t700)) * (z700 - z850);
  }

  // Wind at summit elevation, interpolated between the 850 and 700 hPa levels.
  function summitWind(s850, d850, s700, d700, z850, z700, elev) {
    if (![s850, d850, s700, d700, z850, z700].every(isNum)) return { spd: null, dir: null };
    const f = clamp((elev - z850) / (z700 - z850), 0, 1);
    const spd = s850 + f * (s700 - s850);
    const dir = vectorMeanDir([d850, d700], [1 - f, f]);
    return { spd, dir };
  }

  // ---------------------------------------------------------------- data
  async function loadSkill() {
    try {
      const r = await fetch(SKILL_URL, { cache: 'no-store' });
      if (r.ok) state.skill = await r.json();
    } catch (e) { state.skill = null; }
    state.skillLoaded = true;
  }

  async function fetchForecast(m) {
    const key = m.id;
    const c = state.cache[key];
    if (c && Date.now() - c.at < 15 * 60 * 1000) return c.raw;
    const p = new URLSearchParams({
      latitude: m.lat, longitude: m.lon, elevation: m.elev.mid,
      hourly: HOURLY.join(','), daily: DAILY.join(','),
      models: MODELS.map(x => x.id).join(','),
      timezone: 'Pacific/Auckland', forecast_days: '7', wind_speed_unit: 'kmh'
    });
    const r = await fetch(API + '?' + p.toString());
    if (!r.ok) throw new Error('Open-Meteo returned HTTP ' + r.status);
    const raw = await r.json();
    if (raw.error) throw new Error(raw.reason || 'Open-Meteo error');
    state.cache[key] = { raw, at: Date.now() };
    return raw;
  }

  function cumulative(a) { let t = 0; return a.map(v => (t += isNum(v) ? v : 0)); }

  function processForecast(raw, m) {
    const days = raw.daily.time;
    const hours = raw.hourly.time;
    const hourDay = hours.map(t => days.indexOf(t.slice(0, 10)));
    const hourOfDay = hours.map(t => +t.slice(11, 13));
    const models = MODELS.map(md => {
      const d = v => raw.daily[v + '_' + md.id] || [];
      const hh = v => raw.hourly[v + '_' + md.id] || [];
      const avail = d('snowfall_sum').some(isNum) && hh('temperature_850hPa').some(isNum);
      if (!avail) return Object.assign({}, md, { avail: false });
      const fl = hours.map((_, i) => freezingLevel(hh('temperature_850hPa')[i], hh('temperature_700hPa')[i], hh('geopotential_height_850hPa')[i], hh('geopotential_height_700hPa')[i]));
      const sw = hours.map((_, i) => summitWind(hh('wind_speed_850hPa')[i], hh('wind_direction_850hPa')[i], hh('wind_speed_700hPa')[i], hh('wind_direction_700hPa')[i], hh('geopotential_height_850hPa')[i], hh('geopotential_height_700hPa')[i], m.elev.summit));
      const daily = days.map((_, di) => {
        const all = hours.map((_, i) => i).filter(i => hourDay[i] === di);
        const win = all.filter(i => hourOfDay[i] >= DAY_HOURS[0] && hourOfDay[i] <= DAY_HOURS[1]);
        const w = win.length ? win : all;
        const spds = w.map(i => sw[i].spd);
        const flDay = mean(w.map(i => fl[i]));
        // Freezing level while precipitation is falling matters most for rain/snow.
        const wet = all.filter(i => (hh('precipitation')[i] || 0) >= 0.2);
        return {
          snow: d('snowfall_sum')[di], precip: d('precipitation_sum')[di],
          tmax: d('temperature_2m_max')[di], tmin: d('temperature_2m_min')[di],
          gust: d('wind_gusts_10m_max')[di], wind10: d('wind_speed_10m_max')[di], wdir10: d('wind_direction_10m_dominant')[di],
          fl: flDay, flWet: wet.length ? mean(wet.map(i => fl[i])) : flDay, flMin: min(all.map(i => fl[i])),
          windMax: max(spds), windMean: mean(spds),
          windDir: vectorMeanDir(w.map(i => sw[i].dir), spds.map(x => isNum(x) ? x : 0)),
          cloud: mean(w.map(i => hh('cloud_cover')[i]))
        };
      });
      return Object.assign({}, md, {
        avail: true, daily,
        hourly: { fl, wind: sw, snowCum: cumulative(hh('snowfall')), temp: hh('temperature_2m'), snow: hh('snowfall'), precip: hh('precipitation'), cloud: hh('cloud_cover'), gust: hh('wind_gusts_10m') }
      });
    });
    return { days, hours, hourDay, models, avail: models.filter(x => x.avail) };
  }

  // ---------------------------------------------------------------- consensus
  function skillFor(varKey) {
    const sk = state.skill && state.skill.mountains && state.skill.mountains[state.mountain.id];
    const models = sk && sk.vars && sk.vars[varKey] ? sk.vars[varKey].models : null;
    return models && Object.values(models).some(e => e && e.n > 0) ? models : null;
  }
  function weightsFor(varKey, models) {
    const sk = state.useSkill ? skillFor(varKey) : null;
    const eq = 1 / models.length;
    let ws = models.map(md => (sk && sk[md.id] && isNum(sk[md.id].weight)) ? sk[md.id].weight : eq);
    const tot = ws.reduce((a, b) => a + b, 0) || 1;
    return ws.map(w => w / tot);
  }
  // Weighted consensus of one daily field across available models.
  function consensus(di, key, varKey) {
    const models = state.proc.avail.filter(md => isNum(md.daily[di][key]));
    if (!models.length) return { value: null, min: null, max: null, n: 0 };
    const ws = weightsFor(varKey, models);
    const vals = models.map(md => md.daily[di][key]);
    let v = 0, wt = 0;
    vals.forEach((x, i) => { v += x * ws[i]; wt += ws[i]; });
    return { value: v / wt, min: Math.min(...vals), max: Math.max(...vals), n: models.length, values: vals, models };
  }
  function consensusDir(di) {
    const models = state.proc.avail.filter(md => isNum(md.daily[di].windDir));
    if (!models.length) return null;
    const ws = weightsFor('wind_speed_10m_max', models);
    return vectorMeanDir(models.map(md => md.daily[di].windDir), models.map((md, i) => ws[i] * (md.daily[di].windMax || 1)));
  }
  function consensusHourly(field, sub) {
    const models = state.proc.avail;
    const n = state.proc.hours.length;
    const ws = weightsFor(field === 'snowCum' ? 'snowfall_sum' : field === 'wind' ? 'wind_speed_10m_max' : 'temperature_2m_max', models);
    const out = [];
    for (let i = 0; i < n; i++) {
      let v = 0, wt = 0;
      models.forEach((md, k) => {
        const x = sub ? md.hourly[field][i][sub] : md.hourly[field][i];
        if (isNum(x)) { v += x * ws[k]; wt += ws[k]; }
      });
      out.push(wt ? v / wt : null);
    }
    return out;
  }

  function daySummary(di) {
    const m = state.mountain;
    const snow = consensus(di, 'snow', 'snowfall_sum');
    const precip = consensus(di, 'precip', 'precipitation_sum');
    const tmax = consensus(di, 'tmax', 'temperature_2m_max');
    const tmin = consensus(di, 'tmin', 'temperature_2m_min');
    const wind = consensus(di, 'windMax', 'wind_speed_10m_max');
    const gust = consensus(di, 'gust', 'wind_speed_10m_max');
    const fl = consensus(di, 'flWet', 'temperature_2m_max');
    const flDay = consensus(di, 'fl', 'temperature_2m_max');
    const cloud = consensus(di, 'cloud', 'temperature_2m_max');
    const dir = consensusDir(di);
    const prev = di > 0 ? consensus(di - 1, 'snow', 'snowfall_sum').value : 0;
    const tags = [];
    const sv = snow.value || 0, pv = precip.value || 0, wv = wind.value || 0;
    if (sv >= 15) tags.push({ t: 'Big snow', k: 'good' });
    else if (sv >= 5) tags.push({ t: 'Fresh snow', k: 'good' });
    if (wv >= m.windHold) tags.push({ t: 'Wind hold risk', k: 'bad' });
    else if (wv >= m.windHold * 0.75) tags.push({ t: 'Windy', k: 'warn' });
    if (pv >= 3 && isNum(fl.value)) {
      const snowLine = fl.value - SNOW_LINE_OFFSET;
      if (snowLine > m.elev.mid) tags.push({ t: 'Rain risk', k: 'bad' });
      else if (snowLine > m.elev.base) tags.push({ t: 'Rain at base', k: 'warn' });
    }
    if (pv < 1 && (cloud.value || 0) < 40 && wv < m.windHold * 0.75) tags.push({ t: 'Bluebird', k: 'good' });
    if (prev >= 10 && pv < 2 && wv < m.windHold * 0.75) tags.push({ t: 'Powder morning', k: 'good' });
    const spread = snow.n > 1 ? snow.max - snow.min : 0;
    const agree = snow.n > 1 ? (spread <= Math.max(3, 0.6 * sv) ? 'high' : spread <= Math.max(6, 1.2 * sv) ? 'medium' : 'low') : 'n/a';
    return { snow, precip, tmax, tmin, wind, gust, fl, flDay, cloud, dir, tags, agree, spread };
  }
  function icon(sm) {
    const sv = sm.snow.value || 0, pv = sm.precip.value || 0, c = sm.cloud.value || 0;
    if (sv >= 2) return '🌨️';
    if (pv >= 2) return '🌧️';
    if (pv >= 0.5) return '🌦️';
    if (c > 70) return '☁️';
    if (c > 35) return '🌤️';
    return '☀️';
  }

  // ---------------------------------------------------------------- guide engine
  function sectorFor(dir) {
    if (!isNum(dir)) return null;
    return state.mountain.winds.find(w => inSector(dir, w.sector)) || null;
  }
  function dayRead(di) {
    const m = state.mountain, sm = daySummary(di), sec = sectorFor(sm.dir);
    const lines = [];
    const wv = sm.wind.value, sv = sm.snow.value, pv = sm.precip.value, flv = sm.fl.value;
    // Wind
    if (isNum(wv)) {
      let t = `Summit wind ${dirName(sm.dir)} around ${Math.round(wv)} km/h at the strongest`;
      if (sm.wind.n > 1) t += ` (models ${Math.round(sm.wind.min)}–${Math.round(sm.wind.max)})`;
      t += '. ';
      if (wv >= m.windHold) t += `That is at or above the ${m.windHold} km/h level where lifts here typically go on hold. ` + (sec ? sec.lifts : '');
      else if (wv >= m.windHold * 0.75) t += `Getting close to the ${m.windHold} km/h hold level; upper lifts may be affected. ` + (sec ? sec.lifts : '');
      else if (wv >= m.windHold * 0.5) t += `Below the ${m.windHold} km/h hold level, but it will feel exposed on the summit ridge.`;
      else t += 'Light enough that wind should not be a problem for the lifts.';
      lines.push({ k: wv >= m.windHold ? 'bad' : wv >= m.windHold * 0.75 ? 'warn' : 'ok', title: 'Wind', text: t });
    }
    // Snow and loading
    if (isNum(sv)) {
      let t;
      if (sv >= 1) {
        t = `About ${sv.toFixed(0)} cm of snow at mid-mountain`;
        if (sm.snow.n > 1) t += ` (range ${sm.snow.min.toFixed(0)}–${sm.snow.max.toFixed(0)} cm)`;
        t += sec ? ` on a ${sec.name.toLowerCase()} flow. ${sec.snow}` : '.';
        if (sv >= 3 && sec) t += ` Loading: ${sec.loading}`;
      } else {
        t = 'No meaningful snowfall expected. ' + (sec ? `${sec.name} flow: ${sec.snow}` : '');
      }
      lines.push({ k: sv >= 5 ? 'good' : 'ok', title: 'Snow', text: t });
    }
    // Rain / snow line
    if (isNum(flv)) {
      let t = `Freezing level near ${Math.round(flv / 50) * 50} m`;
      if (pv >= 0.5) t += ' while precipitation is falling';
      t += '. ';
      const snowLine = flv - SNOW_LINE_OFFSET;
      if (pv >= 3) {
        if (snowLine > m.elev.summit) t += 'Rain to the top of the mountain.';
        else if (snowLine > m.elev.mid) t += `Rain on the lower mountain, snow only near the summit (snow line roughly ${Math.round(snowLine / 50) * 50} m).`;
        else if (snowLine > m.elev.base) t += `Snow on the upper mountain, rain or sleet around the base (snow line roughly ${Math.round(snowLine / 50) * 50} m).`;
        else t += 'Snow to the base.';
      } else {
        t += isNum(sm.tmax.value) ? `Mid-mountain temperatures ${sm.tmin.value.toFixed(0)} to ${sm.tmax.value.toFixed(0)} °C.` : '';
      }
      const k = pv >= 3 && snowLine > m.elev.mid ? 'bad' : pv >= 3 && snowLine > m.elev.base ? 'warn' : 'ok';
      lines.push({ k, title: 'Snow line', text: t });
    }
    // Confidence
    if (sm.snow.n > 1) {
      const map = { high: 'Models agree closely on snowfall.', medium: 'Moderate spread between models on snowfall.', low: 'Models disagree on snowfall. Treat totals as uncertain.' };
      lines.push({ k: sm.agree === 'low' ? 'warn' : 'ok', title: 'Confidence', text: `${map[sm.agree]} ${sm.snow.n} of ${MODELS.length} models reporting.` });
    }
    return { sm, sec, lines };
  }

  // ---------------------------------------------------------------- rendering
  function renderTabs() {
    const nav = $('#mountain-tabs');
    nav.replaceChildren(...window.SKI_MOUNTAINS.map(m => h('button', {
      class: 'tab' + (state.mountain && m.id === state.mountain.id ? ' active' : ''),
      onclick: () => selectMountain(m.id), 'aria-pressed': state.mountain && m.id === state.mountain.id ? 'true' : 'false'
    }, m.name)));
  }

  function renderHeader() {
    const m = state.mountain;
    $('#mtn-name').textContent = m.name;
    $('#mtn-meta').textContent = `${m.region} · base ${m.elev.base} m · summit ${m.elev.summit} m · forecast point at ${m.elev.mid} m`;
    const missing = state.proc.models.filter(x => !x.avail).map(x => x.name);
    $('#status').textContent = `Fetched ${state.fetchedAt.toLocaleString('en-NZ', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })} · ${state.proc.avail.length} of ${MODELS.length} models reporting` + (missing.length ? ` (no data from ${missing.join(', ')})` : '');
    const sk = state.skill && state.skill.mountains && state.skill.mountains[m.id];
    const ds = (state.skill && state.skill.days_scored) || 0;
    const tog = $('#skill-toggle');
    tog.checked = state.useSkill;
    tog.disabled = !(sk && ds);
    $('#skill-toggle-label').textContent = sk && ds ? `Weight models by past accuracy (${ds} day${ds === 1 ? '' : 's'} scored)` : 'Weight models by past accuracy (no history yet, equal weights)';
  }

  function renderDays() {
    const wrap = $('#day-cards');
    const cards = state.proc.days.map((iso, di) => {
      const sm = daySummary(di);
      const sv = sm.snow.value;
      const card = h('button', { class: 'day' + (di === state.day ? ' selected' : ''), onclick: () => { state.day = di; renderDays(); renderRead(); } },
        h('div', { class: 'day-name' }, di === 0 ? 'Today' : fmtDay(iso).split(',')[0]),
        h('div', { class: 'day-date' }, fmtDay(iso).replace(/^[^,]+,\s*/, '')),
        h('div', { class: 'day-icon' }, icon(sm)),
        h('div', { class: 'day-snow', style: `background: rgba(42,120,214,${isNum(sv) ? Math.min(0.75, sv / 25) : 0})` },
          h('span', { class: 'big' }, isNum(sv) ? sv.toFixed(0) : '–'), h('span', { class: 'unit' }, ' cm'),
          h('div', { class: 'range' }, sm.snow.n > 1 ? `${sm.snow.min.toFixed(0)}–${sm.snow.max.toFixed(0)}` : '')),
        h('div', { class: 'day-row' }, h('span', { class: 'lbl' }, 'Temp'), h('span', null, isNum(sm.tmax.value) ? `${sm.tmin.value.toFixed(0)} / ${sm.tmax.value.toFixed(0)}°` : '–')),
        h('div', { class: 'day-row' }, h('span', { class: 'lbl' }, 'Wind'), h('span', null, arrowSpan(sm.dir), ` ${dirName(sm.dir)} ${isNum(sm.wind.value) ? Math.round(sm.wind.value) : '–'}`)),
        h('div', { class: 'day-row' }, h('span', { class: 'lbl' }, 'Frz lvl'), h('span', null, isNum(sm.flDay.value) ? `${Math.round(sm.flDay.value / 50) * 50} m` : '–')),
        h('div', { class: 'tags' }, sm.tags.map(t => h('span', { class: 'tag ' + t.k }, t.t)))
      );
      return card;
    });
    wrap.replaceChildren(...cards);
  }
  function arrowSpan(dir) {
    // Arrow points in the direction the wind blows TOWARD.
    return h('span', { class: 'arrow', style: `transform: rotate(${isNum(dir) ? dir + 180 : 0}deg)`, 'aria-hidden': 'true' }, '↑');
  }

  function renderRead() {
    const m = state.mountain;
    const di = state.day;
    const { sm, sec, lines } = dayRead(di);
    $('#read-title').textContent = `${m.name} · ${di === 0 ? 'Today, ' : ''}${fmtDay(state.proc.days[di], true)}`;
    $('#read-lines').replaceChildren(...lines.map(l => h('div', { class: 'read ' + l.k }, h('div', { class: 'read-title' }, l.title), h('div', null, l.text))));
    // Compass
    $('#compass').replaceChildren(compassSVG(m, sm, di));
    $('#compass-caption').textContent = sec
      ? `Consensus wind from the ${dirName(sm.dir)} (${Math.round(sm.dir)}°): "${sec.name}" sector, rated ${sec.verdict} for ${m.name}. Thin ticks show each model's direction.`
      : 'Wind direction unavailable.';
  }

  function compassSVG(m, sm, di) {
    const R = 100, cx = 120, cy = 120;
    const svg = s('svg', { viewBox: '0 0 240 240', class: 'compass', role: 'img', 'aria-label': 'Wind direction compass' });
    const col = { good: 'var(--good)', mixed: 'var(--warn)', bad: 'var(--bad)' };
    const arc = (from, to, r0, r1) => {
      const span = ((to - from) + 360) % 360 || 360;
      const a0 = toRad(from - 90), a1 = toRad(from + span - 90);
      const p = (a, r) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      const [x0, y0] = p(a0, r1), [x1, y1] = p(a1, r1), [x2, y2] = p(a1, r0), [x3, y3] = p(a0, r0);
      const large = span > 180 ? 1 : 0;
      return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
    };
    m.winds.forEach(w => {
      const active = sec => sec && sec.name === w.name;
      const path = s('path', { d: arc(w.sector[0], w.sector[1], 62, R), fill: col[w.verdict], 'fill-opacity': active(sectorFor(sm.dir)) ? 0.55 : 0.22, stroke: 'var(--surface)', 'stroke-width': 2 });
      path.append(s('title', null, `${w.name}: ${w.verdict}`));
      svg.append(path);
    });
    // Cardinal labels
    [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([l, d]) => {
      const a = toRad(d - 90);
      svg.append(s('text', { x: cx + (R + 12) * Math.cos(a), y: cy + (R + 12) * Math.sin(a) + 4, 'text-anchor': 'middle', class: 'compass-label' }, l));
    });
    // Each model's daily direction as a thin tick
    state.proc.avail.forEach(md => {
      const d = md.daily[di].windDir;
      if (!isNum(d)) return;
      const a = toRad(d - 90);
      svg.append(s('line', { x1: cx + 62 * Math.cos(a), y1: cy + 62 * Math.sin(a), x2: cx + 52 * Math.cos(a), y2: cy + 52 * Math.sin(a), stroke: md.color, 'stroke-width': 3, 'stroke-linecap': 'round' }));
    });
    // Consensus arrow: from the rim toward the centre (wind blows toward the centre)
    if (isNum(sm.dir)) {
      const a = toRad(sm.dir - 90);
      const x0 = cx + 58 * Math.cos(a), y0 = cy + 58 * Math.sin(a);
      const x1 = cx + 26 * Math.cos(a), y1 = cy + 26 * Math.sin(a);
      svg.append(s('defs', null, s('marker', { id: 'arrowhead', markerWidth: 8, markerHeight: 8, refX: 6, refY: 4, orient: 'auto' }, s('path', { d: 'M0,0 L8,4 L0,8 Z', fill: 'var(--ink)' }))));
      svg.append(s('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: 'var(--ink)', 'stroke-width': 3, 'marker-end': 'url(#arrowhead)' }));
    }
    svg.append(s('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', class: 'compass-centre' }, isNum(sm.wind.value) ? Math.round(sm.wind.value) : ''));
    return svg;
  }

  function renderGuide() {
    const m = state.mountain;
    $('#guide-summary').textContent = m.summary;
    $('#guide-aspect').textContent = `${m.aspect}. Lifts typically hold from about ${m.windHold} km/h summit wind.`;
    $('#guide-winds').replaceChildren(...m.winds.map(w => h('div', { class: 'wind-card ' + w.verdict },
      h('div', { class: 'wind-head' }, h('span', { class: 'dot ' + w.verdict }), h('strong', null, w.name), h('span', { class: 'muted' }, ` ${dirName(w.sector[0])}–${dirName(w.sector[1])} (${w.sector[0]}°–${w.sector[1]}°)`)),
      h('p', null, h('b', null, 'Snow: '), w.snow),
      h('p', null, h('b', null, 'Loading: '), w.loading),
      h('p', null, h('b', null, 'Lifts: '), w.lifts))));
    $('#guide-signatures').replaceChildren(...m.signatures.map(t => h('li', null, t)));
    $('#guide-flags').replaceChildren(...m.flags.map(t => h('li', null, t)));
  }

  function renderTable() {
    const met = METRICS[state.metric];
    const days = state.proc.days;
    const sel = $('#metric-select');
    if (!sel.options.length) {
      for (const [k, v] of Object.entries(METRICS)) sel.append(h('option', { value: k }, `${v.label} (${v.unit})`));
      sel.value = state.metric;
      sel.addEventListener('change', () => { state.metric = sel.value; renderTable(); });
    }
    const thead = h('thead', null, h('tr', null, h('th', null, 'Model'), ...days.map((iso, di) => h('th', null, di === 0 ? 'Today' : fmtDay(iso)))));
    const rows = state.proc.models.map(md => {
      if (!md.avail) return h('tr', { class: 'unavail' }, h('td', null, h('span', { class: 'swatch', style: `background:${md.color}` }), md.name), h('td', { colspan: days.length, class: 'muted' }, 'No data in this run'));
      return h('tr', null, h('td', null, h('span', { class: 'swatch', style: `background:${md.color}` }), md.name),
        ...days.map((_, di) => {
          const v = md.daily[di][met.key];
          if (!isNum(v)) return h('td', { class: 'muted' }, '–');
          const txt = met.dir ? `${met.fmt(v)} ${dirName(md.daily[di].windDir)}` : met.fmt(v);
          return h('td', { class: 'num', style: `background: rgba(42,120,214,${met.tint(v)})` }, txt);
        }));
    });
    const cons = h('tr', { class: 'consensus' }, h('td', null, 'Consensus'), ...days.map((_, di) => {
      const c = consensus(di, met.key, met.skillVar);
      if (!isNum(c.value)) return h('td', { class: 'muted' }, '–');
      const dir = met.dir ? ' ' + dirName(consensusDir(di)) : '';
      return h('td', { class: 'num' }, h('b', null, met.fmt(c.value) + dir), c.n > 1 ? h('div', { class: 'range' }, `${met.fmt(c.min)}–${met.fmt(c.max)}`) : null);
    }));
    $('#model-table').replaceChildren(thead, h('tbody', null, ...rows, cons));
    $('#table-caption').textContent = `${met.label} in ${met.unit} per model, daily. Consensus row is the ${state.useSkill && skillFor(met.skillVar) ? 'accuracy-weighted' : 'equal-weighted'} mean with the model range beneath. Cell shading scales with the value.`;
  }

  // ---------------------------------------------------------------- charts
  function lineChart(opts) {
    const wrap = h('div', { class: 'chart' });
    const draw = () => {
      wrap.replaceChildren();
      const W = Math.max(320, wrap.clientWidth || 800), H = opts.height || 220;
      const pad = { l: 44, r: 12, t: 12, b: 26 };
      const n = opts.x.length;
      const xs = i => pad.l + (i / (n - 1)) * (W - pad.l - pad.r);
      let lo = opts.yMin, hi = opts.yMax;
      const allVals = opts.series.flatMap(sr => sr.values).filter(isNum).concat((opts.hlines || []).map(l => l.y)).concat((opts.bands || []).flatMap(b => [b.from, b.to]));
      if (!isNum(lo)) lo = Math.min(...allVals, 0);
      if (!isNum(hi)) hi = Math.max(...allVals, lo + 1);
      if (opts.padTop) hi += (hi - lo) * 0.08;
      const ys = v => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b);
      const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'linechart' });
      // bands
      (opts.bands || []).forEach(b => {
        svg.append(s('rect', { x: pad.l, y: ys(b.to), width: W - pad.l - pad.r, height: Math.max(0, ys(b.from) - ys(b.to)), fill: 'var(--band)' }));
        svg.append(s('text', { x: W - pad.r - 4, y: ys(b.to) + 11, 'text-anchor': 'end', class: 'axis' }, b.label));
      });
      // y grid
      const ticks = niceTicks(lo, hi, 4);
      ticks.forEach(t => {
        svg.append(s('line', { x1: pad.l, x2: W - pad.r, y1: ys(t), y2: ys(t), stroke: 'var(--grid)' }));
        svg.append(s('text', { x: pad.l - 6, y: ys(t) + 4, 'text-anchor': 'end', class: 'axis' }, opts.fmt ? opts.fmt(t) : t));
      });
      // day separators
      opts.x.forEach((t, i) => {
        if (t.slice(11, 13) === '00') {
          svg.append(s('line', { x1: xs(i), x2: xs(i), y1: pad.t, y2: H - pad.b, stroke: 'var(--axis)' }));
          const iso = t.slice(0, 10);
          svg.append(s('text', { x: xs(i) + 4, y: H - 8, class: 'axis' }, fmtDay(iso).split(',')[0]));
        }
      });
      // hlines
      (opts.hlines || []).forEach(l => {
        svg.append(s('line', { x1: pad.l, x2: W - pad.r, y1: ys(l.y), y2: ys(l.y), stroke: l.color || 'var(--bad)', 'stroke-dasharray': '4 4' }));
        svg.append(s('text', { x: pad.l + 4, y: ys(l.y) - 4, class: 'axis', fill: l.color || 'var(--bad)' }, l.label));
      });
      // series
      opts.series.forEach(sr => {
        let d = '', pen = false;
        sr.values.forEach((v, i) => { if (isNum(v)) { d += (pen ? 'L' : 'M') + xs(i).toFixed(1) + ',' + ys(v).toFixed(1); pen = true; } else pen = false; });
        svg.append(s('path', { d, fill: 'none', stroke: sr.color, 'stroke-width': sr.width || 1.5, 'stroke-opacity': sr.opacity || 0.9, 'stroke-linejoin': 'round' }));
      });
      // hover
      const cursor = s('line', { y1: pad.t, y2: H - pad.b, stroke: 'var(--ink)', 'stroke-width': 1, visibility: 'hidden' });
      svg.append(cursor);
      const tip = h('div', { class: 'tip', hidden: '' });
      const hit = s('rect', { x: pad.l, y: pad.t, width: W - pad.l - pad.r, height: H - pad.t - pad.b, fill: 'transparent' });
      const move = ev => {
        const r = svg.getBoundingClientRect();
        const px = (ev.clientX - r.left) * (W / r.width);
        const i = clamp(Math.round((px - pad.l) / (W - pad.l - pad.r) * (n - 1)), 0, n - 1);
        cursor.setAttribute('x1', xs(i)); cursor.setAttribute('x2', xs(i)); cursor.setAttribute('visibility', 'visible');
        const rows = opts.series.map(sr => ({ sr, v: sr.values[i] })).filter(x => isNum(x.v)).sort((a, b) => b.v - a.v);
        tip.replaceChildren(h('div', { class: 'tip-head' }, opts.x[i].replace('T', ' ')),
          ...rows.map(x => h('div', { class: 'tip-row' }, h('span', { class: 'swatch', style: `background:${x.sr.color}` }), h('span', null, x.sr.name), h('span', { class: 'tip-val' }, (opts.fmt ? opts.fmt(x.v) : x.v.toFixed(1)) + (opts.extra ? opts.extra(x.sr, i) : '')))));
        tip.hidden = false;
        const left = (ev.clientX - r.left) > r.width * 0.6 ? (ev.clientX - r.left) - tip.offsetWidth - 12 : (ev.clientX - r.left) + 12;
        tip.style.left = Math.max(0, left) + 'px'; tip.style.top = (ev.clientY - r.top + 8) + 'px';
      };
      hit.addEventListener('mousemove', move);
      hit.addEventListener('mouseleave', () => { cursor.setAttribute('visibility', 'hidden'); tip.hidden = true; });
      svg.append(hit);
      wrap.append(svg, tip);
    };
    wrap._draw = draw;
    return wrap;
  }
  function niceTicks(lo, hi, count) {
    const span = hi - lo || 1;
    const raw = span / count;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(6));
    return out;
  }

  function legend(models) {
    return h('div', { class: 'legend' },
      h('span', { class: 'legend-item' }, h('span', { class: 'swatch', style: 'background: var(--ink)' }), 'Consensus'),
      ...models.map(md => h('span', { class: 'legend-item' }, h('span', { class: 'swatch', style: `background:${md.color}` }), md.name)));
  }

  function renderCharts() {
    const m = state.mountain, p = state.proc;
    const series = (field, sub) => p.avail.map(md => ({ name: md.name, color: md.color, values: sub ? md.hourly[field].map(x => x[sub]) : md.hourly[field] }));
    const consSeries = (field, sub) => ({ name: 'Consensus', color: 'var(--ink)', width: 3, values: consensusHourly(field, sub) });
    const charts = [
      { title: 'Accumulated snowfall at mid-mountain (cm)', note: 'Running total across the 7 days. A steep step is a storm; the spread between lines is model disagreement.',
        chart: lineChart({ x: p.hours, series: [...series('snowCum'), consSeries('snowCum')], yMin: 0, padTop: true, fmt: v => v.toFixed(0) }) },
      { title: 'Summit wind speed (km/h)', note: `Estimated at ${m.elev.summit} m from the 850 and 700 hPa levels. Dashed line is the ${m.windHold} km/h hold level for this field.`,
        chart: lineChart({ x: p.hours, series: [...series('wind', 'spd'), consSeries('wind', 'spd')], yMin: 0, padTop: true, hlines: [{ y: m.windHold, label: 'lift hold' }], fmt: v => v.toFixed(0), extra: (sr, i) => { const md = p.avail.find(x => x.name === sr.name); return md ? ' ' + dirName(md.hourly.wind[i].dir) : ''; } }) },
      { title: 'Freezing level (m)', note: 'Grey band is the ski area (base to summit). Snow usually reaches 200–300 m below the freezing level.',
        chart: lineChart({ x: p.hours, series: [...series('fl'), consSeries('fl')], bands: [{ from: m.elev.base, to: m.elev.summit, label: 'ski area' }], fmt: v => v.toFixed(0), padTop: true }) },
      { title: `Temperature at ${m.elev.mid} m (°C)`, note: 'Model 2 m air temperature adjusted to the forecast elevation.',
        chart: lineChart({ x: p.hours, series: [...series('temp'), consSeries('temp')], hlines: [{ y: 0, label: '0 °C', color: 'var(--muted)' }], fmt: v => v.toFixed(0), padTop: true }) }
    ];
    $('#charts').replaceChildren(legend(p.avail), ...charts.map(c => h('section', { class: 'chart-card' }, h('h3', null, c.title), h('p', { class: 'muted' }, c.note), c.chart)));
    charts.forEach(c => c.chart._draw());
  }
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => document.querySelectorAll('.chart').forEach(c => c._draw && c._draw()), 150); });

  function renderSkill() {
    const box = $('#skill-body');
    const sk = state.skill;
    const ms = sk && sk.mountains && sk.mountains[state.mountain.id];
    const scored = ms && Object.values(ms.vars).some(v => Object.values(v.models).some(e => e && e.n > 0));
    if (!scored) {
      const rec = sk && sk.days_recorded ? `${sk.days_recorded} day${sk.days_recorded === 1 ? '' : 's'} of forecasts recorded so far, none old enough to score yet. ` : '';
      box.replaceChildren(h('p', null, `No accuracy history for this mountain yet. ${rec}Once the site is on GitHub, the daily job records every model's forecast and scores it against ERA5 reanalysis about a week later. Weights appear here once scoring begins and firm up over the following weeks; until then the consensus uses equal weights.`));
      return;
    }
    const vars = [['snowfall_sum', 'Snow (cm)'], ['precipitation_sum', 'Precip (mm)'], ['temperature_2m_max', 'Max temp (°C)'], ['temperature_2m_min', 'Min temp (°C)'], ['wind_speed_10m_max', 'Wind (km/h)']];
    const head = h('tr', null, h('th', null, 'Model'), ...vars.map(([, l]) => h('th', null, l, h('div', { class: 'range' }, 'error · weight'))));
    const rows = MODELS.map(md => h('tr', null, h('td', null, h('span', { class: 'swatch', style: `background:${md.color}` }), md.name),
      ...vars.map(([v]) => {
        const e = ms.vars[v] && ms.vars[v].models[md.id];
        if (!e || !e.n) return h('td', { class: 'muted' }, '–');
        return h('td', { class: 'num' }, e.mae.toFixed(v.startsWith('temp') ? 1 : 1), h('div', { class: 'range' }, `${(e.weight * 100).toFixed(0)}% · n=${e.n}`));
      })));
    box.replaceChildren(
      h('p', null, `Mean absolute error of each model's forecast for this site, all lead times 0–6 days pooled, scored against ${sk.truth_source || 'ERA5 reanalysis'}. Lower is better. Weight is the share each model gets in the consensus (shrunk toward equal weights while the sample is small). ${sk.days_recorded || 0} days recorded, ${sk.days_scored || 0} scored, last updated ${sk.generated ? sk.generated.slice(0, 10) : '–'}.`),
      h('div', { class: 'table-wrap' }, h('table', { class: 'grid' }, h('thead', null, head), h('tbody', null, ...rows))));
  }

  // ---------------------------------------------------------------- flow
  function renderAll() {
    renderTabs(); renderHeader(); renderDays(); renderRead(); renderGuide(); renderTable(); renderCharts(); renderSkill();
  }
  async function selectMountain(id) {
    state.mountain = window.SKI_MOUNTAINS.find(m => m.id === id);
    state.day = 0;
    localStorage.setItem('ski-mountain', id);
    renderTabs();
    const err = $('#error');
    err.hidden = true;
    $('#main').classList.add('loading');
    try {
      if (!state.skillLoaded) await loadSkill();
      const raw = await fetchForecast(state.mountain);
      state.fetchedAt = new Date(state.cache[state.mountain.id].at);
      state.proc = processForecast(raw, state.mountain);
      if (!state.proc.avail.length) throw new Error('No model returned data. Open-Meteo may be having an outage; try again shortly.');
      renderAll();
    } catch (e) {
      err.hidden = false;
      err.textContent = 'Could not load the forecast: ' + e.message;
    } finally {
      $('#main').classList.remove('loading');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('#skill-toggle').addEventListener('change', ev => { state.useSkill = ev.target.checked; if (state.proc) { renderDays(); renderRead(); renderTable(); renderCharts(); } });
    $('#refresh').addEventListener('click', () => { delete state.cache[state.mountain.id]; selectMountain(state.mountain.id); });
    const saved = localStorage.getItem('ski-mountain');
    const first = window.SKI_MOUNTAINS.find(m => m.id === saved) || window.SKI_MOUNTAINS[0];
    selectMountain(first.id);
  });
})();
