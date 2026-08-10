# dpm3-trainer — TRAK DPM3 / ProtoTRAK SMX operator boot camp sim

The sim track (🖥) of the DPM3 operator boot camp: a 3D model of the machine plus
eight training games, all vanilla HTML/JS/Three.js, no build step.

## Run it

```bash
cd dpm3-trainer
python3 -m http.server 8080
# open http://localhost:8080/
```

Any static server works. A server is required — the pages use ES modules, which
browsers refuse to load from `file://`.

## What's here

| Path | What |
|---|---|
| `index.html` | Hub — links every game, shows session-best scores while open |
| `model/machine.js` | Shared DPM3 model, machine facts/formulas, demo cycles, score bus |
| `model/viewer.html` | The 3D model: orbit, jog, labels, demo cycles |
| `model/vendor/` | Three.js r128 + OrbitControls, vendored so everything works offline |
| `games/g1…g8` | The eight games, one self-contained file each |

Boot-camp usage per day: G1 + G6 (Day 1) · G2 + G3 (Day 2) · G4 + G5 (Day 3) ·
G5 contours + G7 (Day 4) · G8 (Days 5–6).

## Notes

- Three.js is vendored rather than CDN-loaded: the trainer must work in a shop with
  no internet, and the build environment's network policy blocks CDN hosts anyway.
- Scores live in memory only (BroadcastChannel to the hub) — no localStorage, no
  cookies, nothing persisted. Your logbook is the permanent record, on paper,
  the way it should be.
- Machine truths (travels 31/17/23.5, quill 5" NMTB40, 70–4200 RPM, edge-finder
  0.100 offset, RPM/feed formulas, vari-speed vs range rules) are defined once in
  `model/machine.js` (`FACTS`) and imported everywhere. See `CLAUDE.md` for the
  conventions and the module API.
