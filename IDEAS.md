# Ideas and iteration log

Read this file at the start of the next round of changes.

## Done in iteration 2 (2026-09-09)

- Home page with top-10 ranking, North/South Island filter, week score.
- Theme switch (auto / light / dark).
- Photo backgrounds per field and for the home page, all CC or public domain,
  credits in `PHOTO-CREDITS.md`.
- 15 more fields (18 total). Guides for the new club fields and some commercial
  fields are marked as sketches and need local correction.
- Snow cams: linked to official webcam pages (not embedded). Decision 2026-09-09:
  keep it as links. Embedding still images would need the fields' permission on
  a public site; revisit only if that changes.
- Map with a pin per field, sized by consensus snowfall over a chosen day range.

## Still open

- **Map zoom gestures** (added 2026-09-09): two-finger pinch on a trackpad and
  scroll-wheel zoom with a mouse, active only while the pointer is over the map
  so normal page scrolling is unaffected elsewhere. Implementation notes: the
  map currently has `scrollWheelZoom: false`. Leaflet already handles touch
  pinch on phones. On a Mac trackpad, pinch arrives as a wheel event with the
  Ctrl key flag set, so enabling Leaflet's scroll-wheel zoom on `mouseenter`
  and disabling it on `mouseleave` covers both trackpad pinch and mouse wheel.
  Two-finger scrolling on the trackpad would then also zoom while over the map;
  if that feels wrong, the common alternative is "hold Ctrl/Cmd and scroll to
  zoom" with a hint overlay. Decide which feel is wanted when building it.
  Also replace the map's lead text ("Zoom in to separate the Craigieburn Range
  fields") with short zoom/pan instructions that match whatever gesture is
  chosen, e.g. "Drag to pan. Pinch or scroll over the map to zoom."

- **Recent snowfall and snow base** (added 2026-09-09): show snowfall over the
  last 48 hours and last 7 days, plus the current snow base depth, per field.
  Options: (a) Open-Meteo's historical/archive endpoints give model-estimated
  snowfall for past days at the forecast point, which is free and consistent
  with the forecast but is not a measurement; (b) the fields publish measured
  base depth and recent falls in their snow reports, but there is no free API
  and scraping their pages is fragile and may breach their terms; (c) the daily
  GitHub job could archive each day's "day 0" consensus snowfall so the site can
  show a running 7-day total without extra requests. Recommended start: (a) for
  recent snowfall plus a link to the field's own report for measured base.

- Tune the ranking formula against real weeks (`scoreDay` in `js/app.js`).
- Season / open-status awareness so closed fields do not top the ranking.
- Model accuracy by lead time once history exists.
- Consider labelling the top few pins on the map.

## Original ideas captured 2026-09-09

## 1. Home page: where to ski in NZ this week

- A landing page that ranks fields for the coming week and recommends where to go.
- Top 10 ranking, with a filter for North Island / South Island.
- Needs more mountains in `js/mountains.js` first (currently Mt Hutt, Cardrona,
  Treble Cone). Candidates: Coronet Peak, The Remarkables, Mt Ruapehu (Whakapapa
  and Turoa), Craigieburn and the other Canterbury club fields, Ohau, Mt Dobson,
  Roundhill, Porters, Mt Lyford, Rainbow, Manganui.
- Ranking inputs to decide on: consensus snowfall over the week, snow quality
  (temperature / freezing level), wind-hold risk on each day, rain risk at the base,
  model agreement, and the mountain's own wind-sector rating. Probably a score per
  day, then a week score, with the reasoning shown so it is not a black box.
- Implementation note: one Open-Meteo request per mountain per visit; with 15 or
  more fields consider fetching daily data only for the home page and hourly data
  only when a mountain is opened.

## 2. Light mode / dark mode toggle

- The site already follows the operating system theme. Add a manual toggle in the
  header that remembers the choice (localStorage), with "system" as the default.

## 3. Photo backgrounds per mountain

- Replace the flat background with a high-resolution photo of the selected field,
  or a view from it (e.g. looking down a valley).
- Licensing is the main constraint. Only use images with a licence that permits
  reuse, and keep attribution visible. Good sources: Wikimedia Commons (check each
  file's licence: CC0, CC BY, or CC BY-SA are fine; keep the credit), Unsplash
  and Pexels (their licences allow use; credit is polite), or your own photos.
  Do not use ski-field marketing photos or search-engine results without checking.
- Keep a `PHOTO-CREDITS.md` listing the file, author, source URL and licence.
- Performance: resize to about 2000 px wide and compress (WebP or JPEG, roughly
  300 to 500 KB each). Serve the text on a translucent panel so it stays readable.
- Store photos in an `img/` folder in the repository.

## Other loose ends

- ACCESS-G returned no data from Open-Meteo on 2026-09-09; it will appear
  automatically if the feed returns.
- Consider showing the model accuracy by lead time (day 1 vs day 5) once there is
  enough history; the scorer already records `mae_by_lead`.
