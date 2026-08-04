# Bible Quest — The Complete Scripture Journey

A mastery-based Bible learning game. The goal is not to finish lessons; it is to be able
to prove, months later, that you still know the material.

Open `dist/bible-quest.html` in a browser to play. No install, no server needed.

## Quick start

```bash
npm run check     # run all tests, then build dist/bible-quest.html
npm run serve     # build and serve at http://localhost:8080
```

Node 18+ (only used for the build and tests — the game itself has no runtime deps).

## What's in it

- **17 stages** from Creation to Revelation, each ending in a boss battle
- **All 66 books**, each with its own page and six completion gates
- **116 concepts** carrying **405 questions** across 12 formats
- **Memory engine** — spaced repetition, five knowledge levels, per-concept confidence
- **40 people**, a pannable, zoomable **map** with 41 locations, drawn coastlines,
  Paul's three journey routes, and towns and regions that appear as you zoom in,
  a **34-event timeline** with ordering challenges
- **13 memory-palace rooms**, daily challenge with streaks, personalised review quests
- **100-question final exam** and a 40-question cross-book Master Challenge

## The core rule

One correct answer never means mastery. Level 5 requires correct answers in four or more
different question formats, across two or more sessions, with the last three answers all
correct. Miss it later and it drops back down and returns sooner.

| Player action | Result |
|---|---|
| One correct answer | ~30%, Level 2 (Recognised) |
| Every format right, one sitting | ~83%, Level 3 (Understood) |
| Same again next session | ~92%, **Level 5 (Mastered)** |
| One later miss | ~75%, back to Level 3 |

`npm test` asserts every row of that table.

## Layout

```
src/data/     content database (eras, books, concepts, people, places, timeline)
src/engine.js mastery maths, scheduling, question selection
src/ui.js     router, views, quiz runner
build.js      concatenates src/ into dist/bible-quest.html
test/         data integrity, mastery rules, full render+playthrough
```

See `CLAUDE.md` for architecture notes, content-authoring format, and the accuracy policy.

## Accuracy

Every claim carries a tag: direct biblical text, inference, common Christian reading,
church tradition, or debated. Where Christians genuinely disagree, the game presents the
disagreement rather than picking a side. References are given so anything can be checked;
passages are summarised rather than reproduced.
