# Bible Quest — project instructions

A mastery-based Bible learning game. Plain HTML/CSS/JS, **zero dependencies, no bundler,
no framework**. `build.js` concatenates `src/` into one self-contained
`dist/bible-quest.html`.

## Commands

```bash
npm run build     # concatenate src/ -> dist/bible-quest.html
npm test          # data integrity + mastery rules + every screen renders
npm run check     # test, then build. Run before saying you are done.
npm run serve     # build and serve dist on http://localhost:8080
```

`npm run check` must pass before any change is considered complete. There is no CI —
these tests are the only safety net.

## Architecture

Load order matters and is defined in `build.js`. Data first, then engine, then UI.

| File | Contains |
|---|---|
| `src/data/core.js` | 17 eras, all 66 books, people, places (map coords), timeline, palace rooms |
| `src/data/concepts-ot.js` | Old Testament concepts and their questions |
| `src/data/concepts-nt.js` | New Testament concepts and their questions |
| `src/engine.js` | Mastery maths, spaced repetition, probe selection, achievements, storage |
| `src/ui.js` | Router, all views, the quiz runner, event binding |
| `src/styles.css` | Design tokens and all styling |
| `src/head.html` / `mid.html` / `tail.html` | Shell fragments the build wraps around the code |

Everything reads from `ALL_CONCEPTS`. Adding a concept to a data file automatically
feeds the dashboard, boss battles, review queue, exams and achievements. **Never
hard-code a concept id anywhere except `PALACE.anchor` in `core.js`.**

## The rule this project exists to enforce

A player must not be able to claim mastery by clicking through. Level 5 requires:
correct answers in **4+ different question formats**, across **2+ separate sessions**,
with the **last 3 answers all correct**. `test/mastery.test.js` guards this. If a change
makes those tests fail, the change is wrong — do not relax the tests to make them pass.

Related invariants:
- Repeat visits to a concept must ask a *different* question. `pickProbe` biases toward
  least-seen probes; keep that behaviour.
- A wrong answer resets the review interval to the shortest step.
- Every concept needs **at least 3 probes**, ideally spanning several `t` types and levels.

## Adding content

Add an object to `concepts-ot.js` or `concepts-nt.js`:

```js
{id:'c_unique_id', b:'gen', e:'creation', topic:'Short name', d:2, claim:'text',
 ref:'Genesis 1–2', sum:'One or two sentences shown in study and feedback.',
 p:[
   {t:'mc',  l:1, q:'…', o:['a','b','c','d'], a:0, w:'why, with the reference'},
   {t:'ord', l:3, q:'…', it:['first','second','third'], w:'…'},
   {t:'mat', l:4, q:'…', pr:[['left','right'],['left2','right2']], w:'…'},
   {t:'exp', l:5, q:'…', keys:['keyword','keyword2'], model:'A model answer.'}
 ]}
```

- `b` must be a real book id, `e` a real era id, `claim` one of
  `text | inference | common | traditional | debated`.
- `l` is the knowledge level the question tests (1 recall … 5 transfer).
- Choice types (`mc tf who nxt cse scn con bok fil`) need `o`, `a`, `w`. `who` uses
  `clues[]` instead of `q`.
- Options must be unique; matching pairs must have unique right-hand values.

After adding, run `npm test` — it validates shape, cross-references, and whether each
era can still fill its boss battle.

To deepen a thin era, add concepts with era id: `conquest`, `exile`, `return`,
`revelation` are the lightest. `test/data.test.js` will fail loudly if a boss battle
can no longer reach its question count.

## Content accuracy policy — non-negotiable

This is a Christian educational product used by real learners.

1. **Never invent a biblical fact or a reference.** If unsure, verify before writing.
2. **Tag every claim honestly** with `claim`. A reading Christians draw from the text is
   `common` or `traditional`, not `text`.
3. **Where Christians genuinely disagree, say so.** Use `debated` and present the
   disagreement rather than picking a side quietly. Existing examples: exodus dating,
   Revelation's interpretive frameworks, Paul and James on faith and works, Song of
   Songs as allegory, Hebrews' authorship.
4. **Do not reproduce extended Bible passages.** Summarise and explain in the game's own
   words. Short phrases only, always with a reference.
5. Every factual probe should carry a reference in `w` or in the concept's `ref`.

## Frontend constraints

- **No `localStorage` or `sessionStorage`.** Persistence goes through `window.storage`
  (`loadState` / `saveState` in `engine.js`), with an in-memory fallback. If you run the
  file directly in a browser without that API, progress simply does not persist — that
  is expected and handled.
- Colours come from the CSS custom properties at the top of `styles.css`. Do not
  introduce new hex values inline; add a token instead.
- Must stay responsive to ~380px, keep visible keyboard focus, and respect
  `prefers-reduced-motion` (already handled at the bottom of `styles.css`).
- No build step, no npm dependencies. Keep it that way unless explicitly asked.

## Design direction

Illuminated manuscript: lapis ground, gold leaf for mastery, vermilion used strictly as
rubric (claim tags, misses, warnings), vellum panels for reading. Cinzel for display,
Spectral for body, IBM Plex Sans for UI and data. The signature element is the journey
spine — roundels that fill with gold as mastery rises. Keep that the one loud thing.

## Known gaps / good next tasks

- Concept coverage is deepest in Genesis–Kings, the Gospels, Acts and the major letters.
  Conquest, Exile, Return and Revelation have the fewest concepts.
- Books without their own concepts fall back to their era's pool for quizzes and mastery.
- The map is schematic, not geographic. Coordinates live in `PLACES` in `core.js`.
- `exp` questions grade on keyword coverage plus an honest self-rating.
- There is no export/import of a save file yet.
