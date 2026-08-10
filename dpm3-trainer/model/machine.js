/* model/machine.js — shared TRAK DPM3 model, machine facts, demo cycles, score bus.
   Requires global THREE (model/vendor/three.min.js, r128). ES module.

   API (keep stable — every game depends on it):
     buildMachine(scene) -> machine object (see bottom of buildMachine)
     makeScene(canvas)   -> {scene, camera, renderer, resize}
     FACTS, rpmFor(sfm, dia), feedFor(rpm, flutes, ipt)
     DEMO_CYCLES, createCycleRunner(machine, cycle, {onStep, onDone})
     reportScore(gameId, {label, score, best, detail})
   Machine coordinates are inches: x 0..31, y 0..17 (toward column), z 0..23.5
   (0 = head fully down), quill 0..5 (0 = retracted). setAxes clamps to travel. */

export const COLORS = {
  paper:  0xEDEFEA,
  ink:    0x232A2E,
  blue:   0x1F5FA8,
  orange: 0xE4572E,
  green:  0x39FF6A,
  iron:   0xC9CDC9,   // machine castings (paper-grey, drawn look)
  iron2:  0xB7BDBB,   // darker casting faces
  steel:  0xDDE1DC,   // ways, table, bright steel
  dark:   0x3A4348,   // rubber, wipers, dark trim
  red:    0xC22B2B,   // e-stop, disconnect handle
};

export const FACTS = {
  tableL: 50, tableW: 10,                 // in
  travel: { x: 31, y: 17, z: 23.5 },      // in
  quill: 5, taper: 'NMTB40',
  rpmMin: 70, rpmMax: 4200,
  edgeFinderTip: 0.200, edgeFinderOffset: 0.100,
  sfm: { aluminumHSS: 250, aluminumCarbide: 600, steelHSS: 90, steelCarbide: 350 },
  chipload: { em500: 0.003, em250: 0.0015 },   // ipt starting points
  drillFeedRule: 'dia/100 per rev',
  variSpeedRule: 'Change spindle SPEED only while the spindle is running.',
  rangeRule: 'Change hi/lo RANGE (back gear) only with the spindle stopped.',
};

export function rpmFor(sfm, dia) {
  return Math.min(FACTS.rpmMax, Math.round((sfm * 3.82) / dia));
}
export function feedFor(rpm, flutes, ipt) {
  return rpm * flutes * ipt;   // IPM
}

/* ---- score bus: memory-only, hub listens on BroadcastChannel ---- */
let _chan = null;
export function reportScore(gameId, data) {
  try {
    if (!_chan) _chan = new BroadcastChannel('dpm3-scores');
    _chan.postMessage({ game: gameId, ...data });
  } catch (e) { /* hub closed or channel unsupported — fine */ }
  window.__lastScore = { game: gameId, ...data };
}

/* ---- scene boilerplate ---- */
export function makeScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.paper);
  const camera = new THREE.PerspectiveCamera(38, 2, 1, 800);
  camera.position.set(102, 88, 136);
  camera.lookAt(0, 50, 0);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x9aa4a8, 0.95);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 0.65);
  dir.position.set(60, 130, 90);
  scene.add(dir);
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    }
  }
  resize();
  return { scene, camera, renderer, resize };
}

/* ---- geometry helpers (engineering-drawing look: flat faces + ink edges) ---- */
function boxMesh(w, h, d, color, meshes) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color })
  );
  g.add(m);
  g.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(m.geometry, 25),
    new THREE.LineBasicMaterial({ color: COLORS.ink })
  ));
  if (meshes) meshes.push(m);
  return g;
}
function cylMesh(rTop, rBot, h, color, meshes, seg = 24) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(rTop, rBot, h, seg),
    new THREE.MeshLambertMaterial({ color })
  );
  g.add(m);
  g.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(m.geometry, 40),
    new THREE.LineBasicMaterial({ color: COLORS.ink })
  ));
  if (meshes) meshes.push(m);
  return g;
}
function at(obj, x, y, z) { obj.position.set(x, y, z); return obj; }

