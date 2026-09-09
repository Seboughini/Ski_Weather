# NZ Ski Weather

A stand-alone website that compares seven global weather models for 18 New
Zealand ski fields, blends them into a consensus forecast, ranks the fields for
the week ahead, and interprets each forecast against what the mountain likes
and dislikes (wind directions that load the basins, directions that close the
lifts, freezing-level thresholds).

Pages:

- **Home** (`#/`): top-10 ranking for the next 7 days with a North / South
  Island filter, and a map with a pin per field sized by consensus snowfall over
  a chosen range of days.
- **Field page** (`#/m/<id>`): 7-day consensus cards, the "mountain read" for a
  selected day, model-by-model table, hourly spaghetti charts, model accuracy,
  the mountain guide, and links to the field's own snow cams and website.

The header has a theme switch (automatic / light / dark). Each page has a
Creative Commons or public-domain background photo; see `PHOTO-CREDITS.md`.

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
script reads them from that file. Everything else (sectors, text, thresholds,
links, photo) is free-form. Entries marked `detail: 'sketch'` show a notice on
the page asking for local corrections.

For a photo, find a Creative Commons or public-domain image (Wikimedia Commons
is the easiest source), save it to `img/<id>.jpg` at about 1800 px wide, fill
in the `photo` block, and add a row to `PHOTO-CREDITS.md`.

## How the ranking works

Each day gets a 0–100 score from the consensus forecast: fresh snow (including
the previous day), summit wind against the field's hold threshold, rain risk
from the snow line versus base and mid-mountain elevation, storm visibility,
warmth and sunshine, plus a small adjustment for how the mountain rates the
wind direction. The week score is half the average day and half the average of
the best three days. The formula is in `scoreDay` in `js/app.js` and is meant
to be tuned.

## Snow cams and map

Snow cams link to each field's own webcam page rather than embedding the
images, which the fields own and change without notice. The map uses Leaflet
and OpenStreetMap tiles loaded from public CDNs; without internet access the
map shows a note and the rest of the site still works.

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
