/*
 * Mountain guide data. This is the file to edit when you want to correct or
 * extend the local knowledge for a field, or add a new mountain.
 *
 * Wind sectors use meteorological convention: the direction the wind blows
 * FROM, in degrees clockwise from north. A sector [from, to] runs clockwise
 * from `from` to `to`, so [330, 30] covers north.
 *
 * verdict: 'good' | 'mixed' | 'bad'   colours the compass sector
 * windHold: summit wind speed in km/h at which lifts typically go on hold
 * detail: 'detailed' | 'sketch'       how confident the guide text is
 * cams: the field's own webcam page (opened in a new tab, never embedded)
 * photo: background image in img/, with its licence and credit
 *
 * The daily recording script (scripts/update.py) reads id, lat, lon and
 * elev.mid from this file, so keep those keys on the lines shown here.
 */
window.SKI_MOUNTAINS = [
  {
    id: 'mt-hutt', name: 'Mt Hutt', region: 'Canterbury', island: 'South', type: 'commercial', lat: -43.47, lon: 171.53,
    elev: { base: 1400, mid: 1700, summit: 2086 },
    web: 'https://www.mthutt.co.nz/', cams: 'https://www.mthutt.co.nz/weather-report',
    photo: { file: 'img/mt-hutt.jpg', author: 'Bare Kiwi & Experience Mid Canterbury', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:EMC_Mt_Hutt_Backcountry.jpg', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'Broad south-east-facing basin under a north–south summit ridge',
    summary: 'Mt Hutt sits on a front-range peak of the Southern Alps above the Canterbury Plains, well east of the Main Divide. The ski area is a wide south-east-facing basin below the 2086 m summit ridge, with the South Face on one side and the Towers on the other. Being the first high ground east of the plains makes it very exposed to nor’west gales, but it also catches moist easterly and southerly flows that barely reach the Wanaka fields.',
    windHold: 60,
    winds: [
      { sector: [280, 340], name: 'Nor’west', verdict: 'bad',
        snow: 'Arrives warm and dry as föhn on this side of the Alps. Little or no snow, a rising freezing level, and anything that spills over tends to fall as rain at the base.',
        loading: 'Strips the summit ridge and cross-loads the south-east faces of the main basin. Expect wind slab on lee rollovers once it eases.',
        lifts: 'The classic Mt Hutt closer. Summit lifts go on hold from about 60 km/h and the whole mountain often closes in a strong nor’wester.' },
      { sector: [220, 280], name: 'West to south-west', verdict: 'mixed',
        snow: 'Westerly fronts crossing the divide give some spillover, but Hutt is usually on the dry side. A cold south-west change behind the front can deliver 5–15 cm of much better quality snow.',
        loading: 'South-west wind loads north-east and east aspects: the Towers side and the upper main basin fill in.',
        lifts: 'Usually manageable unless the change is violent.' },
      { sector: [160, 220], name: 'Southerly', verdict: 'good',
        snow: 'Cold southerlies straight off the Southern Ocean are Mt Hutt’s bread and butter. Dry, cold snow with a low freezing level, and the basin is sheltered from the worst of the wind.',
        loading: 'Drifts snow into the north-facing runs off the summit and the upper Towers. The main basin fills evenly.',
        lifts: 'Generally fine. Visibility is the bigger issue during the event.' },
      { sector: [70, 160], name: 'East to south-east', verdict: 'good',
        snow: 'The big-dump setup. A low in the Tasman or off the East Coast pushes moist easterly air up against the Canterbury foothills. Mt Hutt can get 30–60 cm while Queenstown and Wanaka get nothing. The snow is often dense.',
        loading: 'Blows straight into the main basin, so the sheltered west-facing pockets under the summit ridge and the lee slopes of the South Face load heavily.',
        lifts: 'Wind is rarely the problem; road access and visibility are.' },
      { sector: [340, 70], name: 'Northerly', verdict: 'mixed',
        snow: 'Usually warm and pre-frontal. Watch the freezing level. Snow is unlikely unless a low is tracking down the East Coast, in which case the flow may back to the east and deliver.',
        loading: 'Loads the south-facing lines and the South Face lee.',
        lifts: 'Gusty across the summit ridge; the upper lifts can hold.' }
    ],
    signatures: [
      'Best: a cold southerly or south-easterly outbreak with the freezing level under 1200 m.',
      'Big but variable: an East Coast low with easterly flow. Heavy snow, sometimes wet at the base.',
      'Poor: a nor’west storm. Rain, warmth, wind holds, and the road may still close from snow up top.'
    ],
    flags: [
      'Access road closes readily in fresh snow or ice. Chains are required in winter.',
      'A freezing level above 1800 m means rain on most of the mountain.'
    ]
  },
  {
    id: 'cardrona', name: 'Cardrona', region: 'Crown Range, Otago', island: 'South', type: 'commercial', lat: -44.87, lon: 168.95,
    elev: { base: 1670, mid: 1750, summit: 1860 },
    web: 'https://cardrona-treblecone.com/', cams: 'https://cardrona-treblecone.com/webcams',
    photo: { file: 'img/cardrona.jpg', author: 'RoLam007', license: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Cardrona_Alpine_Resort.jpg', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'South and south-east-facing basins below the summit ridge',
    summary: 'Cardrona sits high on the Crown Range between Wanaka and Queenstown, about 30 km east of the Main Divide. The resort is a series of south and south-east-facing basins (Captain’s, Arcadia, McDougall’s, Valley View and Soho) below the 1860 m summit ridge. The high base and sheltered basins give it the most reliable snow surface in the region, even though it receives less precipitation than Treble Cone.',
    windHold: 70,
    winds: [
      { sector: [270, 330], name: 'Nor’west to west', verdict: 'mixed',
        snow: 'Fronts crossing the divide lose much of their moisture before the Crown Range, but strong systems still spill 5–20 cm here, and because the basins sit on the lee side the snow surface holds up well.',
        loading: 'The main loading direction. Captain’s and Arcadia basins and the south-east-facing gullies fill in nicely.',
        lifts: 'The summit is exposed. McDougall’s and Whitestar can hold above about 70 km/h, but the lower chairs usually keep turning.' },
      { sector: [210, 270], name: 'South-west', verdict: 'good',
        snow: 'The classic cold change. South-west flow behind a front delivers cold, dry snow, typically 10–30 cm in a good event, with a low freezing level.',
        loading: 'Loads the east and north-east-facing rolls, the Valley View side, and the lee of the summit ridge.',
        lifts: 'Usually fine once the front has passed.' },
      { sector: [150, 210], name: 'Southerly', verdict: 'mixed',
        snow: 'Cold, but Cardrona sits in the rain shadow of the ranges to the south. Typically light snow or none. Excellent quality when it does fall.',
        loading: 'Blows into the basins, scouring the lower faces and loading the north-facing terrain off the summit.',
        lifts: 'Cold and gusty on the ridge but rarely a closure.' },
      { sector: [30, 150], name: 'Easterly', verdict: 'bad',
        snow: 'Rare and usually dry here. Warm north-easterlies ahead of a Tasman low bring cloud and thaw rather than snow.',
        loading: 'Minimal.',
        lifts: 'Not a wind-hold direction.' },
      { sector: [330, 30], name: 'Northerly', verdict: 'mixed',
        snow: 'Pre-frontal warming, cloud and sometimes rain to the summit before a south-west change. Wait for the change.',
        loading: 'Loads the south-facing basins ahead of the front.',
        lifts: 'Gusty on the summit ridge.' }
    ],
    signatures: [
      'Best: a nor’west front followed by a strong south-west change. Spillover snow, then a cold top-up.',
      'Reliable: any cold south-west outbreak with the freezing level below 1500 m.',
      'Poor: warm northerlies, or a dry southerly that skips the Crown Range.'
    ],
    flags: [
      'The Crown Range road tops out at 1076 m. Carry chains all winter.',
      'The sheltered basins hide wind slab on south-east aspects after a strong nor’wester.'
    ]
  },
  {
    id: 'treble-cone', name: 'Treble Cone', region: 'Harris Mountains, Otago', island: 'South', type: 'commercial', lat: -44.63, lon: 168.89,
    elev: { base: 1260, mid: 1650, summit: 2088 },
    web: 'https://cardrona-treblecone.com/', cams: 'https://cardrona-treblecone.com/webcams',
    photo: { file: 'img/treble-cone.jpg', author: 'Jeff Hitchcock', license: 'CC BY 3.0', url: 'https://commons.wikimedia.org/wiki/File:Treble_Cone_Ski_Area_-_panoramio_(1).jpg', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'East and south-east-facing basins on the Harris Mountains',
    summary: 'Treble Cone is on the Harris Mountains above Lake Wanaka and the Matukituki Valley, closer to the Main Divide than any other commercial field in the region. Home Basin faces east and runs down to the base, the Saddle Basin is a sheltered south-east-facing bowl behind the summit ridge, and the Matukituki Basin faces south-east under the summit. Proximity to the divide means it gets the most snow of the Wanaka fields, but its low base makes the freezing level the key question.',
    windHold: 60,
    winds: [
      { sector: [270, 330], name: 'Nor’west to west', verdict: 'mixed',
        snow: 'TC’s biggest storms come from the nor’west. Fronts stacking against the divide spill into the Harris Mountains and 30–60 cm is possible in a strong event. The catch is temperature: nor’west air is warm, so the base can see rain while it snows above about 1600 m.',
        loading: 'Loads the south-east-facing Saddle Basin and the Motatapu chutes, plus the lee rolls in Home Basin.',
        lifts: 'The Saddle chair and the summit ridge are exposed. Expect holds above about 60 km/h.' },
      { sector: [210, 270], name: 'South-west', verdict: 'good',
        snow: 'The cold change. A south-west front after a nor’wester is the classic TC setup: temperatures drop, snow to the base, and 10–30 cm of drier snow.',
        loading: 'Loads the east-facing Home Basin and Powder Bowl, and the north-east aspects under the summit.',
        lifts: 'Generally fine once the front is through.' },
      { sector: [140, 210], name: 'Southerly', verdict: 'mixed',
        snow: 'Cold, but TC is well north of the strongest southerly snow. Expect light amounts of excellent quality.',
        loading: 'Blows into the Saddle Basin, scouring the upper faces and loading the north-facing lines off the summit.',
        lifts: 'Cold rather than closed.' },
      { sector: [40, 140], name: 'Easterly', verdict: 'mixed',
        snow: 'Uncommon. Brings low cloud into the Wanaka basin and occasionally upslope snow on the eastern faces, especially Home Basin.',
        loading: 'Light loading of the west-facing pockets under the summit.',
        lifts: 'Not a wind-hold direction.' },
      { sector: [330, 40], name: 'Northerly', verdict: 'bad',
        snow: 'Warm pre-frontal flow. High freezing level, rain at the base and gusty wind across the summit. Wait for the south-west change.',
        loading: 'Loads the south-facing terrain but the snow is often wet.',
        lifts: 'Summit and Saddle frequently on hold.' }
    ],
    signatures: [
      'Best: a strong nor’west front with the freezing level under 1500 m, followed by a south-west change.',
      'Powder morning: 20 cm or more overnight, clearing to a cold, calm south-west morning.',
      'Poor: a nor’west storm with the freezing level above 1800 m. Rain to the top of Home Basin.'
    ],
    flags: [
      'The access road is a 7 km unsealed climb from the Matukituki valley. Chains are essential after snow.',
      'Low base. The rain/snow line is everything: check the freezing level against 1260 m.'
    ]
  },
  {
    id: 'coronet-peak', name: 'Coronet Peak', region: 'Queenstown, Otago', island: 'South', type: 'commercial', lat: -44.92, lon: 168.73,
    elev: { base: 1200, mid: 1400, summit: 1649 },
    web: 'https://www.coronetpeak.co.nz/', cams: 'https://www.coronetpeak.co.nz/weather-report',
    photo: { file: 'img/coronet-peak.jpg', author: 'Kiwi Discovery Queenstown', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Coronet_Peak_02.jpg', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'South and south-east-facing slopes above the Wakatipu basin',
    summary: 'Coronet Peak is the closest field to Queenstown and the lowest of the big commercial fields, with a base at 1200 m. The slopes face south and south-east over the Wakatipu basin, which keeps them shaded and holds snow well for the elevation, but the freezing level decides most days. Extensive snowmaking props up the base. It is exposed to nor’west wind along the summit ridge.',
    windHold: 60,
    winds: [
      { sector: [270, 340], name: 'Nor’west', verdict: 'mixed',
        snow: 'Nor’west fronts spill over the divide but arrive warm. Coronet sits low enough that rain reaches the base unless the freezing level is under about 1400 m. When it is cold enough, 10–25 cm is possible.',
        loading: 'The whole field is on the lee side of the ridge, so nor’west wind loads the south-facing bowls and the Back Bowls gullies nicely.',
        lifts: 'The Coronet Express and Greengates top stations are exposed. Holds are common above 60 km/h.' },
      { sector: [200, 270], name: 'South-west', verdict: 'good',
        snow: 'The cold change is what Coronet needs: freezing level down to the valley floor and 10–20 cm of dry snow on the cold south faces.',
        loading: 'Loads the east-facing rolls and the lee of the summit ridge; the main faces get scoured a little.',
        lifts: 'Generally fine once the front has passed.' },
      { sector: [140, 200], name: 'Southerly', verdict: 'mixed',
        snow: 'Cold and clean but often light here; the Remarkables and the ranges to the south take the moisture. Great snow quality when it does fall.',
        loading: 'Blows straight up the main faces; loads the north-facing terrain behind the ridge, mostly outside the boundary.',
        lifts: 'Cold rather than closed.' },
      { sector: [30, 140], name: 'Easterly', verdict: 'bad',
        snow: 'Rare and usually dry, with low cloud filling the basin.',
        loading: 'Minimal.',
        lifts: 'Not a wind-hold direction.' },
      { sector: [340, 30], name: 'Northerly', verdict: 'bad',
        snow: 'Warm pre-frontal flow. Thaw and rain risk to the summit. Wait for the south-west change.',
        loading: 'Loads the south faces but with wet snow.',
        lifts: 'Gusty on the ridge.' }
    ],
    signatures: [
      'Best: a cold south-west change with the freezing level under 1000 m, then a clear morning.',
      'Poor: any warm nor’west or northerly with the freezing level above 1500 m. Rain to the top.',
      'Note: night skiing means an evening freeze can turn a soft day into a fast, firm night.'
    ],
    flags: [
      'Low base at 1200 m. Rain on the lower mountain is the most common problem.',
      'Sealed road, but chains can still be required after a storm.'
    ]
  },
  {
    id: 'remarkables', name: 'The Remarkables', region: 'Queenstown, Otago', island: 'South', type: 'commercial', lat: -45.06, lon: 168.82,
    elev: { base: 1586, mid: 1750, summit: 1943 },
    web: 'https://www.theremarkables.co.nz/', cams: 'https://www.theremarkables.co.nz/weather-report',
    photo: { file: 'img/remarkables.jpg', author: 'Bernard Spragg. NZ from Christchurch, New Zealand', license: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:The_Remarkables._Queenstown_NZ_(8167990319).jpg', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'East to south-facing basins on the back of the Remarkables range',
    summary: 'The Remarkables ski area sits in the Rastus Burn basins on the eastern flank of the range, out of sight of Queenstown. Shadow Basin faces south and stays cold, Sugar Bowl and Curvy Basin face east and north-east and catch the morning sun. The high base at 1586 m and the sheltering ridge to the west give it good snow quality, and the range blocks much of the nor’west wind that troubles Coronet Peak.',
    windHold: 65,
    winds: [
      { sector: [270, 340], name: 'Nor’west', verdict: 'mixed',
        snow: 'The Remarkables ridge takes the brunt of the nor’wester and the basins sit in its lee. Spillover snow is modest, 5–15 cm in a strong front, but the sheltered basins keep it.',
        loading: 'Cross-loads all the lee basins: Shadow Basin, the Sugar Bowl chutes and the Curvy Basin headwall fill in deeply.',
        lifts: 'The Shadow Basin chair and the top of Curvy can hold in strong nor’west gusts crossing the ridge.' },
      { sector: [200, 270], name: 'South-west', verdict: 'good',
        snow: 'Cold south-west flow behind a front delivers the Remarkables’ best snow: 10–30 cm of dry, cold snow with a low freezing level.',
        loading: 'Loads the north-east-facing terrain in Curvy Basin and the east-facing Sugar Bowl.',
        lifts: 'Generally fine once the front has cleared.' },
      { sector: [140, 200], name: 'Southerly', verdict: 'good',
        snow: 'Cold southerlies come straight up the Wakatipu and into the basins. Usually 5–20 cm of high-quality snow.',
        loading: 'Blows into Shadow Basin, scouring the lower faces and loading the north-facing lines off the summit ridge.',
        lifts: 'Shadow Basin chair is exposed to a strong southerly.' },
      { sector: [30, 140], name: 'Easterly', verdict: 'mixed',
        snow: 'Uncommon; occasionally brings upslope snow into the east-facing bowls with low cloud.',
        loading: 'Light loading of the west-facing pockets under the ridge.',
        lifts: 'Not a wind-hold direction.' },
      { sector: [340, 30], name: 'Northerly', verdict: 'bad',
        snow: 'Warm and pre-frontal. Thaw, cloud and rain risk. Wait for the south-west change.',
        loading: 'Loads the south-facing Shadow Basin ahead of the front.',
        lifts: 'Gusty on the ridge.' }
    ],
    signatures: [
      'Best: a nor’west front followed by a strong south-west change. Spillover snow then a cold top-up.',
      'Reliable: any cold southerly or south-west outbreak with the freezing level under 1500 m.',
      'Poor: warm northerlies; a dry nor’wester that skips the basins.'
    ],
    flags: [
      'The access road climbs 900 m on a sealed but steep and exposed alignment. Chains often required.',
      'Shadow Basin holds cold snow long after the sunny side has softened.'
    ]
  },
  {
    id: 'whakapapa', name: 'Whakapapa', region: 'Mt Ruapehu, Central Plateau', island: 'North', type: 'commercial', lat: -39.24, lon: 175.55,
    elev: { base: 1630, mid: 1950, summit: 2300 },
    web: 'https://www.whakapapa.com/', cams: 'https://www.whakapapa.com/report#webcams',
    photo: { file: 'img/whakapapa.jpg', author: 'Kesara Rathnayake from Wellington, New Zealand', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Sky_Waka_Gondola_-IMG_2358-_(54061145859).png', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'North-west-facing slopes of an active volcano',
    summary: 'Whakapapa is on the north-western slopes of Mt Ruapehu, the North Island’s largest ski area and one of its highest. It faces the prevailing westerlies off the Tasman Sea, so it gets a lot of precipitation, but the same exposure makes wind holds the most common problem. There is no shelter: the mountain stands alone on the Central Plateau. The volcanic terrain is open, with few trees and lots of rock, so cover early in the season depends on big falls.',
    windHold: 55,
    winds: [
      { sector: [230, 300], name: 'Westerly', verdict: 'mixed',
        snow: 'The wet direction. Westerly fronts off the Tasman drop the biggest totals on the western slopes, 20–50 cm in a good storm, but they arrive with strong wind and a variable freezing level.',
        loading: 'Strips the upper faces and loads everything east-facing: the Pinnacles side and the gullies under the Knoll Ridge.',
        lifts: 'The upper lifts and the Sky Waka hold once summit wind is around 55 km/h. Westerly storms usually mean a lower-mountain day.' },
      { sector: [180, 230], name: 'South-west', verdict: 'good',
        snow: 'The cold change. South-west flow behind a front brings colder, drier snow and a lower freezing level, often 10–30 cm.',
        loading: 'Loads north-east aspects and the lee of the Knoll Ridge; the lower Rockgarden fills in.',
        lifts: 'Better than a westerly but still gusty on the top lifts.' },
      { sector: [110, 180], name: 'Southerly', verdict: 'good',
        snow: 'Cold, clear air from the south. Whakapapa sits in the lee and gets little snow, but conditions are usually calm, cold and sunny.',
        loading: 'Loads the north-facing slopes below the Knoll Ridge and the upper Waterfall area.',
        lifts: 'Usually all open.' },
      { sector: [300, 360], name: 'Nor’west', verdict: 'bad',
        snow: 'Warm, wet and windy. Rain to the top is common in a strong nor’wester, and the wind is directly onto the field.',
        loading: 'Scours the upper mountain; heavy loading on the south-east faces.',
        lifts: 'The most common closer.' },
      { sector: [0, 110], name: 'North to east', verdict: 'mixed',
        snow: 'Northerlies are warm and pre-frontal. Easterlies are rarer, usually dry, and Whakapapa is sheltered in them.',
        loading: 'Loads the south and west-facing terrain.',
        lifts: 'Northerly gusts across the summit can hold the top lifts.' }
    ],
    signatures: [
      'Best: a westerly storm with the freezing level under 1800 m, followed by a cold southerly clearance. Big snow then blue sky.',
      'Poor: a warm nor’west or northerly system. Rain and wind holds together.',
      'Note: Ruapehu is an active volcano; check GeoNet alert levels along with the weather.'
    ],
    flags: [
      'Wind holds are the main issue here, not snow. Check the summit wind first.',
      'The Bruce Road can close in snow; chains required.'
    ]
  },
  {
    id: 'turoa', name: 'Tūroa', region: 'Mt Ruapehu, Central Plateau', island: 'North', type: 'commercial', lat: -39.32, lon: 175.52,
    elev: { base: 1600, mid: 1950, summit: 2322 },
    web: 'https://www.pureturoa.nz/', cams: 'https://www.pureturoa.nz/webcams',
    photo: { file: 'img/turoa.jpg', author: 'Umedha Shanka Indranath Hettigoda from Auckland, New Zealand', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Turoa,_Mt_Ruapehu,_New_Zealand_(48246803821).jpg', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'South-west-facing slopes of Mt Ruapehu above Ohakune',
    summary: 'Tūroa is on the south-western side of Ruapehu, above Ohakune, with the highest lifted point in New Zealand at 2322 m and the longest vertical in the North Island. Its south-west aspect keeps the snow colder than Whakapapa and it faces the moisture-laden south-westerlies squarely, so it tends to record the bigger totals. The trade-off is exposure: the upper mountain has no shelter from the west or south-west.',
    windHold: 55,
    winds: [
      { sector: [200, 260], name: 'South-west', verdict: 'good',
        snow: 'Tūroa’s snow direction. South-west fronts pile onto the field and 20–50 cm in a storm is normal, with a low freezing level behind the front.',
        loading: 'Blows directly up the field. Loads the north-east-facing terrain behind the ridges, and the lee side of the upper T-bar ridge.',
        lifts: 'The High Noon Express and the upper lifts hold in a strong south-westerly.' },
      { sector: [260, 320], name: 'Westerly to nor’west', verdict: 'mixed',
        snow: 'Westerly fronts still bring good snow but the freezing level rises as the flow backs to the nor’west. Rain on the lower mountain is the risk.',
        loading: 'Loads the south and south-east faces; the lower Giant chair area and the gullies fill.',
        lifts: 'Gusty on the summit ridge.' },
      { sector: [120, 200], name: 'Southerly', verdict: 'good',
        snow: 'Cold, clean air with light snow showers. Turoa gets more from a southerly than Whakapapa does.',
        loading: 'Loads the north-facing bowls behind the upper ridges.',
        lifts: 'Usually fine.' },
      { sector: [320, 30], name: 'Northerly', verdict: 'bad',
        snow: 'Warm and wet. Tūroa sits in the lee, so wind is less of a problem than at Whakapapa, but the freezing level climbs and rain is likely.',
        loading: 'Heavy loading on the south-west faces of the whole field. Wind slab risk when it clears.',
        lifts: 'Better sheltered than Whakapapa in a northerly.' },
      { sector: [30, 120], name: 'Easterly', verdict: 'mixed',
        snow: 'Sheltered and dry. Usually a settled day.',
        loading: 'Minimal.',
        lifts: 'All open as a rule.' }
    ],
    signatures: [
      'Best: a strong south-west storm with the freezing level under 1600 m, then a calm, cold morning.',
      'Poor: a warm northerly with rain to the summit.',
      'Note: Ruapehu is an active volcano; check GeoNet alert levels along with the weather.'
    ],
    flags: [
      'The Ohakune Mountain Road climbs 17 km and closes in heavy snow. Chains required.',
      'High and exposed. Whiteouts in a storm are serious.'
    ]
  },
  {
    id: 'ohau', name: 'Ōhau', region: 'Mackenzie Country', island: 'South', type: 'commercial', lat: -44.23, lon: 169.78,
    elev: { base: 1425, mid: 1600, summit: 1825 },
    web: 'https://www.ohau.co.nz/', cams: 'https://www.ohau.co.nz/snow-report/webcams',
    photo: { file: 'img/ohau.jpg', author: 'sussexbirder', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Lake_Ohau,_Waitaki,_South_Island.jpg', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'South-east-facing bowl on the Ben Ohau Range above Lake Ōhau',
    summary: 'Ōhau is a small field in a single south-east-facing bowl on the Ben Ohau Range, looking down on Lake Ōhau in the Mackenzie Basin. It sits close enough to the Main Divide that nor’west storms pushing up the Hopkins and Dobson valleys can dump on it heavily, which is why it has a reputation for the deepest days in the Mackenzie. It is also cold in southerlies. The whole field is one lee bowl, so loading is generous but so is wind slab.',
    windHold: 60,
    winds: [
      { sector: [270, 330], name: 'Nor’west', verdict: 'good',
        snow: 'Ōhau’s big-dump direction. Moist nor’west air funnels up the Hopkins valley and spills over the Ben Ohau Range, and 30–60 cm in a strong front is possible. Freezing level matters: it needs to be under about 1600 m.',
        loading: 'Loads the entire south-east-facing bowl. Deep on the lee rolls under the summit ridge.',
        lifts: 'The single chair is exposed at the top station; holds above about 60 km/h.' },
      { sector: [200, 270], name: 'South-west', verdict: 'good',
        snow: 'Cold change behind a front. Good quality snow, usually 10–20 cm.',
        loading: 'Loads the east-facing side of the bowl and the lee of the summit ridge.',
        lifts: 'Usually fine.' },
      { sector: [130, 200], name: 'Southerly', verdict: 'mixed',
        snow: 'Cold southerlies bring some snow up the Waitaki, usually light to moderate. Excellent quality.',
        loading: 'Blows into the bowl; scours the lower faces and loads the north-facing lines off the top.',
        lifts: 'Cold rather than closed.' },
      { sector: [40, 130], name: 'Easterly', verdict: 'mixed',
        snow: 'Occasional upslope snow with an East Coast low, usually light this far inland.',
        loading: 'Light.',
        lifts: 'Not a wind-hold direction.' },
      { sector: [330, 40], name: 'Northerly', verdict: 'bad',
        snow: 'Warm and pre-frontal. High freezing level and rain risk until the change.',
        loading: 'Loads the bowl with wet snow.',
        lifts: 'Gusty on the top station.' }
    ],
    signatures: [
      'Best: a nor’west storm with the freezing level under 1500 m, then a south-west clearance.',
      'Poor: warm nor’west or northerly with rain to the top of the chair.',
      'Note: a small field. On a big day the bowl tracks out fast.'
    ],
    flags: [
      'The access road is unsealed and steep. Chains required after snow.',
      'One lee bowl means wind slab after any strong nor’wester.'
    ]
  },
  {
    id: 'mt-dobson', name: 'Mt Dobson', region: 'Mackenzie Country', island: 'South', type: 'commercial', lat: -43.95, lon: 170.64,
    elev: { base: 1600, mid: 1850, summit: 2110 },
    web: 'https://mtdobson.co.nz/', cams: 'https://mtdobson.co.nz/snow-report/',
    photo: { file: 'img/mt-dobson.jpg', author: 'Wildman NZ', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Dobson_38.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'South-facing basin on the Two Thumb Range near Burkes Pass',
    summary: 'Mt Dobson sits in a high, sheltered south-facing basin on the Two Thumb Range between Fairlie and Tekapo. The 1600 m base is one of the highest in the country and the basin is famously sunny and calm, which makes it a good bad-weather bet when the big fields are on wind hold. It is a long way from the Main Divide, so snowfall relies on cold southerlies and easterly systems rather than nor’west spillover.',
    windHold: 65,
    winds: [
      { sector: [270, 340], name: 'Nor’west', verdict: 'mixed',
        snow: 'Mostly dry here; only the strongest fronts spill snow this far east. Warm and gusty on the summit ridge.',
        loading: 'Loads the south-facing basin, which is the whole field. Good for cover, watch for slab.',
        lifts: 'The top T-bar can hold in a strong nor’wester; the basin lifts usually run.' },
      { sector: [200, 270], name: 'South-west', verdict: 'good',
        snow: 'Cold change with moderate snow, typically 5–15 cm of good quality.',
        loading: 'Loads the east side of the basin.',
        lifts: 'Fine.' },
      { sector: [110, 200], name: 'Southerly to south-east', verdict: 'good',
        snow: 'The Two Thumb Range does best in cold southerlies and south-easterlies pushing up from the coast. 10–30 cm in a good event.',
        loading: 'Blows into the basin; loads the north-facing terrain off the summit.',
        lifts: 'Visibility is the issue rather than wind.' },
      { sector: [30, 110], name: 'Easterly', verdict: 'good',
        snow: 'East Coast lows can bring significant snow to the eastern ranges of the Mackenzie.',
        loading: 'Loads the west-facing side of the basin.',
        lifts: 'Fine.' },
      { sector: [340, 30], name: 'Northerly', verdict: 'mixed',
        snow: 'Warm and usually dry ahead of a front.',
        loading: 'Loads the south-facing basin.',
        lifts: 'Gusty on the ridge.' }
    ],
    signatures: [
      'Best: a cold southerly outbreak, then a still, sunny day in the basin.',
      'Good bet: when the big fields are on wind hold in a nor’wester, Dobson’s basin is often skiable.'
    ],
    flags: [
      'Guide is a sketch. Please refine from local knowledge.',
      'Unsealed access road; chains after snow.'
    ]
  },
  {
    id: 'roundhill', name: 'Roundhill', region: 'Lake Tekapo, Mackenzie Country', island: 'South', type: 'commercial', lat: -43.94, lon: 170.69,
    elev: { base: 1350, mid: 1600, summit: 2133 },
    web: 'https://www.roundhill.co.nz/', cams: 'https://www.roundhill.co.nz/plan-your-trip/snow-report/',
    photo: { file: 'img/roundhill.jpg', author: 'Pseudopanax at English Wikipedia', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Winter_view_from_Roundhill_Ski_Area_to_Lake_Tekapo.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'West-facing slopes above Lake Tekapo on the Two Thumb Range',
    summary: 'Roundhill looks west over Lake Tekapo from the Two Thumb Range. The lower field is gentle and sunny, while the Heritage Express rope tow climbs to 2133 m into steep upper terrain. Being far east of the divide and facing away from the coast, it depends on cold southerlies and easterly systems for snow, and the upper tow is very exposed to wind.',
    windHold: 60,
    winds: [
      { sector: [270, 340], name: 'Nor’west', verdict: 'bad',
        snow: 'Dry and warm. Roundhill sits in the lee of the Alps for nor’west spillover and gets little.',
        loading: 'The west-facing slopes are windward and get scoured; loads the east side of the ridge.',
        lifts: 'The upper rope tow holds early in a nor’wester.' },
      { sector: [200, 270], name: 'South-west', verdict: 'mixed',
        snow: 'Cold change with light to moderate snow.',
        loading: 'Loads the north-east-facing terrain above the top of the tow.',
        lifts: 'Upper tow exposed.' },
      { sector: [110, 200], name: 'Southerly to south-east', verdict: 'good',
        snow: 'The Two Thumb Range does best in cold southerlies and south-easterlies. 10–30 cm in a good event.',
        loading: 'Loads the west-facing slopes of the field, which is ideal.',
        lifts: 'Usually fine.' },
      { sector: [30, 110], name: 'Easterly', verdict: 'good',
        snow: 'East Coast lows bring significant snow to the eastern Mackenzie ranges.',
        loading: 'Loads the field’s west aspects.',
        lifts: 'Fine.' },
      { sector: [340, 30], name: 'Northerly', verdict: 'mixed',
        snow: 'Warm, usually dry.',
        loading: 'Loads south faces.',
        lifts: 'Gusty on the top tow.' }
    ],
    signatures: [
      'Best: a cold southerly or easterly system, then a calm, sunny day for the long tow.',
      'Poor: a nor’wester. Little snow and the upper tow on hold.'
    ],
    flags: [
      'Guide is a sketch. Please refine from local knowledge.',
      'Low base at 1350 m; the lower field can be thin.'
    ]
  },
  {
    id: 'porters', name: 'Porters', region: 'Craigieburn Range, Canterbury', island: 'South', type: 'commercial', lat: -43.29, lon: 171.63,
    elev: { base: 1300, mid: 1600, summit: 1980 },
    web: 'https://skiporters.co.nz/', cams: 'https://skiporters.co.nz/',
    photo: { file: 'img/porters.jpg', author: 'Wildman NZ', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Porters_37.jpg', source: 'Wikimedia Commons' },
    detail: 'detailed',
    aspect: 'East and south-east-facing bowls at the southern end of the Craigieburn Range',
    summary: 'Porters is the closest commercial field to Christchurch, on the Craigieburn Range beside Porters Pass. The main field is an east-facing bowl with the long Big Mama run under the summit, and Crystal Valley to the south. It behaves like a smaller Mt Hutt: exposed to nor’west wind, dry in westerlies, and at its best in cold southerlies and easterlies.',
    windHold: 60,
    winds: [
      { sector: [280, 340], name: 'Nor’west', verdict: 'bad',
        snow: 'Warm, dry föhn on the eastern side of the range. Little snow and a rising freezing level.',
        loading: 'Cross-loads the east-facing bowl and Crystal Valley. Wind slab on the lee rolls under the summit.',
        lifts: 'The top T-bar and the summit are the first to close.' },
      { sector: [220, 280], name: 'West to south-west', verdict: 'mixed',
        snow: 'Some spillover in a strong front, better snow behind it on the south-west change.',
        loading: 'Loads the north-east and east faces, which is the main bowl.',
        lifts: 'Manageable.' },
      { sector: [160, 220], name: 'Southerly', verdict: 'good',
        snow: 'Cold southerlies are reliable here. 10–25 cm of dry snow with a low freezing level.',
        loading: 'Loads the north-facing terrain off the summit ridge and fills the bowl evenly.',
        lifts: 'Visibility rather than wind.' },
      { sector: [60, 160], name: 'East to south-east', verdict: 'good',
        snow: 'East Coast lows are the big-dump setup for the Craigieburn Range too. 20–50 cm possible.',
        loading: 'Blows into the bowl; loads the west-facing pockets under the summit.',
        lifts: 'Road access is the constraint.' },
      { sector: [340, 60], name: 'Northerly', verdict: 'mixed',
        snow: 'Warm and pre-frontal. Watch the freezing level against the 1300 m base.',
        loading: 'Loads south faces and Crystal Valley.',
        lifts: 'Gusty on the summit.' }
    ],
    signatures: [
      'Best: a cold southerly or easterly outbreak with the freezing level under 1200 m.',
      'Poor: a nor’west storm. Wind holds and rain at the base.'
    ],
    flags: [
      'Low base at 1300 m. Rain on the lower mountain in warm systems.',
      'Access road is unsealed; chains required after snow.'
    ]
  },
  {
    id: 'craigieburn', name: 'Craigieburn Valley', region: 'Craigieburn Range, Canterbury', island: 'South', type: 'club', lat: -43.13, lon: 171.67,
    elev: { base: 1500, mid: 1650, summit: 1811 },
    web: 'https://www.craigieburn.co.nz/', cams: 'https://www.craigieburn.co.nz/plan#webcam-section',
    photo: { file: 'img/craigieburn.jpg', author: 'Michal Klajban', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Camp_Saddle,_Craigieburn_Range,_New_Zealand_14.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'East-facing basin below Hamilton Peak, nutcracker rope tows',
    summary: 'Craigieburn Valley is the best known of the Canterbury club fields: steep, ungroomed, rope-tow only, in an east-facing basin below Hamilton Peak. It shares the Craigieburn Range’s weather with Broken River and Cheeseman next door. Nor’westers are dry and windy, cold southerlies and easterlies deliver the snow. With no snowmaking and steep terrain, the season depends on a solid base.',
    windHold: 55,
    winds: [
      { sector: [280, 340], name: 'Nor’west', verdict: 'bad',
        snow: 'Dry and warm on this side of the range.',
        loading: 'Cross-loads the east-facing basin heavily. Wind slab is the main avalanche problem after a nor’wester.',
        lifts: 'The top tow holds early; the middle basin can still run.' },
      { sector: [220, 280], name: 'West to south-west', verdict: 'mixed',
        snow: 'Some spillover from a strong front, better snow on the cold change.',
        loading: 'Loads the east and north-east faces, which is the field.',
        lifts: 'Manageable.' },
      { sector: [150, 220], name: 'Southerly', verdict: 'good',
        snow: 'Cold southerlies are the reliable snow direction. 10–25 cm.',
        loading: 'Loads the north-facing terrain below the peak.',
        lifts: 'Visibility rather than wind.' },
      { sector: [60, 150], name: 'East to south-east', verdict: 'good',
        snow: 'East Coast lows deliver the biggest totals to the Craigieburns. 20–50 cm possible.',
        loading: 'Blows into the basin; loads the west-facing pockets under the ridge.',
        lifts: 'Road access is the constraint.' },
      { sector: [340, 60], name: 'Northerly', verdict: 'mixed',
        snow: 'Warm and pre-frontal; usually dry.',
        loading: 'Loads south faces.',
        lifts: 'Gusty on the top tow.' }
    ],
    signatures: [
      'Best: a cold southerly or easterly system, then a still day in the basin.',
      'Poor: a nor’wester. Little snow, wind slab, and the top tow on hold.'
    ],
    flags: [
      'Guide is a sketch. Please refine from local knowledge.',
      'Club field: rope tows need a nutcracker and harness. Access road is unsealed.'
    ]
  },
  {
    id: 'broken-river', name: 'Broken River', region: 'Craigieburn Range, Canterbury', island: 'South', type: 'club', lat: -43.14, lon: 171.68,
    elev: { base: 1400, mid: 1600, summit: 1820 },
    web: 'https://www.brokenriver.co.nz/', cams: 'https://www.brokenriver.co.nz/',
    photo: { file: 'img/broken-river.jpg', author: 'Steve Bennett', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Broken_River_down_main_tow_Stevage.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'Sheltered south-east-facing basin next to Craigieburn Valley',
    summary: 'Broken River is a club field in a sheltered south-east-facing basin on the Craigieburn Range, reached by a walk or the goods lift from the car park. Its aspect keeps snow colder and in better condition than its neighbours after a storm, and the basin is well protected from the nor’wester. Snow comes from the same cold southerlies and easterlies as the rest of the range.',
    windHold: 60,
    winds: [
      { sector: [280, 340], name: 'Nor’west', verdict: 'mixed',
        snow: 'Dry, but the basin is well sheltered, so a nor’wester is often still skiable here when neighbouring fields are closed.',
        loading: 'Loads the south-east-facing basin generously. Watch for slab on the steeper lee rolls.',
        lifts: 'The top tows can hold in a strong one.' },
      { sector: [220, 280], name: 'West to south-west', verdict: 'mixed',
        snow: 'Some spillover; better snow on the cold change.',
        loading: 'Loads the east-facing terrain.',
        lifts: 'Manageable.' },
      { sector: [150, 220], name: 'Southerly', verdict: 'good',
        snow: 'Cold southerlies deliver reliable snow, 10–25 cm.',
        loading: 'Loads the north-facing faces under the ridge.',
        lifts: 'Fine.' },
      { sector: [60, 150], name: 'East to south-east', verdict: 'good',
        snow: 'East Coast lows are the big-dump setup for the Craigieburns.',
        loading: 'Blows into the basin; loads the west-facing pockets under the ridge.',
        lifts: 'Road access is the constraint.' },
      { sector: [340, 60], name: 'Northerly', verdict: 'mixed',
        snow: 'Warm and pre-frontal; usually dry.',
        loading: 'Loads the south-facing terrain, which is most of the field.',
        lifts: 'Gusty on the top.' }
    ],
    signatures: [
      'Best: a cold southerly or easterly storm, then a calm day. The basin keeps snow cold for days.',
      'Good bet: when Craigieburn Valley is on wind hold, Broken River’s basin is often still turning.'
    ],
    flags: [
      'Guide is a sketch. Please refine from local knowledge.',
      'Club field: nutcracker rope tows. Steep unsealed access road.'
    ]
  },
  {
    id: 'cheeseman', name: 'Mt Cheeseman', region: 'Craigieburn Range, Canterbury', island: 'South', type: 'club', lat: -43.16, lon: 171.64,
    elev: { base: 1580, mid: 1700, summit: 1880 },
    web: 'https://www.mtcheeseman.co.nz/', cams: 'https://www.mtcheeseman.co.nz/webcam/',
    photo: { file: 'img/cheeseman.jpg', author: 'Wildman NZ', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Cheeseman_30.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'Gentle south-east-facing basin with T-bars',
    summary: 'Mt Cheeseman is the family-friendly club field of the Craigieburn Range, with T-bars instead of rope tows and a gentle, sunny south-east-facing basin. The high base at 1580 m and sheltered aspect give it consistent snow. Weather-wise it behaves like its neighbours: dry and gusty in a nor’wester, snowy in southerlies and easterlies.',
    windHold: 65,
    winds: [
      { sector: [280, 340], name: 'Nor’west', verdict: 'mixed',
        snow: 'Dry and warm. The basin is reasonably sheltered.',
        loading: 'Loads the south-east-facing basin.',
        lifts: 'The top T-bar can hold in a strong nor’wester.' },
      { sector: [220, 280], name: 'West to south-west', verdict: 'mixed',
        snow: 'Light spillover; better on the cold change.',
        loading: 'Loads east-facing terrain.',
        lifts: 'Fine.' },
      { sector: [150, 220], name: 'Southerly', verdict: 'good',
        snow: 'Reliable cold snow, 10–25 cm in a good event.',
        loading: 'Loads north faces under the ridge.',
        lifts: 'Fine.' },
      { sector: [60, 150], name: 'East to south-east', verdict: 'good',
        snow: 'East Coast lows bring the biggest totals.',
        loading: 'Blows into the basin.',
        lifts: 'Road access is the constraint.' },
      { sector: [340, 60], name: 'Northerly', verdict: 'mixed',
        snow: 'Warm, usually dry.',
        loading: 'Loads south faces.',
        lifts: 'Gusty.' }
    ],
    signatures: [
      'Best: a cold southerly, then a sunny, calm day in the basin.'
    ],
    flags: [
      'Guide is a sketch. Please refine from local knowledge.',
      'Unsealed access road; chains after snow.'
    ]
  },
  {
    id: 'mt-olympus', name: 'Mt Olympus', region: 'Craigieburn Range, Canterbury', island: 'South', type: 'club', lat: -43.21, lon: 171.56,
    elev: { base: 1550, mid: 1700, summit: 1900 },
    web: 'https://www.mtolympus.co.nz/', cams: 'https://www.mtolympus.co.nz/the-mountain/conditions#webcams',
    photo: { file: 'img/mt-olympus.jpg', author: 'Michal Klajban', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Mt_Olympus,_Craigieburn_Range,_Canterbury,_New_Zealand_05.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'South-east-facing basin at the southern end of the Craigieburn Range',
    summary: 'Mt Olympus is a club field in a south-east-facing basin at the southern end of the Craigieburn Range, above Lake Coleridge. Rope tows serve steep, open terrain with a reputation for holding powder. It is dry in the nor’wester like its neighbours, and cold southerlies and easterlies bring the snow.',
    windHold: 55,
    winds: [
      { sector: [280, 340], name: 'Nor’west', verdict: 'bad',
        snow: 'Dry and warm. Strong wind over the ridge.',
        loading: 'Loads the south-east-facing basin heavily; wind slab after the event.',
        lifts: 'Top tow holds early.' },
      { sector: [220, 280], name: 'West to south-west', verdict: 'mixed',
        snow: 'Light spillover; better on the cold change.',
        loading: 'Loads east faces.',
        lifts: 'Manageable.' },
      { sector: [150, 220], name: 'Southerly', verdict: 'good',
        snow: 'Reliable cold snow.',
        loading: 'Loads north faces under the ridge.',
        lifts: 'Fine.' },
      { sector: [60, 150], name: 'East to south-east', verdict: 'good',
        snow: 'East Coast lows bring the biggest totals.',
        loading: 'Blows into the basin.',
        lifts: 'Road access is the constraint.' },
      { sector: [340, 60], name: 'Northerly', verdict: 'mixed',
        snow: 'Warm, usually dry.',
        loading: 'Loads south faces.',
        lifts: 'Gusty.' }
    ],
    signatures: [
      'Best: a cold southerly or easterly storm, then a calm day on the tows.'
    ],
    flags: [
      'Guide is a sketch. Please refine from local knowledge.',
      'Club field: nutcracker rope tows. Long unsealed access road with a steep final climb.'
    ]
  },
  {
    id: 'temple-basin', name: 'Temple Basin', region: 'Arthur’s Pass, Canterbury', island: 'South', type: 'club', lat: -42.91, lon: 171.58,
    elev: { base: 1400, mid: 1600, summit: 1870 },
    web: 'https://templebasin.co.nz/', cams: 'https://templebasin.co.nz/',
    photo: { file: 'img/temple-basin.jpg', author: 'Kabelleger / David Gubler', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:KiwiRail_DXC_class_Cass.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'East and south-east-facing basins right on the Main Divide',
    summary: 'Temple Basin is a walk-in club field beside Arthur’s Pass, closer to the Main Divide than any other field in Canterbury. That position means it collects the nor’west spillover snow the eastern fields miss, and totals here can be huge. It also means more wind, more cloud and warmer storms. The basins face east and south-east under the Temple Basin peaks.',
    windHold: 55,
    winds: [
      { sector: [270, 340], name: 'Nor’west', verdict: 'good',
        snow: 'The snow direction. Nor’west storms stacking on the divide dump heavily here, 30–80 cm in a big event, as long as the freezing level stays under about 1500 m.',
        loading: 'Loads the east and south-east-facing basins deeply. Serious wind slab and avalanche risk after a big one.',
        lifts: 'The top tows hold in strong wind; the storm skiing is in the sheltered lower basins.' },
      { sector: [200, 270], name: 'South-west', verdict: 'good',
        snow: 'Cold change behind a front with more snow and a low freezing level.',
        loading: 'Loads north-east-facing terrain.',
        lifts: 'Fine once the front passes.' },
      { sector: [120, 200], name: 'Southerly', verdict: 'mixed',
        snow: 'Cold, with light snow; the divide is not the southerly’s best target.',
        loading: 'Blows into the basins; loads north faces.',
        lifts: 'Fine.' },
      { sector: [30, 120], name: 'Easterly', verdict: 'mixed',
        snow: 'East Coast lows can reach here with moderate snow.',
        loading: 'Loads west-facing pockets.',
        lifts: 'Fine.' },
      { sector: [340, 30], name: 'Northerly', verdict: 'bad',
        snow: 'Warm and wet. Rain at this elevation is common in a northerly.',
        loading: 'Loads south faces with wet snow.',
        lifts: 'Gusty.' }
    ],
    signatures: [
      'Best: a nor’west storm with a freezing level under 1400 m, then a south-west clearance.',
      'Poor: a warm nor’west or northerly. Rain to the tows.'
    ],
    flags: [
      'Guide is a sketch. Please refine from local knowledge.',
      'Walk-in field: about an hour uphill from the road. Avalanche terrain; carry gear.'
    ]
  },
  {
    id: 'mt-lyford', name: 'Mt Lyford', region: 'North Canterbury', island: 'South', type: 'commercial', lat: -42.50, lon: 172.85,
    elev: { base: 1390, mid: 1550, summit: 1750 },
    web: 'https://www.mtlyford.co.nz/', cams: 'https://www.mtlyford.co.nz/full-snow-report',
    photo: { file: 'img/mt-lyford.jpg', author: 'Justin McCormack', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Mt_Lyford_New_Zealand.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'South-east-facing slopes in the inland Kaikōura foothills',
    summary: 'Mt Lyford is a small field between Hanmer Springs and Kaikōura on the inland side of the Kaikōura ranges. Its slopes face south-east, and like the other eastern fields it does best in cold southerlies and easterly systems, when moist air is pushed onto the ranges from the coast. Nor’westers are dry and warm here.',
    windHold: 60,
    winds: [
      { sector: [280, 340], name: 'Nor’west', verdict: 'bad',
        snow: 'Dry and warm.',
        loading: 'Loads the south-east faces.',
        lifts: 'Exposed on the ridge.' },
      { sector: [220, 280], name: 'West to south-west', verdict: 'mixed',
        snow: 'Light; better on the cold change.',
        loading: 'Loads east faces.',
        lifts: 'Fine.' },
      { sector: [150, 220], name: 'Southerly', verdict: 'good',
        snow: 'Cold southerlies bring reliable snow to the Kaikōura ranges.',
        loading: 'Loads north faces.',
        lifts: 'Fine.' },
      { sector: [40, 150], name: 'East to south-east', verdict: 'good',
        snow: 'The big-dump direction: an East Coast low pushing moist air onto the ranges.',
        loading: 'Blows into the field; loads west-facing pockets.',
        lifts: 'Road access is the constraint.' },
      { sector: [340, 40], name: 'Northerly', verdict: 'mixed',
        snow: 'Warm, usually dry.',
        loading: 'Loads south faces.',
        lifts: 'Gusty.' }
    ],
    signatures: [
      'Best: an East Coast low or a cold southerly, then a calm day.'
    ],
    flags: [
      'Guide is a sketch. Please refine from local knowledge.',
      'Small field; check it is operating before driving.'
    ]
  },
  {
    id: 'rainbow', name: 'Rainbow', region: 'Nelson Lakes', island: 'South', type: 'commercial', lat: -41.87, lon: 172.86,
    elev: { base: 1440, mid: 1600, summit: 1760 },
    web: 'https://skirainbow.co.nz/', cams: 'https://skirainbow.co.nz/webcams/',
    photo: { file: 'img/rainbow.jpg', author: 'Zoharby', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Panoramic_view_of_Lake_Rotoiti.jpg', source: 'Wikimedia Commons' },
    detail: 'sketch',
    aspect: 'Basin on the St Arnaud Range above Lake Rotoiti',
    summary: 'Rainbow is the northernmost ski area in the South Island, on the St Arnaud Range in Nelson Lakes. It sits between the westerly-driven weather of the Buller and the drier Marlborough side, so it takes snow from westerly and south-westerly fronts crossing the ranges and from cold southerlies. Being small and northern, it is sensitive to the freezing level.',
    windHold: 60,
    winds: [
      { sector: [250, 330], name: 'Westerly to nor’west', verdict: 'mixed',
        snow: 'Westerly fronts crossing the Nelson ranges bring the bigger totals, but nor’west flow is warm and can mean rain at this elevation.',
        loading: 'Loads the eastern lee side of the range.',
        lifts: 'Exposed on the ridge.' },
      { sector: [190, 250], name: 'South-west', verdict: 'good',
        snow: 'Cold change with good snow and a low freezing level.',
        loading: 'Loads north-east faces.',
        lifts: 'Fine.' },
      { sector: [120, 190], name: 'Southerly', verdict: 'good',
        snow: 'Cold southerlies bring reliable snow.',
        loading: 'Loads north faces.',
        lifts: 'Fine.' },
      { sector: [30, 120], name: 'Easterly', verdict: 'mixed',
        snow: 'Occasional upslope snow from a low to the east.',
        loading: 'Light.',
        lifts: 'Fine.' },
      { sector: [330, 30], name: 'Northerly', verdict: 'bad',
        snow: 'Warm and wet. Rain risk.',
        loading: 'Loads south faces.',
        lifts: 'Gusty.' }
    ],
    signatures: [
      'Best: a westerly front with the freezing level under 1400 m, then a cold southerly clearance.'
    ],
    flags: [
      'Guide is a sketch, including the aspect. Please refine from local knowledge.',
      'Unsealed access road; chains after snow.'
    ]
  }
];
