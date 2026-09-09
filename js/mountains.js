/*
 * Mountain guide data. This is the file to edit when you want to correct or
 * extend the local knowledge for a field, or add a new mountain.
 *
 * Wind sectors use meteorological convention: the direction the wind blows
 * FROM, in degrees clockwise from north. A sector [from, to] runs clockwise
 * from `from` to `to`, so [330, 30] covers north.
 *
 * verdict: 'good' | 'mixed' | 'bad'  (colours the compass sector)
 * windHold: summit wind speed in km/h at which lifts typically go on hold.
 *
 * The daily recording script (scripts/update.py) reads id, lat, lon and
 * elev.mid from this file, so keep those keys on the lines shown here.
 */
window.SKI_MOUNTAINS = [
  {
    id: 'mt-hutt', name: 'Mt Hutt', region: 'Canterbury', lat: -43.47, lon: 171.53,
    elev: { base: 1400, mid: 1700, summit: 2086 },
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
    id: 'cardrona', name: 'Cardrona', region: 'Crown Range, Otago', lat: -44.87, lon: 168.95,
    elev: { base: 1670, mid: 1750, summit: 1860 },
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
    id: 'treble-cone', name: 'Treble Cone', region: 'Harris Mountains, Otago', lat: -44.63, lon: 168.89,
    elev: { base: 1260, mid: 1650, summit: 2088 },
    aspect: 'East and south-east-facing basins on the Harris Mountains',
    summary: 'Treble Cone is on the Harris Mountains above Lake Wanaka and the Matukituki Valley, closer to the Main Divide than any other commercial field in the region. Home Basin faces east and runs down to the base, the Saddle Basin is a sheltered south-east-facing bowl behind the summit ridge, and the Matukituki Basin faces south-east under the summit. Proximity to the divide means it gets the most snow of the three, but its low base makes the freezing level the key question.',
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
  }
];
