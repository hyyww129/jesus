/* ==========================================================================
   BIBLE QUEST — ILLUMINATED PORTRAITS
   Inline-SVG portraits in the manuscript style: gold roundel frame, lapis
   ground, stylised figure, and emblems drawn from each person's story.
   Figures are deliberately abstract (no faces) — icons, not likenesses.

   Every colour below matches a design token in styles.css, except PP_PURPLE,
   an art-only tone for Lydia's purple cloth. Emblems live in PORTRAIT_PARTS
   with a layer: 'bg' behind the figure, 'ov' over the robe, 'fg' in front.
   To give a new person a portrait, add one PERSON_ART line; anyone without
   an entry gets the plain figure automatically.
   ========================================================================== */
const PP_GOLD = '#C9A227', PP_GOLDL = '#EBCE7A', PP_GOLDD = '#6E5C22';
const PP_LAPIS = '#182468', PP_LAPIS2 = '#22307F', PP_LAPIS3 = '#3243A8';
const PP_VELLUM = '#EFE6CC', PP_VELLUM2 = '#D6C9A4', PP_VELDIM = '#9C916F';
const PP_INK = '#090C1E', PP_VERM = '#C0453A', PP_VERD = '#3E9A80';
const PP_SKY = '#8CAAEB', PP_MUTED = '#9A9DBB';
const PP_PURPLE = '#5C4C8C'; /* Lydia's trade (Acts 16:14) — art-only tone */

const pStar = (x, y, s) =>
  `<path d="M${x} ${y - s} L${x + s / 3} ${y - s / 3} L${x + s} ${y} L${x + s / 3} ${y + s / 3} L${x} ${y + s} L${x - s / 3} ${y + s / 3} L${x - s} ${y} L${x - s / 3} ${y - s / 3} Z"/>`;

