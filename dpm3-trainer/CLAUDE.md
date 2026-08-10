# dpm3-trainer

This repo is a training simulator for a TRAK DPM3 bed mill with ProtoTRAK SMX CNC.

## Conventions

- Vanilla HTML/JS/Three.js (r128), one file per game, no build step.
- Three.js r128 is **vendored** at `model/vendor/three.min.js` (+ `OrbitControls.js`)
  instead of loaded from a CDN, so everything works offline from a local server.
  Load it with a plain `<script>` tag (it attaches the global `THREE`), then use
  `<script type="module">` for game code.
- ES modules require an HTTP origin: serve the folder with
  `python3 -m http.server 8080` (or any static server) and open
  `http://localhost:8080/`. Opening files via `file://` will not work.
- Shared machine geometry, machine facts, formulas, demo cycles and the
  score-broadcast helper live in `model/machine.js` — never duplicate them; extend them.
- Visual style: engineering-drawing aesthetic from `model/viewer.html` (paper
  `#EDEFEA`, ink `#232A2E`, TRAK blue `#1F5FA8`, orange `#E4572E`, DRO green
  `#39FF6A` on dark, mono labels). Reuse its CSS variable names
  (`--paper --ink --blue --orange --green --panel --line`).
- Every game shows: score, timer where relevant, best-score for the session, and a
  RESET. Keep scores in memory only. Call `reportScore(gameId, {label, score, best})`
  from `model/machine.js` so the hub (`index.html`) can display session bests via
  BroadcastChannel — no storage anywhere.

## Machine truths that must stay accurate

- Table 10 × 50 in; travels X 31 / Y 17 / Z 23.5 in; quill 5 in; NMTB40 taper.
- Spindle 70–4200 RPM. Vari-speed changes ONLY while the spindle is running;
  hi/lo range (back-gear) changes ONLY with the spindle stopped.
- Edge finder tip 0.200 in → spindle centerline is 0.100 in past the touched edge
  (set the axis to +0.1000 or −0.1000, sign depends on approach direction).
- RPM = SFM × 3.82 ÷ diameter, capped at 4200. Feed IPM = RPM × flutes × chip load.
- SFM starters: aluminum 250 HSS / 600 carbide; mild steel 90 HSS / 350 carbide.
- Chip load starters: 1/2" EM 0.003 ipt · 1/4" EM 0.0015 ipt · drills ≈ dia/100 per rev.
- These constants live in `FACTS` in `model/machine.js`; import them, never re-type them.

## model/machine.js API (keep stable — all games depend on it)

- `buildMachine(scene)` → `{root, tableG, saddleG, headG, quillG, spindleG,
  handwheels:{x,y,z}, parts, setAxes({x,y,z,quill}), getAxes(), spindle:{on,rpm,set(on,rpm)},
  highlight(id,on), partById(id), update(dt)}`
  - Machine coordinates in inches: x ∈ [0,31], y ∈ [0,17], z ∈ [0,23.5] (0 = fully
    down), quill ∈ [0,5] (0 = retracted). `setAxes` clamps to travel.
  - `parts` = array of `{id, name, blurb, group}` for every named component.
- `makeScene(canvas)` → `{scene, camera, renderer, resize()}` with paper background
  and standard lighting, so games don't re-invent boilerplate.
- `FACTS` — the machine truths above. `rpmFor(sfm, dia)`, `feedFor(rpm, flutes, ipt)`.
- `DEMO_CYCLES` — 3 named cycles, each `{id, name, steps:[{label, desc, ax, dur, spindle}]}`.
- `createCycleRunner(machine, cycle, {onStep, onDone})` → `{update(dt), reset(),
  running}` — lerps the machine through a cycle, firing `onStep` per step.
- `reportScore(gameId, {label, score, best, detail})` — BroadcastChannel
  `dpm3-scores`; fire-and-forget, safe when the hub is closed.

## Games

`games/g1…g8` per the boot-camp spec (BOOTCAMP §4). Build them to be *played*, not
gold-plated. Wrong answers must always teach: show the rule, the formula worked, or
the reference after each miss.