function makeHandwheel(r, color, meshes) {
  // rim + 3 spokes + crank knob; wheel axis = local Y (rotate group to orient)
  const g = new THREE.Group();
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(r, r * 0.14, 10, 28),
    new THREE.MeshLambertMaterial({ color })
  );
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  meshes.push(rim);
  for (let i = 0; i < 3; i++) {
    const sp = new THREE.Mesh(
      new THREE.CylinderGeometry(r * 0.08, r * 0.08, r * 1.9, 8),
      new THREE.MeshLambertMaterial({ color })
    );
    sp.rotation.z = Math.PI / 2;
    sp.rotation.y = (i * Math.PI) / 3;
    g.add(sp);
    meshes.push(sp);
  }
  const knob = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.12, r * 0.12, r * 0.55, 10),
    new THREE.MeshLambertMaterial({ color: COLORS.dark })
  );
  knob.position.set(r * 0.72, r * 0.3, 0);
  g.add(knob);
  meshes.push(knob);
  return g;
}

/* ---- the machine ---- */
export function buildMachine(scene) {
  const root = new THREE.Group();
  scene.add(root);

  const parts = [];
  const reg = (id, name, blurb, group) => {
    const meshes = [];
    group.traverse(o => { if (o.isMesh) meshes.push(o); });
    parts.push({ id, name, blurb, group, meshes });
    return group;
  };

  /* base + column (static) */
  const baseG = new THREE.Group(); root.add(baseG);
  baseG.add(at(boxMesh(46, 30, 28, COLORS.iron), 0, 15, 4));           // pedestal
  baseG.add(at(boxMesh(34, 24, 18, COLORS.iron2), 0, 12, -16));        // rear base
  baseG.add(at(boxMesh(50, 2, 30, COLORS.iron2), 0, 31, 4));           // bed top
  reg('base', 'Base / bed casting',
    'The one-piece iron foundation the whole machine sits on. Mass here is what soaks up vibration — rigidity starts at the floor.', baseG);

  const chipPan = at(boxMesh(54, 1, 34, COLORS.dark), 0, 30, 6);
  root.add(chipPan);
  reg('chippan', 'Chip pan',
    'Catches chips and coolant runoff. Chips leave it by brush and pan — never by hand, never blown toward people.', chipPan);

  const columnG = new THREE.Group(); root.add(columnG);
  columnG.add(at(boxMesh(24, 70, 18, COLORS.iron), 0, 55, -22));       // column body
  columnG.add(at(boxMesh(16, 62, 2, COLORS.steel), 0, 56, -12.4));     // vertical ways
  reg('column', 'Column',
    'Vertical backbone bolted to the base. The head rides its front ways up and down — this is the Z axis on a bed mill.', columnG);

  /* saddle (machine Y) + table (machine X) */
  const saddleG = new THREE.Group(); root.add(saddleG);
  saddleG.add(at(boxMesh(26, 5, 16, COLORS.iron2), 0, 34.5, 0));
  saddleG.add(at(boxMesh(28, 1.2, 12, COLORS.steel), 0, 37.3, 0));     // top ways
  reg('saddle', 'Saddle',
    'Slides on the bed toward and away from the column — the Y axis (17" travel). The table rides on top of it.', saddleG);

  const tableG = new THREE.Group(); saddleG.add(tableG);
  const tableBody = at(boxMesh(50, 3.5, 10, COLORS.steel), 0, 39.75, 0);
  tableG.add(tableBody);
  for (const tz of [-3, 0, 3]) {                                        // T-slots
    tableG.add(at(boxMesh(50.02, 0.25, 0.7, COLORS.dark), 0, 41.45, tz));
  }
  reg('table', 'Table',
    '50" × 10" work surface with T-slots. It carries the vise and part, moving left–right — the X axis (31" travel).', tableG);

  const wipers = new THREE.Group(); tableG.add(wipers);
  wipers.add(at(boxMesh(1, 1.2, 10.4, COLORS.dark), -25.6, 39.4, 0));
  wipers.add(at(boxMesh(1, 1.2, 10.4, COLORS.dark), 25.6, 39.4, 0));
  reg('wipers', 'Way wipers',
    'Felt/rubber strips at the ends of each slide that squeegee chips and grit off the ways before the slide runs over them. Kept clean daily.', wipers);

  /* head (machine Z) + quill + spindle */
  const headG = new THREE.Group(); root.add(headG);
  headG.add(at(boxMesh(18, 20, 16, COLORS.iron), 0, 2, -2));           // head casting
  headG.add(at(boxMesh(6, 18, 3, COLORS.iron2), 0, 2, -11));           // way clamp
  reg('head', 'Head',
    'Carries the motor, spindle and quill, riding the column ways — the CNC Z axis (23.5" travel).', headG);

  const motorG = new THREE.Group(); headG.add(motorG);
  motorG.add(at(cylMesh(5, 5, 12, COLORS.blue, []), 0, 18, -4));
  motorG.add(at(cylMesh(2, 2, 2, COLORS.iron2, []), 0, 25.5, -4));
  reg('motor', 'Spindle motor',
    'The drive on top of the head. Power reaches the spindle through the vari-speed drive and the hi/lo back-gear range.', motorG);

  const quillG = new THREE.Group(); headG.add(quillG);
  quillG.position.set(0, 0, 4);                                        // spindle axis z=4
  quillG.add(at(cylMesh(2.3, 2.3, 14, COLORS.steel, []), 0, -11, 0));
  reg('quill', 'Quill',
    'The sliding sleeve the spindle runs in — 5" of travel for drilling feel and fine Z work, on top of the head\'s 23.5".', quillG);

  const spindleG = new THREE.Group(); quillG.add(spindleG);
  spindleG.add(at(cylMesh(1.9, 1.4, 1.6, COLORS.iron2, []), 0, -18.6, 0)); // nose
  spindleG.add(at(cylMesh(1.1, 0.7, 1.8, COLORS.dark, []), 0, -20.2, 0));  // NMTB40 holder
  spindleG.add(at(boxMesh(0.5, 1.4, 0.5, COLORS.dark), 0, -21.6, 0));      // cutter stub
  reg('spindle', 'Spindle / toolholder (NMTB40)',
    'The rotating business end. NMTB40 taper, 70–4200 RPM. Tool tip position = head Z + quill extension.', spindleG);

  const drawbarG = new THREE.Group(); headG.add(drawbarG);
  drawbarG.add(at(boxMesh(4, 3.5, 4, COLORS.iron2), 5.5, 13.5, 2));
  drawbarG.add(at(cylMesh(0.8, 0.8, 3, COLORS.dark, []), 5.5, 16.5, 2));
  reg('drawbar', 'Power drawbar',
    'Air-powered clamp that pulls the NMTB40 holder into the spindle taper. Support the tool with your hand at every change — it drops free.', drawbarG);

  const variG = new THREE.Group(); headG.add(variG);
  variG.add(at(cylMesh(1.6, 1.6, 1, COLORS.orange, []), -5, 8, 6.2));
  variG.getObjectByProperty('type', 'Group');
  reg('varispeed', 'Vari-speed control',
    'Sets spindle RPM within the range. Rule one of the drivetrain: move it ONLY while the spindle is turning, or it eats the drive.', variG);

  const rangeG = new THREE.Group(); headG.add(rangeG);
  const lever = cylMesh(0.35, 0.35, 5, COLORS.dark, []);
  lever.rotation.z = 0.9;
  rangeG.add(at(lever, -8.5, 4, 2));
  rangeG.add(at(cylMesh(0.8, 0.8, 0.9, COLORS.red, [], 12), -10.3, 5.6, 2));
  reg('range', 'Hi/Lo range lever (back gear)',
    'Selects the high or low speed range. Rule two: shift it ONLY with the spindle fully stopped.', rangeG);

  const lampG = new THREE.Group(); headG.add(lampG);
  lampG.add(at(cylMesh(1.1, 1.6, 2.2, COLORS.dark, [], 14), 9, -2, 5));
  reg('lamp', 'Work lamp',
    'Task light aimed at the cut. If you can\'t see the chip, you can\'t read the cut.', lampG);

  const coolG = new THREE.Group(); headG.add(coolG);
  const hose = cylMesh(0.35, 0.35, 8, COLORS.blue, []);
  hose.rotation.z = 0.5;
  coolG.add(at(hose, -8, -6, 5));
  coolG.add(at(cylMesh(0.2, 0.45, 1.4, COLORS.dark, [], 10), -9.8, -9.4, 5));
  reg('coolant', 'Coolant nozzle',
    'Flood coolant aimed at the cutter — chip evacuation and heat control. Check condition and level in the pre-flight.', coolG);

  /* pendant + e-stop */
  const pendantG = new THREE.Group(); root.add(pendantG);
  const arm = boxMesh(2.2, 2.2, 26, COLORS.iron2);
  pendantG.add(at(arm, 16, 86, -8));
  const panel = new THREE.Group();
  panel.position.set(16, 76, 7);
  panel.rotation.y = -0.35;
  panel.add(at(boxMesh(12, 16, 2.4, COLORS.iron), 0, 0, 0));
  panel.add(at(boxMesh(9, 6.5, 0.4, 0x101816), 0, 3.2, 1.3));          // screen
  panel.add(at(boxMesh(8.4, 5.9, 0.1, 0x16321f), 0, 3.2, 1.55));       // glow
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {            // keypad
    panel.add(at(boxMesh(1.3, 1, 0.4, COLORS.blue), -3.6 + c * 1.8, -2.6 - r * 1.5, 1.3));
  }
  pendantG.add(panel);
  reg('pendant', 'ProtoTRAK SMX pendant',
    'The control: DRO, PROG, EDIT, SET-UP, RUN, PROG IN/OUT modes behind one MODE key. The conversation between you and the machine happens here.', pendantG);

  const estopG = new THREE.Group();
  estopG.add(at(cylMesh(1.1, 1.1, 0.7, COLORS.red, [], 16), 4.2, -6.8, 1.5));
  estopG.add(at(cylMesh(0.7, 0.7, 0.5, COLORS.red, [], 16), 4.2, -6.3, 1.5));
  panel.add(estopG);
  reg('estop', 'Emergency stop',
    'Kills everything, instantly, from anywhere. Its location must be muscle memory — you should hit it with your eyes closed from your stance.', estopG);

  /* electrical + lube */
  const discG = new THREE.Group(); root.add(discG);
  discG.add(at(boxMesh(9, 12, 4, COLORS.iron2), 14, 58, -26));
  discG.add(at(boxMesh(1.2, 4, 1.2, COLORS.red), 14, 58, -23.4));      // rotary handle
  reg('disconnect', 'Main disconnect',
    'The wall between the machine and the power grid. First thing ON at startup, last thing OFF at shutdown — and where lockout happens.', discG);

  const lubeG = new THREE.Group(); root.add(lubeG);
  lubeG.add(at(boxMesh(5, 7, 4, 0xD9E4D2), -14, 36, -20));
  lubeG.add(at(cylMesh(0.9, 0.9, 2, COLORS.dark, [], 10), -14, 40.5, -20));
  reg('lube', 'Way-lube pump & reservoir',
    'One-shot oiler feeding the ways and screws (Vactra No. 2 or per the lube plate). Level check is pre-flight item #3 — a dry way is a dying way.', lubeG);

  /* handwheels (electronic) */
  const hwMeshesX = [], hwMeshesY = [], hwMeshesZ = [];
  const hwX = makeHandwheel(3, COLORS.blue, hwMeshesX);
  hwX.rotation.z = Math.PI / 2;                                        // axis along X
  const hwXG = new THREE.Group(); hwXG.add(at(hwX, 26.5, 39.5, 0)); tableG.add(hwXG);
  reg('hw_x', 'X handwheel (electronic)',
    'Electronic handwheel for the X axis — no gear train, it tells the servo what you asked for. Fine/coarse resolution per detent.', hwXG);

  const hwY = makeHandwheel(3, COLORS.blue, hwMeshesY);
  hwY.rotation.x = Math.PI / 2;                                        // axis along Z
  const hwYG = new THREE.Group(); hwYG.add(at(hwY, 10, 34.5, 9.5)); saddleG.add(hwYG);
  reg('hw_y', 'Y handwheel (electronic)',
    'Electronic handwheel for the Y axis (saddle). Same servo-jog logic as X; the DRO tracks every detent.', hwYG);

  const hwZ = makeHandwheel(2.6, COLORS.blue, hwMeshesZ);
  hwZ.rotation.z = Math.PI / 2;
  const hwZG = new THREE.Group(); hwZG.add(at(hwZ, 10.6, 2, 2)); headG.add(hwZG);
  reg('hw_z', 'Z handwheel (electronic)',
    'Electronic handwheel for head Z. TRAKing runs the whole *program* off these wheels — forward and backward.', hwZG);

  /* ---- kinematics ---- */
  const ax = { x: 15.5, y: 8.5, z: 20, quill: 0 };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const spindle = {
    on: false, rpm: 0,
    set(on, rpm) {
      this.on = on;
      if (rpm !== undefined) this.rpm = clamp(rpm, 0, FACTS.rpmMax);
      if (!on) this.rpm = this.rpm; // rpm remembered; rotation stops
    },
  };
  let spinAngle = 0;
  const prev = { ...ax };

  function apply() {
    tableG.position.x = ax.x - FACTS.travel.x / 2;      // x 0..31 -> -15.5..15.5
    saddleG.position.z = 13 - ax.y;                     // y 0..17 -> 13..-4
    headG.position.y = 65 + ax.z;                       // z 0 = fully down
    quillG.position.y = -ax.quill;
  }
  apply();

  const machine = {
    root, tableG, saddleG, headG, quillG, spindleG,
    handwheels: { x: hwX, y: hwY, z: hwZ },
    parts, spindle,
    partById(id) { return parts.find(p => p.id === id); },
    setAxes(t) {
      if (t.x !== undefined) ax.x = clamp(t.x, 0, FACTS.travel.x);
      if (t.y !== undefined) ax.y = clamp(t.y, 0, FACTS.travel.y);
      if (t.z !== undefined) ax.z = clamp(t.z, 0, FACTS.travel.z);
      if (t.quill !== undefined) ax.quill = clamp(t.quill, 0, FACTS.quill);
      apply();
    },
    getAxes() { return { ...ax }; },
    highlight(id, on) {
      const p = this.partById(id);
      if (!p) return;
      p.meshes.forEach(m => {
        if (m.material && m.material.emissive) {
          m.material.emissive.setHex(on ? COLORS.orange : 0x000000);
        }
      });
    },
    update(dt) {
      if (spindle.on && spindle.rpm > 0) {
        spinAngle += dt * (0.6 + spindle.rpm / 900);
        spindleG.rotation.y = spinAngle;
      }
      hwX.rotation.y += (ax.x - prev.x) * 2.2;
      hwY.rotation.y += (ax.y - prev.y) * 2.2;
      hwZ.rotation.y += (ax.z - prev.z) * 2.2;
      prev.x = ax.x; prev.y = ax.y; prev.z = ax.z;
    },
  };
  return machine;
}