const PORTRAIT_PARTS = {
  /* -------- behind the figure -------- */
  rays:    { z: 'bg', d: `<g stroke="${PP_GOLDL}" stroke-width="1.6" opacity=".8" stroke-linecap="round"><path d="M50 18 v-7 M36 22 l-5 -6 M64 22 l5 -6 M28 32 l-7 -3 M72 32 l7 -3"/></g>` },
  stars:   { z: 'bg', d: `<g fill="${PP_GOLDL}">${pStar(22, 20, 3.5)}${pStar(34, 30, 2.5)}${pStar(64, 14, 3)}</g>` },
  rainbow: { z: 'bg', d: `<g fill="none" stroke-width="2.4"><path d="M18 34 Q50 4 82 34" stroke="${PP_GOLD}"/><path d="M22 36 Q50 10 78 36" stroke="${PP_VERM}" opacity=".65"/><path d="M26 38 Q50 16 74 38" stroke="${PP_SKY}"/></g>` },
  ladder:  { z: 'bg', d: `<g stroke="${PP_GOLDD}" stroke-width="2"><path d="M14 88 L32 16 M26 88 L44 16"/><path d="M18 72 h13 M21 58 h13 M24 44 h13 M27 30 h13" stroke-width="1.4"/></g>` },
  wheel:   { z: 'bg', d: `<g fill="none" stroke="${PP_GOLDL}" opacity=".75"><circle cx="77" cy="44" r="14" stroke-width="2"/><circle cx="77" cy="44" r="7" stroke-width="1.4"/><path d="M77 30 v28 M63 44 h28 M67 34 l20 20 M87 34 l-20 20" stroke-width="1"/></g>` },
  pillars: { z: 'bg', d: `<g fill="${PP_LAPIS2}" stroke="${PP_GOLDD}"><rect x="10" y="42" width="8" height="46"/><rect x="8" y="37" width="12" height="5"/><rect x="82" y="42" width="8" height="46"/><rect x="80" y="37" width="12" height="5"/></g>` },
  /* -------- over the robe -------- */
  stripes: { z: 'ov', d: `<g stroke-width="2.4" fill="none" opacity=".9"><path d="M38 63 Q37 76 34 90" stroke="${PP_VERM}"/><path d="M46 59 Q45 75 44 90" stroke="${PP_SKY}"/><path d="M54 59 Q55 75 56 90" stroke="${PP_VERD}"/><path d="M62 63 Q63 76 66 90" stroke="${PP_GOLDL}"/></g>` },
  ephod:   { z: 'ov', d: `<rect x="42" y="64" width="16" height="17" fill="${PP_GOLD}" stroke="${PP_GOLDD}"/><g><circle cx="46" cy="68" r="1.5" fill="${PP_VERM}"/><circle cx="50" cy="68" r="1.5" fill="${PP_SKY}"/><circle cx="54" cy="68" r="1.5" fill="${PP_VERD}"/><circle cx="46" cy="73" r="1.5" fill="${PP_VERD}"/><circle cx="50" cy="73" r="1.5" fill="${PP_VERM}"/><circle cx="54" cy="73" r="1.5" fill="${PP_SKY}"/><circle cx="46" cy="78" r="1.5" fill="${PP_SKY}"/><circle cx="50" cy="78" r="1.5" fill="${PP_VERD}"/><circle cx="54" cy="78" r="1.5" fill="${PP_VERM}"/></g>` },
  trim:    { z: 'ov', d: `<path d="M24 90 Q26 62 50 57 Q74 62 76 90" fill="none" stroke="${PP_GOLD}" stroke-width="2"/>` },
  mantle:  { z: 'ov', d: `<path d="M30 62 Q50 50 70 62 L74 90 H64 Q60 68 50 68 Q40 68 36 90 H26 Z" fill="${PP_GOLDD}" opacity=".9" stroke="${PP_INK}" stroke-width="1"/>` },
  /* -------- in front (held emblems) -------- */
  staff:   { z: 'fg', d: `<path d="M74 26 Q80 20 84 26 Q86 31 81 32 M78 28 L72 90" stroke="${PP_GOLDD}" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  tablets: { z: 'fg', d: `<g fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"><path d="M14 82 v-14 q0 -5 6 -5 q6 0 6 5 v14 z"/><path d="M28 82 v-14 q0 -5 6 -5 q6 0 6 5 v14 z"/><path d="M18 70 h4 M18 74 h4 M32 70 h4 M32 74 h4" stroke-width="1"/></g>` },
  sling:   { z: 'fg', d: `<g stroke="${PP_GOLDD}" stroke-width="2" fill="none" stroke-linecap="round"><path d="M22 58 Q14 72 24 82"/><circle cx="26" cy="85" r="3" fill="${PP_VELLUM2}" stroke-width="1"/></g>` },
  harp:    { z: 'fg', d: `<path d="M68 56 Q86 60 82 84 L70 84 Q63 68 68 56 Z" fill="none" stroke="${PP_GOLD}" stroke-width="2.4"/><path d="M71 63 L72 84 M75 65 L76 84 M79 68 L80 84" stroke="${PP_GOLDL}" stroke-width="1"/>` },
  grain:   { z: 'fg', d: `<g stroke="${PP_GOLD}" stroke-width="1.5" fill="${PP_GOLDL}"><path d="M76 88 Q73 70 70 62 M76 88 Q79 68 82 62 M76 88 L76 58" fill="none"/><ellipse cx="70" cy="59" rx="2.5" ry="5"/><ellipse cx="76" cy="55" rx="2.5" ry="5"/><ellipse cx="82" cy="59" rx="2.5" ry="5"/></g>` },
  scroll:  { z: 'fg', d: `<g><rect x="34" y="75" width="32" height="10" rx="2" fill="${PP_VELLUM}" stroke="${PP_GOLDD}"/><circle cx="34" cy="80" r="5" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"/><circle cx="66" cy="80" r="5" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"/><path d="M42 78 h16 M42 82 h16" stroke="${PP_GOLDD}" stroke-width="1" opacity=".6"/></g>` },
  lion:    { z: 'fg', d: `<g><g stroke="${PP_GOLDD}" stroke-width="2" stroke-linecap="round"><path d="M26 63 v-4 M18 67 l-4 -4 M15 75 h-5 M18 83 l-4 4 M34 67 l4 -4 M37 75 h5 M34 83 l4 4"/></g><circle cx="26" cy="75" r="8.5" fill="${PP_GOLD}"/><circle cx="23" cy="73" r="1.2" fill="${PP_INK}"/><circle cx="29" cy="73" r="1.2" fill="${PP_INK}"/><ellipse cx="26" cy="78" rx="3.2" ry="2.6" fill="${PP_VELLUM2}"/></g>` },
  keys:    { z: 'fg', d: `<g stroke="${PP_GOLDL}" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M42 64 L30 82 M30 82 l-4 -1 M30 82 l1 4"/><circle cx="44" cy="61" r="4"/><path d="M58 64 L70 82 M70 82 l4 -1 M70 82 l-1 4"/><circle cx="56" cy="61" r="4"/></g>` },
  fish:    { z: 'fg', d: `<g fill="${PP_SKY}" opacity=".9"><path d="M12 87 q6 -5 13 0 q-7 5 -13 0 z"/><path d="M25 87 l5 -4 v8 z"/></g>` },
  flame:   { z: 'fg', d: `<path d="M74 84 q-8 -8 0 -18 q2 6 6 8 q4 -6 2 -10 q10 8 4 20 q-5 6 -12 0 z" fill="${PP_VERM}" stroke="${PP_GOLDL}" stroke-width="1.2"/>` },
  ark:     { z: 'fg', d: `<g><rect x="20" y="62" width="12" height="9" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"/><path d="M13 72 h26 l-4 10 q-9 5 -18 0 z" fill="${PP_GOLDD}" stroke="${PP_INK}" stroke-width="1"/></g>` },
  tent:    { z: 'fg', d: `<g stroke="${PP_GOLDD}" fill="${PP_VELLUM2}"><path d="M13 83 L26 60 L39 83 Z"/><path d="M26 60 V83 M20 83 L26 70 L32 83" fill="none" stroke-width="1"/></g>` },
  wood:    { z: 'fg', d: `<g stroke="${PP_GOLDD}" stroke-width="3" stroke-linecap="round"><path d="M14 83 L36 71 M14 75 L36 79 M17 67 L33 85"/></g>` },
  shofar:  { z: 'fg', d: `<path d="M68 80 q14 0 16 -14 q1 -7 -4 -9 q1 11 -6 14 q-5 2 -8 3 z" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"/>` },
  bricks:  { z: 'fg', d: `<g fill="${PP_LAPIS2}" stroke="${PP_GOLD}" stroke-width="1"><rect x="13" y="79" width="11" height="6"/><rect x="25" y="79" width="11" height="6"/><rect x="18" y="72" width="11" height="6"/><rect x="30" y="72" width="11" height="6"/></g>` },
  cord:    { z: 'fg', d: `<path d="M79 12 q4 30 -4 44 q-3 6 2 10" fill="none" stroke="${PP_VERM}" stroke-width="2.5" stroke-linecap="round"/>` },
  palm:    { z: 'fg', d: `<g stroke="${PP_VERD}" fill="none" stroke-width="2"><path d="M78 88 q-2 -16 0 -26"/><path d="M78 62 q-10 -6 -14 -2 M78 62 q-2 -10 4 -14 M78 62 q10 -4 12 2 M78 62 q-9 -11 -3 -16" stroke-width="1.8"/></g>` },
  torchjar:{ z: 'fg', d: `<g><path d="M72 86 q-6 -10 0 -16 h8 q6 6 0 16 z" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"/><path d="M76 68 q-4 -6 0 -10 q1 4 4 5 q2 -3 1 -6 q6 5 2 11 q-3 3 -7 0 z" fill="${PP_VERM}" stroke="${PP_GOLDL}" stroke-width="1"/></g>` },
  horn:    { z: 'fg', d: `<path d="M70 84 q16 -4 12 -20 q-2 -8 -8 -8 q4 8 0 14 q-4 8 -12 10 z" fill="${PP_GOLD}" stroke="${PP_GOLDD}"/>` },
  spear:   { z: 'fg', d: `<g stroke="${PP_GOLDD}"><path d="M78 90 L78 30" stroke-width="2.5"/><path d="M78 28 l-4 9 h8 z" fill="${PP_VELLUM2}" stroke-width="1.5"/></g>` },
  temple:  { z: 'fg', d: `<g fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"><rect x="14" y="67" width="5" height="17"/><rect x="27" y="67" width="5" height="17"/><path d="M10 67 h26 l-3 -7 h-20 z"/></g>` },
  sunsteps:{ z: 'fg', d: `<g><circle cx="79" cy="56" r="6" fill="${PP_GOLDL}"/><g stroke="${PP_GOLDL}" stroke-width="1.4" stroke-linecap="round"><path d="M79 46 v-4 M71 58 h-4 M87 58 h4 M73 50 l-3 -3 M85 50 l3 -3"/></g><path d="M64 88 h8 v-7 h8 v-7 h8" fill="none" stroke="${PP_GOLDD}" stroke-width="2"/></g>` },
  coal:    { z: 'fg', d: `<g><path d="M17 85 L32 63 M24 87 L34 67" stroke="${PP_GOLDD}" stroke-width="2"/><circle cx="34" cy="64" r="4" fill="${PP_VERM}" stroke="${PP_GOLDL}"/></g>` },
  jar:     { z: 'fg', d: `<path d="M22 62 q-8 9 -5 18 q2 8 9 8 q7 0 9 -8 q3 -9 -5 -18 q4 -3 0 -5 h-8 q-4 2 0 5 z" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"/>` },
  scepter: { z: 'fg', d: `<g><path d="M70 88 L84 58" stroke="${PP_GOLD}" stroke-width="2.5" stroke-linecap="round"/><circle cx="85" cy="55" r="3.5" fill="${PP_GOLDL}"/></g>` },
  trowel:  { z: 'fg', d: `<g><path d="M82 70 l-12 12 l16 4 z" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"/><path d="M70 82 l-8 6" stroke="${PP_GOLDD}" stroke-width="3" stroke-linecap="round"/></g>` },
  bookquill:{ z: 'fg', d: `<g><path d="M32 78 q9 -5 18 0 q9 -5 18 0 v8 q-9 -4 -18 0 q-9 -4 -18 0 z" fill="${PP_VELLUM}" stroke="${PP_GOLDD}"/><path d="M50 78 v8" stroke="${PP_GOLDD}" stroke-width="1"/><path d="M74 60 q6 -10 10 -12 q-2 8 -6 14 l-4 4 z" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}"/></g>` },
  lily:    { z: 'fg', d: `<g><path d="M78 86 q-1 -14 0 -20" stroke="${PP_VERD}" stroke-width="2" fill="none"/><path d="M78 64 q-7 -2 -7 -9 q7 1 7 9 z M78 64 q7 -2 7 -9 q-7 1 -7 9 z M78 64 q0 -9 0 -11" fill="${PP_VELLUM}" stroke="${PP_VELLUM}" stroke-width="1.4"/></g>` },
  drops:   { z: 'fg', d: `<g fill="${PP_SKY}"><path d="M70 60 q4 6 0 9 q-5 -3 0 -9 z M80 66 q4 6 0 9 q-5 -3 0 -9 z M74 76 q4 6 0 9 q-5 -3 0 -9 z"/></g>` },
  stones:  { z: 'fg', d: `<g fill="${PP_VELDIM}" stroke="${PP_INK}" stroke-width=".8"><ellipse cx="20" cy="84" rx="5" ry="4"/><ellipse cx="30" cy="86" rx="4" ry="3.4"/><ellipse cx="26" cy="78" rx="4" ry="3.2"/></g>` },
  coins:   { z: 'fg', d: `<g><path d="M20 70 q-8 8 -2 16 q8 6 14 0 q6 -8 -2 -16 q-2 -4 -10 0 z" fill="${PP_GOLDD}" stroke="${PP_INK}" stroke-width="1"/><circle cx="35" cy="86" r="3" fill="${PP_GOLDL}"/><circle cx="41" cy="82" r="3" fill="${PP_GOLDL}"/></g>` },
  clothbolt:{ z: 'fg', d: `<g fill="${PP_PURPLE}" stroke="${PP_INK}" stroke-width=".8"><rect x="14" y="70" width="22" height="5" rx="2"/><rect x="16" y="76" width="22" height="5" rx="2"/><rect x="14" y="82" width="22" height="5" rx="2"/></g>` },
  eagle:   { z: 'fg', d: `<g fill="${PP_GOLDD}" stroke="${PP_GOLD}" stroke-width="1"><path d="M78 62 q-10 -2 -14 6 q8 -2 10 2 q-6 4 -4 10 q6 -6 10 -6 q4 0 6 -4 q-2 -6 -8 -8 z"/><circle cx="79" cy="61" r="2.5" fill="${PP_GOLD}"/></g>` },
  fruit:   { z: 'fg', d: `<g><circle cx="77" cy="72" r="6" fill="${PP_VERM}" stroke="${PP_GOLDD}"/><path d="M77 66 q1 -4 4 -5" stroke="${PP_VERD}" fill="none" stroke-width="1.5"/><path d="M77 64 q4 -2 6 1 q-4 2 -6 -1 z" fill="${PP_VERD}"/></g>` },
  sprig:   { z: 'fg', d: `<g stroke="${PP_VERD}" fill="${PP_VERD}"><path d="M24 86 q0 -14 4 -22" fill="none" stroke-width="2"/><path d="M26 74 q-8 -2 -10 -8 q8 0 10 8 z M28 66 q8 -2 10 -8 q-8 0 -10 8 z"/></g>` },
  greatfish:{ z: 'fg', d: `<g><path d="M12 76 q12 -12 26 -3 q-5 9 -16 9 q-6 0 -10 -6 z" fill="${PP_SKY}" stroke="${PP_LAPIS2}" stroke-width="1"/><path d="M38 73 l9 -7 l-2 11 z" fill="${PP_SKY}"/><circle cx="20" cy="73" r="1.5" fill="${PP_INK}"/><path d="M12 88 q6 -4 12 0 q6 4 12 0 q6 -4 12 0" fill="none" stroke="${PP_SKY}" stroke-width="1.5" opacity=".7"/></g>` }
};

/* Head styles, drawn after the head circle. */
const PORTRAIT_HEADS = {
  hair:      `<path d="M37 37 Q37 25 50 24 Q63 25 63 37 Q57 29 50 29 Q43 29 37 37 Z" fill="${PP_GOLDD}"/>`,
  tresses:   `<path d="M37 36 Q36 24 50 23 Q64 24 63 36 L64 56 Q60 60 58 54 L58 38 Q56 30 50 30 Q44 30 42 38 L42 54 Q40 60 36 56 Z" fill="${PP_GOLDD}"/>`,
  beard:     `<path d="M40 46 Q42 59 50 60 Q58 59 60 46 Q55 52 50 52 Q45 52 40 46 Z" fill="${PP_GOLDD}"/>`,
  beardGrey: `<path d="M40 46 Q42 59 50 60 Q58 59 60 46 Q55 52 50 52 Q45 52 40 46 Z" fill="${PP_VELDIM}"/>`,
  beardWhite:`<path d="M40 46 Q41 62 50 63 Q59 62 60 46 Q55 52 50 52 Q45 52 40 46 Z" fill="${PP_VELLUM}"/>`,
  veil:      `<path d="M34 58 Q30 28 50 23 Q70 28 66 58 L60 46 Q61 31 50 31 Q39 31 40 46 Z" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}" stroke-width=".8"/>`,
  veilBlue:  `<path d="M34 58 Q30 28 50 23 Q70 28 66 58 L60 46 Q61 31 50 31 Q39 31 40 46 Z" fill="${PP_SKY}" stroke="${PP_GOLDD}" stroke-width=".8"/>`,
  veilPurple:`<path d="M34 58 Q30 28 50 23 Q70 28 66 58 L60 46 Q61 31 50 31 Q39 31 40 46 Z" fill="${PP_PURPLE}" stroke="${PP_GOLDD}" stroke-width=".8"/>`,
  crown:     `<path d="M39 27 L42 19 L47 25 L50 17 L53 25 L58 19 L61 27 Z" fill="${PP_GOLDL}" stroke="${PP_GOLDD}" stroke-width="1"/><rect x="39" y="26" width="22" height="3" fill="${PP_GOLD}"/>`,
  mitre:     `<path d="M41 28 Q41 12 50 12 Q59 12 59 28 Z" fill="${PP_VELLUM}" stroke="${PP_GOLDD}"/><rect x="39" y="26" width="22" height="4" fill="${PP_GOLD}"/>`,
  helmet:    `<path d="M37 38 Q37 23 50 23 Q63 23 63 38 L59 38 Q58 29 50 29 Q42 29 41 38 Z" fill="${PP_MUTED}" stroke="${PP_INK}" stroke-width=".8"/>`,
  hood:      `<path d="M35 58 Q29 26 50 22 Q71 26 65 58 L59 44 Q60 29 50 29 Q40 29 41 44 Z" fill="${PP_GOLDD}" stroke="${PP_INK}" stroke-width=".8"/>`,
  halocross: `<circle cx="50" cy="40" r="19" fill="none" stroke="${PP_GOLDL}" stroke-width="2.2" opacity=".9"/><path d="M50 20 v7 M30 40 h7 M63 40 h7" stroke="${PP_GOLDL}" stroke-width="3"/>`
};

/* Who gets what. robe defaults to lapis; hd defaults to hair + beard. */
const PERSON_ART = {
  adam:     { hd: ['hair'], parts: ['sprig'] },
  eve:      { hd: ['tresses'], parts: ['fruit'] },
  noah:     { hd: ['hair', 'beardWhite'], parts: ['rainbow', 'ark'] },
  abraham:  { hd: ['hair', 'beardWhite'], parts: ['stars', 'staff'] },
  sarah:    { hd: ['veil'], parts: ['tent'] },
  isaac:    { hd: ['hair', 'beard'], parts: ['wood'] },
  jacob:    { hd: ['hair', 'beard'], parts: ['ladder', 'staff'] },
  joseph:   { hd: ['hair'], parts: ['stripes'] },
  moses:    { hd: ['hair', 'beardWhite'], parts: ['rays', 'staff', 'tablets'] },
  aaron:    { hd: ['mitre', 'beard'], robe: PP_VELLUM, parts: ['ephod'] },
  joshua:   { hd: ['helmet', 'beard'], parts: ['shofar', 'bricks'] },
  rahab:    { hd: ['veil'], parts: ['cord'] },
  deborah:  { hd: ['veil'], parts: ['palm'] },
  gideon:   { hd: ['hair', 'beard'], parts: ['torchjar'] },
  samson:   { hd: ['tresses', 'beard'], parts: ['pillars'] },
  ruth:     { hd: ['veil'], parts: ['grain'] },
  samuel:   { hd: ['hair', 'beardGrey'], parts: ['horn'] },
  saul:     { hd: ['crown', 'beard'], parts: ['spear'] },
  david:    { hd: ['hair'], parts: ['sling', 'harp'] },
  solomon:  { hd: ['crown', 'beard'], parts: ['trim', 'temple'] },
  elijah:   { hd: ['hood', 'beardGrey'], parts: ['flame'] },
  elisha:   { hd: ['beard'], parts: ['mantle'] },
  hezekiah: { hd: ['crown', 'beard'], parts: ['sunsteps'] },
  josiah:   { hd: ['crown', 'hair'], parts: ['scroll'] },
  isaiah:   { hd: ['hair', 'beard'], parts: ['coal'] },
  jeremiah: { hd: ['hair', 'beardGrey'], parts: ['jar'] },
  ezekiel:  { hd: ['hair', 'beard'], parts: ['wheel'] },
  daniel:   { hd: ['hair', 'beard'], parts: ['lion'] },
  esther:   { hd: ['crown', 'tresses'], parts: ['scepter'] },
  nehemiah: { hd: ['hair', 'beard'], parts: ['trowel', 'bricks'] },
  ezra:     { hd: ['hair', 'beardWhite'], parts: ['bookquill'] },
  jesus:    { hd: ['halocross', 'hair', 'beard'], robe: PP_VELLUM, parts: ['trim'] },
  mary:     { hd: ['veilBlue'], parts: ['lily'] },
  john_b:   { hd: ['tresses', 'beard'], robe: PP_GOLDD, parts: ['drops'] },
  peter:    { hd: ['hair', 'beardGrey'], parts: ['keys', 'fish'] },
  paul:     { hd: ['beard'], parts: ['scroll'] },
  stephen:  { hd: ['hair'], parts: ['rays', 'stones'] },
  barnabas: { hd: ['hair', 'beard'], parts: ['coins'] },
  lydia:    { hd: ['veilPurple'], robe: PP_PURPLE, parts: ['clothbolt'] },
  timothy:  { hd: ['hair'], parts: ['scroll'] },
  john_a:   { hd: ['hair'], parts: ['eagle'] },
  jonah:    { hd: ['hair', 'beard'], parts: ['greatfish'] }
};

function portraitSVG(p) {
  const art = PERSON_ART[p.id] || { hd: ['hair', 'beard'], parts: [] };
  const robe = art.robe || PP_LAPIS3;
  const picked = (art.parts || []).map(k => PORTRAIT_PARTS[k]).filter(Boolean);
  const layer = z => picked.filter(x => x.z === z).map(x => x.d).join('');
  const gid = 'pg-' + p.id;
  return `<svg class="portrait" viewBox="0 0 100 100" role="img" aria-label="Stylised portrait of ${p.n.replace(/"/g, '&quot;')}">
    <defs>
      <radialGradient id="${gid}" cx="38%" cy="30%" r="80%">
        <stop offset="0%" stop-color="${PP_LAPIS3}"/><stop offset="55%" stop-color="${PP_LAPIS}"/><stop offset="100%" stop-color="${PP_INK}"/>
      </radialGradient>
      <clipPath id="${gid}-c"><circle cx="50" cy="50" r="46.5"/></clipPath>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#${gid})" stroke="${PP_GOLD}" stroke-width="2.5"/>
    <g clip-path="url(#${gid}-c)">
      ${layer('bg')}
      <path d="M24 90 Q26 62 50 57 Q74 62 76 90 Z" fill="${robe}" stroke="${PP_INK}" stroke-width="1"/>
      <path d="M44 59 Q50 64 56 59" fill="none" stroke="${PP_GOLDD}" stroke-width="1"/>
      ${layer('ov')}
      <circle cx="50" cy="40" r="13" fill="${PP_VELLUM2}" stroke="${PP_GOLDD}" stroke-width="1"/>
      ${(art.hd || []).map(h => PORTRAIT_HEADS[h] || '').join('')}
      ${layer('fg')}
    </g>
    <circle cx="50" cy="50" r="43.5" fill="none" stroke="${PP_GOLD}" stroke-width=".8" opacity=".5"/>
  </svg>`;
}
