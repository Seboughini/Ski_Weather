# NZ Ski Weather

A stand-alone website that compares seven global weather models for New Zealand
ski fields, blends them into a consensus forecast, and interprets that forecast
against what each mountain likes and dislikes (wind directions that load the
basins, directions that close the lifts, freezing-level thresholds).

It is plain HTML, CSS and JavaScript with no build step. Forecasts come straight
from [Open-Meteo](https://open-meteo.com/) in the browser, so the site works
opened as a local file or hosted on GitHub Pages. No AI or server is involved.

## Running it locally

Open `index.html` in a browser. That is all. (The accuracy weighting file is
read with `fetch`, which some browsers block for local files; the site then
falls back to equal weights and says so.)

## Hosting on GitHub Pages and switching on accuracy tracking

1. Create a new GitHub repository (public is fine) and push this folder to it.
2. In the repository, open **Settings → Pages**, choose *Deploy from a branch*,
   pick `main` and `/ (root)`, and save. The site appears at
   `https://<your-user>.github.io/<repo>/` after a minute or two.
3. Open **Settings → Actions → General**, scroll to *Workflow permissions*,
   select **Read and write permissions**, and save. The daily job needs this to
   commit data back to the repository.
4. Open the **Actions** tab, select *Record and score forecasts*, and click
   **Run workflow** once to check it works. From then on it runs every day.

The job (`scripts/update.py`) records every model's 7-day forecast for every
mountain into `data/forecasts/`, then scores forecasts whose target date is
old enough against ERA5 reanalysis (`data/truth/`) and writes weights to
`data/skill.json`. The site reads that file and shows the "Model accuracy at
this site" table. Weights are shrunk toward equal while the sample is small,
so the consensus changes gradually as evidence accumulates.

GitHub disables scheduled workflows in repositories with no activity for 60
days. If the accuracy table stops updating, re-enable the workflow from the
Actions tab.

## Adding a mountain

Add an entry to `js/mountains.js`. The `id`, `lat`, `lon` and `elev.mid` keys
must stay on the lines shown in the existing entries because the scoring
script reads them from that file. Everything else (sectors, text, thresholds)
is free-form.

## How the numbers are derived

- **Forecast point**: the model grid cell nearest the field, with temperature
  adjusted to the mid-mountain elevation by Open-Meteo.
- **Freezing level**: interpolated between each model's 850 hPa and 700 hPa
  temperatures and heights, so all models are treated identically.
- **Summit wind**: interpolated between the 850 hPa and 700 hPa winds at the
  summit elevation. This is free-air wind and usually reads higher than a
  sheltered lift, lower than an exposed ridge.
- **Consensus**: weighted mean of the reporting models. Weights come from
  `data/skill.json` when present, otherwise equal.
- **Snow line**: taken as about 250 m below the freezing level.

## Caveats

Global models are 10 to 25 km grids; the Southern Alps are smoothed. Snow
totals at a single field are estimates. The accuracy scoring uses ERA5
reanalysis as truth because there is no free observation feed for the fields.
The mountain guide text is general knowledge, meant to be corrected from local
experience. Open-Meteo's free tier is for non-commercial use.