/* ---- demo cycles (Ghost Run + viewer). Steps lerp axes over dur seconds. ---- */
const HOME = { x: 2, y: 2, z: 20, quill: 0 };

export const DEMO_CYCLES = [
  {
    id: 'face', name: 'Climb face pass',
    steps: [
      { label: 'Rapid to start corner', desc: 'Position over the near corner, Z up.', ax: { x: 4, y: 6, z: 12 }, dur: 1.6 },
      { label: 'Spindle ON', desc: 'Speed set before the cut — 2300 RPM.', ax: {}, dur: 0.8, spindle: { on: true, rpm: 2300 } },
      { label: 'Plunge to depth', desc: 'Feed Z down to cut depth.', ax: { z: 9.5 }, dur: 1.2 },
      { label: 'Climb pass X+', desc: 'Cutting stroke across the part in +X.', ax: { x: 27 }, dur: 2.6 },
      { label: 'Step over in Y', desc: 'Shift for the next parallel pass.', ax: { y: 8.5 }, dur: 0.9 },
      { label: 'Return pass X−', desc: 'Cut back across in −X.', ax: { x: 4 }, dur: 2.6 },
      { label: 'Retract Z', desc: 'Lift clear of the part.', ax: { z: 16 }, dur: 1.0 },
      { label: 'Spindle OFF', desc: 'Cut complete, spindle down.', ax: {}, dur: 0.6, spindle: { on: false } },
      { label: 'Rapid home', desc: 'Return to the parked position.', ax: { ...HOME }, dur: 1.8 },
    ],
  },
  {
    id: 'bolt', name: 'Bolt-circle drilling',
    steps: [
      { label: 'Spindle ON', desc: 'Drill RPM set — 1600.', ax: {}, dur: 0.7, spindle: { on: true, rpm: 1600 } },
      { label: 'Rapid to hole 1', desc: 'Position over the first hole.', ax: { x: 15.5, y: 13.5, z: 13 }, dur: 1.4 },
      { label: 'Peck drill hole 1', desc: 'Feed down, breaking the chip.', ax: { z: 9.8 }, dur: 1.5 },
      { label: 'Retract from hole 1', desc: 'Rapid back up out of the hole.', ax: { z: 13 }, dur: 0.6 },
      { label: 'Rapid to hole 2', desc: 'Index around the circle.', ax: { x: 11.2, y: 6 }, dur: 1.1 },
      { label: 'Peck drill hole 2', desc: 'Same depth, same feed.', ax: { z: 9.8 }, dur: 1.5 },
      { label: 'Retract from hole 2', desc: 'Rapid back up.', ax: { z: 13 }, dur: 0.6 },
      { label: 'Rapid to hole 3', desc: 'Third position on the circle.', ax: { x: 19.8, y: 6 }, dur: 1.1 },
      { label: 'Peck drill hole 3', desc: 'Last hole of the pattern.', ax: { z: 9.8 }, dur: 1.5 },
      { label: 'Retract from hole 3', desc: 'Clear the part.', ax: { z: 13 }, dur: 0.6 },
      { label: 'Spindle OFF', desc: 'Pattern complete.', ax: {}, dur: 0.5, spindle: { on: false } },
      { label: 'Rapid home', desc: 'Park the machine.', ax: { ...HOME }, dur: 1.8 },
    ],
  },
  {
    id: 'pocket', name: 'Pocket clearing',
    steps: [
      { label: 'Spindle ON', desc: '2800 RPM for the end mill.', ax: {}, dur: 0.7, spindle: { on: true, rpm: 2800 } },
      { label: 'Rapid to pocket center', desc: 'Position over the pocket.', ax: { x: 13, y: 7, z: 13 }, dur: 1.4 },
      { label: 'Plunge to depth', desc: 'Feed straight down to the pass depth.', ax: { z: 9.6 }, dur: 1.3 },
      { label: 'Clearing pass X+', desc: 'First stripe across the pocket.', ax: { x: 19 }, dur: 1.8 },
      { label: 'Step over in Y', desc: 'Stepover for the next stripe.', ax: { y: 8.6 }, dur: 0.7 },
      { label: 'Clearing pass X−', desc: 'Back across, one stepover up.', ax: { x: 13 }, dur: 1.8 },
      { label: 'Finish pass around walls', desc: 'Climb around the perimeter.', ax: { x: 19, y: 7 }, dur: 1.5 },
      { label: 'Finish pass, far side', desc: 'Complete the wall loop.', ax: { x: 13, y: 8.6 }, dur: 1.5 },
      { label: 'Retract Z', desc: 'Lift out of the pocket.', ax: { z: 15 }, dur: 0.9 },
      { label: 'Spindle OFF', desc: 'Pocket done.', ax: {}, dur: 0.5, spindle: { on: false } },
      { label: 'Rapid home', desc: 'Park the machine.', ax: { ...HOME }, dur: 1.8 },
    ],
  },
];

export function createCycleRunner(machine, cycle, hooks = {}) {
  let idx = -1, t = 0, from = null, running = false;
  function startStep(i) {
    idx = i; t = 0;
    from = machine.getAxes();
    const step = cycle.steps[i];
    if (step.spindle) machine.spindle.set(step.spindle.on, step.spindle.rpm);
    if (hooks.onStep) hooks.onStep(step, i);
  }
  return {
    get running() { return running; },
    get stepIndex() { return idx; },
    start() { running = true; startStep(0); },
    reset() {
      running = false; idx = -1;
      machine.spindle.set(false);
      machine.setAxes({ ...HOME });
    },
    update(dt) {
      if (!running || idx < 0) return;
      const step = cycle.steps[idx];
      t += dt;
      const k = Math.min(1, t / step.dur);
      const e = k * k * (3 - 2 * k);            // smoothstep
      const target = {};
      for (const a of ['x', 'y', 'z', 'quill']) {
        if (step.ax && step.ax[a] !== undefined) {
          target[a] = from[a] + (step.ax[a] - from[a]) * e;
        }
      }
      machine.setAxes(target);
      if (k >= 1) {
        if (idx + 1 < cycle.steps.length) startStep(idx + 1);
        else { running = false; if (hooks.onDone) hooks.onDone(); }
      }
    },
  };
}
