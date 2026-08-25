/* Shop Math School — the shared engine.
   State lives in window.name only (survives navigation and reload in this tab,
   dies with the tab — scores are memory-only by design). No storage APIs. */
(function () {
  "use strict";

  /* ---------------- the course map ---------------- */
  var WORLDS = [
    { n: 1, name: 'NUMBER BASICS', tag: 'assume you know nothing — build it all' },
    { n: 2, name: 'MEASUREMENT', tag: 'rulers, calipers, mics, thousandths' },
    { n: 3, name: 'ALGEBRA & FORMULAS', tag: 'the shop formulas, plug in and rearrange' },
    { n: 4, name: 'GEOMETRY & TRIG', tag: 'the geometry the mill runs on' },
    { n: 5, name: 'BLUEPRINTS & GD&T', tag: 'read the part\'s instruction manual' },
  ];
  var LEVELS = [
    { id: 'l1',  n: 1,  w: 1, title: 'Counting & Place Value', file: 'levels/l01-place-value.html', built: true,
      desc: 'Ones, tens, hundreds — then tenths, hundredths, thousandths. Every digit has a seat.' },
    { id: 'l2',  n: 2,  w: 1, title: 'Add & Subtract', file: 'levels/l02-add-subtract.html', built: true,
      desc: 'Carrying and borrowing you can watch happen. Decimals line up on the point.' },
    { id: 'l3',  n: 3,  w: 1, title: 'Times Tables & Multiply', file: 'levels/l03-multiply.html', built: true,
      desc: 'Tables 2–12 as a speed game, then multi-digit multiply as area boxes.' },
    { id: 'l4',  n: 4,  w: 1, title: 'Division from Zero', file: 'levels/l04-division.html', built: true,
      desc: 'Division as sharing, then long division digit by digit — 3÷8 becomes 0.375 in front of you.' },
    { id: 'l5',  n: 5,  w: 1, title: 'Fractions', file: 'levels/l05-fractions.html', built: true,
      desc: 'What a fraction IS, equivalents, adding halves through sixteenths. Pie and ruler side by side.' },
    { id: 'l6',  n: 6,  w: 1, title: 'Fractions ↔ Decimals', file: 'levels/l06-frac-decimals.html', built: true,
      desc: 'Every 64th, with the machinist landmarks: .125, .250, .375, .500, .625, .750, .875.' },
    { id: 'l7',  n: 7,  w: 1, title: 'Negative Numbers', file: 'levels/l07-negatives.html', built: true,
      desc: 'The number line, why left/down is minus, adding signed numbers. Predict the crane.' },
    { id: 'l8',  n: 8,  w: 1, title: 'Percents & Ratios', file: 'levels/l08-percents.html', built: true,
      desc: 'Percent as per-hundred, finding 10% fast, scaling a feed by a ratio.' },
    { id: 'l9',  n: 9,  w: 2, title: 'Reading a Ruler', file: 'levels/l09-ruler.html', built: false,
      desc: 'Inches to 1/16 and 1/32 on a zoomable ruler. Find 2-5/16 against the clock.' },
    { id: 'l10', n: 10, w: 2, title: 'Thousandths Thinking', file: 'levels/l10-thousandths.html', built: false,
      desc: 'A thou (.001), a shop tenth (.0001), saying sizes out loud — "three seventy-five".' },
    { id: 'l11', n: 11, w: 2, title: 'Calipers', file: 'levels/l11-calipers.html', built: false,
      desc: 'Read digital and dial caliper simulations to .001.' },
    { id: 'l12', n: 12, w: 2, title: 'Micrometers', file: 'levels/l12-micrometers.html', built: false,
      desc: 'Barrel + thimble to .0001, vernier tenths included.' },
    { id: 'l13', n: 13, w: 2, title: 'Metric ↔ Inch', file: 'levels/l13-metric.html', built: false,
      desc: 'mm to inches (÷25.4) and back, and when each shows up.' },
    { id: 'l14', n: 14, w: 3, title: 'Using a Formula', file: 'levels/l14-formulas.html', built: false,
      desc: 'What a variable is. Plug numbers into a recipe, solve for the one unknown.' },
    { id: 'l15', n: 15, w: 3, title: 'Rearranging', file: 'levels/l15-rearranging.html', built: false,
      desc: 'Move one thing across the equals sign. Solve for the red letter.' },
    { id: 'l16', n: 16, w: 3, title: 'RPM & Cutting Speed', file: 'levels/l16-rpm.html', built: false,
      desc: 'RPM = SFM × 3.82 ÷ D with a spindle that visibly spins. Capped at 4200.' },
    { id: 'l17', n: 17, w: 3, title: 'Feed Rate', file: 'levels/l17-feed.html', built: false,
      desc: 'IPM = RPM × flutes × chip load, live, with the starter table.' },
    { id: 'l18', n: 18, w: 3, title: 'Depth & Passes', file: 'levels/l18-depth.html', built: false,
      desc: 'Depth ÷ per-pass, peck drilling, stepover — watch the passes draw themselves.' },
    { id: 'l19', n: 19, w: 4, title: 'Shapes & Angles', file: 'levels/l19-angles.html', built: false,
      desc: 'Degrees, right angles, complementary/supplementary, triangles sum to 180.' },
    { id: 'l20', n: 20, w: 4, title: 'Perimeter, Area, Circles', file: 'levels/l20-area-circles.html', built: false,
      desc: 'Rectangle and circle area, circumference = πD — where the 3.82 comes from.' },
    { id: 'l21', n: 21, w: 4, title: 'Pythagoras', file: 'levels/l21-pythagoras.html', built: false,
      desc: 'a² + b² = c². Drag the corners, watch the equation live.' },
    { id: 'l22', n: 22, w: 4, title: 'Right-Triangle Trig', file: 'levels/l22-trig.html', built: false,
      desc: 'SOH-CAH-TOA with a unit-circle animation. Angle + distance → X and Y.' },
    { id: 'l23', n: 23, w: 4, title: 'Bolt-Hole Circles', file: 'levels/l23-bolt-circles.html', built: false,
      desc: 'X = Xc + R·cos θ, Y = Yc + R·sin θ. Place the holes before the machine does.' },
    { id: 'l24', n: 24, w: 5, title: 'Blueprint Basics', file: 'levels/l24-blueprint-basics.html', built: true, open: true,
      desc: 'Title block, views, line types, scale — what each line on the page means. Opened early for blueprint day.' },
    { id: 'l25', n: 25, w: 5, title: 'Dimensions & Callouts', file: 'levels/l25-dimensions.html', built: false,
      desc: 'Dimension lines, Ø vs R, hole callouts, THRU vs depth.' },
    { id: 'l26', n: 26, w: 5, title: 'Tolerances', file: 'levels/l26-tolerances.html', built: false,
      desc: 'Nominal ± tolerance, limits, MAX and MIN material. Accept / rework / scrap.' },
    { id: 'l27', n: 27, w: 5, title: 'Intro to GD&T', file: 'levels/l27-gdt-intro.html', built: false,
      desc: 'Feature control frames, datums, and the big symbols — each with a pass part and a fail part.' },
    { id: 'l28', n: 28, w: 5, title: 'Position Tolerance Deep-Dive', file: 'levels/l28-position.html', built: false,
      desc: 'True position, round zones vs square, bonus tolerance at MMC kept simple.' },
    { id: 'l29', n: 29, w: 5, title: 'FINAL BOSS: Read a Real Print', file: 'levels/l29-final-print.html', built: false,
      desc: 'A complete blueprint — views, holes, a bolt circle, tolerances, GD&T. Pass it: Toolmaker.' },
  ];
  var RANKS = ['Apprentice', 'Operator', 'Setup', 'Machinist', 'Toolmaker'];

  /* ---------------- state ----------------
     Progress auto-saves to browser storage where the page is allowed to use it
     (so swiping the app away doesn't lose anything), with window.name as the
     in-tab fallback where storage is blocked. Save codes (below) work anywhere. */
  var SAVE_KEY = 'sms-save-v1';
  var durable = (function () {
    try {
      localStorage.setItem('__sms_t', '1');
      localStorage.removeItem('__sms_t');
      return true;
    } catch (e) { return false; }
  })();
  function parseSave(json) {
    try {
      var s = JSON.parse(json || '');
      if (s && s.__sms === 1 && s.lv) return s;
    } catch (e) { /* not a save */ }
    return null;
  }
  function loadState() {
    var fromStore = null;
    if (durable) {
      try { fromStore = parseSave(localStorage.getItem(SAVE_KEY)); } catch (e) {}
    }
    var fromTab = parseSave(window.name);
    /* prefer whichever save has beaten more levels — covers old window.name saves */
    function score(s) {
      if (!s) return -1;
      var n = 0;
      for (var k in s.lv) if (s.lv[k] && s.lv[k].passed) n++;
      return n;
    }
    var best = score(fromStore) >= score(fromTab) ? fromStore : fromTab;
    return best || { __sms: 1, lv: {} };
  }
  var state = loadState();
  function save() {
    var json = JSON.stringify(state);
    window.name = json;
    if (durable) { try { localStorage.setItem(SAVE_KEY, json); } catch (e) {} }
  }
  save();   /* sync both homes with whichever save won on load */

  /* save codes — progress you can carry in a text message */
  function exportCode() {
    return 'SMS1.' + btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  }
  function importCode(code) {
    try {
      code = String(code).trim();
      if (code.indexOf('SMS1.') === 0) code = code.slice(5);
      var s = parseSave(decodeURIComponent(escape(atob(code))));
      if (s) { state.lv = s.lv; save(); return true; }
    } catch (e) { /* bad code */ }
    return false;
  }
  function rec(id) {
    if (!state.lv[id]) state.lv[id] = { passed: false, best: 0, attempts: 0, confidence: 0, bestStreak: 0, points: 0 };
    if (state.lv[id].bestStreak === undefined) state.lv[id].bestStreak = 0;
    if (state.lv[id].points === undefined) state.lv[id].points = 0;
    return state.lv[id];
  }
  function recordBoss(id, pct) {
    var r = rec(id);
    r.attempts += 1;
    if (pct > r.best) r.best = pct;
    if (pct >= 90) r.passed = true;
    r.confidence = Math.max(r.confidence, pct);
    save();
  }
  function recordGame(id, points, streak) {
    var r = rec(id);
    if (points > r.points) r.points = points;
    if (streak > r.bestStreak) r.bestStreak = streak;
    save();
  }
  function nudge(id, ok) {
    var r = rec(id);
    r.confidence = Math.max(0, Math.min(100, r.confidence + (ok ? 1 : -2)));
    save();
  }
  function levelIndex(id) {
    for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === id) return i;
    return -1;
  }
  /* the level whose boss gates this one: the nearest EARLIER BUILT level.
     Unbuilt levels never block, and a level marked open:true has no gate. */
  function gateFor(id) {
    var i = levelIndex(id);
    if (i <= 0 || LEVELS[i].open) return null;
    for (var k = i - 1; k >= 0; k--) {
      if (LEVELS[k].built) return LEVELS[k];
    }
    return null;
  }
  function isUnlocked(id) {
    var g = gateFor(id);
    return !g || rec(g.id).passed;
  }
  function worldComplete(w) {
    for (var i = 0; i < LEVELS.length; i++) {
      if (LEVELS[i].w === w && !rec(LEVELS[i].id).passed) return false;
    }
    return true;
  }
  function rankInfo() {
    var done = 0;
    for (var w = 1; w <= 5; w++) { if (worldComplete(w)) done++; else break; }
    var idx = done >= 5 ? 4 : Math.min(done, 3);
    var passedCount = 0;
    for (var i = 0; i < LEVELS.length; i++) if (rec(LEVELS[i].id).passed) passedCount++;
    return { rank: RANKS[idx], idx: idx, worldsDone: done, passed: passedCount,
      next: idx < 4 ? RANKS[idx + 1] : null };
  }

  /* ---------------- small helpers ---------------- */
  function fmt(v, places) { return Number(v).toFixed(places === undefined ? 3 : places); }
  function fmtExact(v, min) {
    var s = String(Math.round(v * 1e6) / 1e6);
    if (min) {
      var dp = (s.split('.')[1] || '').length;
      if (dp < min) s = Number(v).toFixed(min);
    }
    return s;
  }
  function parseNum(raw) {
    if (raw === undefined || raw === null) return NaN;
    raw = String(raw).trim().replace(/["\s,]/g, '').replace(/−/g, '-');
    if (raw === '') return NaN;
    var m = raw.match(/^(-?\d+)\s*\/\s*(\d+)$/);
    if (m) return Number(m[1]) / Number(m[2]);
    return parseFloat(raw);
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* number words — used for the plain-English meaning lines */
  function intWords(n) {
    n = Math.round(Math.abs(n));
    var ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten',
      'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    var tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + intWords(n % 100) : '');
    return intWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + intWords(n % 1000) : '');
  }
  /* say a decimal the place-value way: 357.25 -> "three hundred fifty-seven and twenty-five hundredths" */
  function placeWords(v, decPlaces) {
    var neg = v < 0; v = Math.abs(v);
    var s = decPlaces === undefined ? String(v) : v.toFixed(decPlaces);
    var parts = s.split('.');
    var ip = parseInt(parts[0], 10) || 0;
    var dp = parts[1] || '';
    if (decPlaces === undefined) dp = dp.replace(/0+$/, '');
    var out = intWords(ip);
    if (dp && dp.length && parseInt(dp, 10) > 0) {
      var names = { 1: 'tenth', 2: 'hundredth', 3: 'thousandth' };
      var unit = names[dp.length] || 'part';
      var dn = parseInt(dp, 10);
      var frag = intWords(dn) + ' ' + unit + (dn === 1 ? '' : 's');
      out = ip === 0 ? frag : out + ' and ' + frag;
    }
    return (neg ? 'minus ' : '') + out;
  }

  /* ---------------- DRO panel ---------------- */
  function dro(el, axisLabel) {
    el.classList.add('dro');
    el.innerHTML = '<div class="row"><span class="ax">' + esc(axisLabel || '') +
      '</span><span class="val"></span></div><div class="meaning"></div>';
    var val = el.querySelector('.val'), mean = el.querySelector('.meaning');
    return { set: function (v, meaningHTML) { val.textContent = v; mean.innerHTML = meaningHTML || ''; } };
  }

  /* ---------------- the game runner ----------------
     runGame(container, {mode:'game'|'boss'|'daily', questions, title, passPct,
                         levelId, onFinish, onAnswer})
     Question contract: {q (HTML), type:'num'|'mc', a, tol, choices, explain,
       hint, steps, diagnose(v)->{label,your,right}|string|null, unit, from, kind}
     Scoring: +10 first-try correct, +5 bonus while streak >= 3. Streaks and best
     streak show live. Wrong answers diagnose the mistake and (game/daily only)
     offer TRY IT AGAIN — retries teach but never score. */
  function runGame(container, opts) {
    var qs = opts.questions;
    var isBoss = opts.mode === 'boss';
    var i = 0, correct = 0, points = 0, streak = 0, bestStreak = 0;

    qs.forEach(function (q) {
      if (q.type === 'mc') q.order = shuffle(q.choices.map(function (_, k) { return k; }));
    });

    function scorebarHTML() {
      return '<div class="scorebar"><span>POINTS <b>' + points + '</b></span>' +
        '<span>STREAK <b>' + streak + '</b>' + (streak >= 3 ? ' 🔥' : '') + '</span>' +
        '<span>BEST <b>' + bestStreak + '</b></span>' +
        '<span class="right">' + correct + ' / ' + i + ' right</span></div>';
    }

    function render() {
      if (i >= qs.length) return renderEnd();
      var q = qs[i];
      var h = '<div class="q-progress">' + esc(opts.title || (isBoss ? 'BOSS' : 'GAME')) +
        ' — ROUND ' + (i + 1) + ' / ' + qs.length +
        (q.from ? ' · from ' + esc(q.from) : '') + '</div>' +
        '<div class="q-text">' + q.q + '</div>';
      if (q.type === 'mc') {
        h += '<div class="choices">' + q.order.map(function (ci, k) {
          return '<button data-k="' + k + '">' + String.fromCharCode(65 + k) + ' · ' + q.choices[ci] + '</button>';
        }).join('') + '</div>';
      } else {
        h += '<div class="answer-row"><input type="text" inputmode="decimal" autocomplete="off" ' +
          'placeholder="' + esc(q.unit ? 'answer in ' + q.unit : 'type your answer') + '" aria-label="answer">' +
          '<button class="primary" data-go>CHECK</button></div>';
      }
      if (!isBoss) {
        h += '<div class="btnrow help-row" style="margin-top:10px">' +
          (q.hint ? '<button data-hint>💡 WHERE DO I START?</button>' : '') +
          '</div><div class="hint-slot"></div>';
      }
      h += '<div class="fb-slot"></div>';
      if (!isBoss) h += scorebarHTML();
      container.innerHTML = h;

      if (q.type === 'mc') {
        container.querySelectorAll('.choices button').forEach(function (b) {
          b.addEventListener('click', function () { answerMC(q, Number(b.dataset.k), b); });
        });
        container.querySelector('.choices button').focus();
      } else {
        var input = container.querySelector('input');
        var go = function () { answerNum(q, input.value); };
        container.querySelector('[data-go]').addEventListener('click', go);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
        input.focus();
      }
      var hb = container.querySelector('[data-hint]');
      if (hb) hb.addEventListener('click', function () {
        container.querySelector('.hint-slot').innerHTML =
          '<div class="hintbox"><b>WHERE TO START</b> ' + q.hint + '</div>';
        hb.disabled = true;
      });
    }

    function answerMC(q, k, btn) {
      var chosen = q.order[k];
      var ok = chosen === q.a;
      btn.style.background = ok ? 'var(--good-bd)' : 'var(--orange)';
      btn.style.color = '#fff';
      var diag = (!ok && q.diagnose) ? q.diagnose(chosen) : null;
      finish(q, ok, String(q.choices[chosen]).replace(/<[^>]*>/g, ''), diag);
    }
    function answerNum(q, raw) {
      var v = parseNum(raw);
      if (isNaN(v)) {
        container.querySelector('.fb-slot').innerHTML =
          '<div class="feedback bad"><b>Type a number.</b> Decimals like 0.375 work; use a leading − for negatives.</div>';
        return;
      }
      var ok = Math.abs(v - q.a) <= (q.tol === undefined ? 0.0005 : q.tol);
      var diag = (!ok && q.diagnose) ? q.diagnose(v) : null;
      finish(q, ok, fmtExact(v), diag);
    }

    function finish(q, ok, shown, diag) {
      var first = !q._attempted;
      q._attempted = true;
      if (first) {
        i += 1;
        if (ok) {
          correct += 1;
          streak += 1;
          if (streak > bestStreak) bestStreak = streak;
          var gain = 10 + (streak >= 3 ? 5 : 0);
          points += gain;
          q._gain = gain;
        } else {
          streak = 0;
        }
        if (opts.onAnswer) opts.onAnswer(q, ok);
      }
      showFeedback(q, ok, shown, diag, !first);
    }

    function showFeedback(q, ok, shown, diag, wasRetry) {
      container.querySelectorAll('.choices button, .answer-row input, .answer-row button, [data-hint]')
        .forEach(function (el) { el.disabled = true; });
      var slot = container.querySelector('.fb-slot');
      var h;
      if (ok) {
        h = '<div class="feedback good"><b>' + (wasRetry ? 'Got it on the retry — that counts where it matters.' :
          'Nailed it.' + (q._gain ? ' <span class="pts">+' + q._gain + (q._gain > 10 ? ' 🔥 streak bonus' : '') + '</span>' : '')) + '</b>' +
          (q.explain || '') + '</div>';
      } else {
        var diagHtml = '';
        if (diag) {
          if (typeof diag === 'string') diagHtml = '<span class="diag">' + diag + '</span>';
          else diagHtml = '<span class="diag">' + esc(diag.label) + '.' +
            '<span class="pathrow wrong">Where your number probably came from: <span class="path">' + diag.your + '</span></span>' +
            '<span class="pathrow right">The right path: <span class="path">' + diag.right + '</span></span></span>';
        }
        h = '<div class="feedback bad"><b>Not this time. You answered ' + esc(shown) + '.</b>' +
          (q.explain || '') + diagHtml +
          (q.steps ? '<span class="steps"><b>THE WHOLE PATH</b>' + q.steps + '</span>' : '') +
          '</div>';
      }
      h += '<div class="btnrow" style="margin-top:10px">' +
        (!ok && !isBoss && !wasRetry ? '<button data-retry>TRY IT AGAIN</button>' : '') +
        '<button class="primary" data-next>' + (i >= qs.length ? 'FINISH' : 'NEXT ROUND →') + '</button></div>';
      slot.innerHTML = h;
      var bar = container.querySelector('.scorebar');
      if (bar) bar.outerHTML = scorebarHTML();
      var rb = slot.querySelector('[data-retry]');
      if (rb) rb.addEventListener('click', function () {
        container.querySelectorAll('.choices button, .answer-row input, .answer-row button')
          .forEach(function (el) {
            el.disabled = false;
            el.style.background = ''; el.style.color = '';
          });
        var input = container.querySelector('.answer-row input');
        if (input) { input.value = ''; input.focus(); }
        slot.innerHTML = '';
      });
      slot.querySelector('[data-next]').addEventListener('click', render);
      slot.querySelector('[data-next]').focus();
    }

    function renderEnd() {
      var pct = Math.round(correct / qs.length * 100);
      var passPct = opts.passPct || 90;
      var passed = pct >= passPct;
      var h = '<div class="result-banner">' +
        '<div class="big ' + (isBoss ? (passed ? 'pass' : 'fail') : 'pass') + '">' + correct + ' / ' + qs.length + '</div>' +
        (isBoss
          ? '<p>' + (passed ? 'BOSS DOWN — ' + pct + '%. The next level is yours.' :
              pct + '%. The boss wants ' + passPct + '%. Replay the game, then come back — bosses fall on the second try all the time.') + '</p>'
          : opts.mode === 'daily'
            ? '<p>' + points + ' points · best streak ' + bestStreak + '. Review done — same time tomorrow.</p>'
            : '<p>' + points + ' points · best streak ' + bestStreak +
              '. The boss round is where it counts — hit it when this feels easy.</p>') +
        '</div>';
      container.innerHTML = h;
      if (opts.levelId && !isBoss) recordGame(opts.levelId, points, bestStreak);
      if (opts.onFinish) opts.onFinish(pct, points, bestStreak);
    }

    render();
  }

  /* ---------------- Daily 10 banks ---------------- */
  var BANKS = {};

  BANKS.l1 = function () {
    var kind = pick(['digitWorth', 'digitWorth', 'assemble', 'compare']);
    if (kind === 'digitWorth') {
      var seats = [[100, 'hundreds'], [10, 'tens'], [1, 'ones'], [0.1, 'tenths'], [0.01, 'hundredths']];
      var si = Math.floor(Math.random() * seats.length);
      var d = 1 + Math.floor(Math.random() * 9);
      var digits = [1 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
      digits[si] = d;
      for (var k2 = 0; k2 < 5; k2++) if (k2 !== si && digits[k2] === d) digits[k2] = (d + 1 + k2) % 10;
      var num = digits[0] * 100 + digits[1] * 10 + digits[2] + digits[3] * 0.1 + digits[4] * 0.01;
      var numStr = digits[0] + '' + digits[1] + '' + digits[2] + '.' + digits[3] + '' + digits[4];
      var a = Math.round(d * seats[si][0] * 100) / 100;
      return { type: 'num', a: a, tol: 0.0005, from: 'Level 1',
        q: 'In <span class="num">' + numStr + '</span>, what is the <span class="num">' + d + '</span> actually worth?',
        explain: 'The ' + d + ' sits in the ' + seats[si][1] + ' seat: ' + d + ' × ' + seats[si][0] +
          ' = <span class="num">' + fmtExact(a) + '</span>.',
        hint: 'Find which SEAT the digit sits in (count from the decimal point). The seat is a multiplier: digit × seat value.',
        steps: '1 · Locate the digit\'s seat: ' + seats[si][1] + '<br>' +
          '2 · Worth = digit × seat = <span class="num">' + d + '</span> × <span class="num">' + seats[si][0] +
          '</span> = <span class="res">' + fmtExact(a) + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - d) < 0.0005 && seats[si][0] !== 1) return { label: 'Face value only',
            your: 'you read the digit ' + d + ' by itself — but its seat multiplies it',
            right: d + ' × ' + seats[si][0] + ' = ' + fmtExact(a) };
          if (Math.abs(v - a * 10) < 0.005 || Math.abs(v - a / 10) < 0.005) return { label: 'One seat over',
            your: 'right digit, neighboring seat: ' + fmtExact(v),
            right: 'the ' + d + ' is in the ' + seats[si][1] + ' seat → ' + fmtExact(a) };
          return { label: 'Seat slip',
            your: fmtExact(v) + ' is not digit × seat',
            right: d + ' × ' + seats[si][0] + ' = ' + fmtExact(a) };
        } };
    }
    if (kind === 'assemble') {
      var h2 = 1 + Math.floor(Math.random() * 9), t2 = Math.floor(Math.random() * 10),
        o2 = Math.floor(Math.random() * 10), te2 = Math.floor(Math.random() * 10);
      var a2 = Math.round((h2 * 100 + t2 * 10 + o2 + te2 * 0.1) * 10) / 10;
      return { type: 'num', a: a2, tol: 0.0005, from: 'Level 1',
        q: '<span class="num">' + h2 + '</span> hundreds + <span class="num">' + t2 + '</span> tens + ' +
          '<span class="num">' + o2 + '</span> ones + <span class="num">' + te2 + '</span> tenths = ?',
        explain: h2 + '×100 + ' + t2 + '×10 + ' + o2 + '×1 + ' + te2 + '×0.1 = <span class="num">' + fmtExact(a2) + '</span>.',
        hint: 'Give every count its seat and add: hundreds ×100, tens ×10, ones ×1, tenths ×0.1. Zeros still hold their seat.',
        steps: '1 · ' + h2 + '×100 = ' + h2 * 100 + ' · ' + t2 + '×10 = ' + t2 * 10 + ' · ' + o2 + '×1 = ' + o2 +
          ' · ' + te2 + '×0.1 = ' + fmtExact(te2 * 0.1) + '<br>2 · Add: <span class="res">' + fmtExact(a2) + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - (h2 * 100 + t2 * 10 + o2 + te2 * 0.01)) < 0.0005 && te2 !== 0) return { label: 'Tenths landed in the hundredths seat',
            your: fmtExact(v) + ' put the ' + te2 + ' two seats right of the point',
            right: te2 + ' TENTHS = ' + te2 + ' × 0.1 = ' + fmtExact(te2 * 0.1) };
          if (Math.abs(v - parseFloat('' + h2 + t2 + o2 + te2)) < 0.5) return { label: 'Digits glued together',
            your: 'you strung the counts into ' + h2 + '' + t2 + '' + o2 + '' + te2 + ' — the decimal point vanished',
            right: 'the tenths live RIGHT of the point: ' + fmtExact(a2) };
          return { label: 'Seat slip',
            your: fmtExact(v) + ' is not the sum of digit × seat',
            right: h2 + '×100 + ' + t2 + '×10 + ' + o2 + ' + ' + te2 + '×0.1 = ' + fmtExact(a2) };
        } };
    }
    var pairs = [['0.5', '0.375'], ['0.25', '0.3'], ['0.75', '0.8'], ['0.625', '0.7'], ['0.4', '0.125'], ['0.05', '0.2']];
    var p2 = pick(pairs);
    var bigger = parseFloat(p2[0]) > parseFloat(p2[1]) ? 0 : 1;
    return { type: 'mc', a: bigger, choices: [p2[0], p2[1]], from: 'Level 1',
      q: 'Which number is <b>larger</b>?',
      explain: 'Pad to the same length and compare seat by seat: ' +
        p2[0] + ' vs ' + p2[1] + ' → <span class="num">' + p2[bigger] + '</span> wins. More digits does NOT mean bigger.',
      hint: 'Give both numbers the same number of decimal places by padding zeros (0.5 → 0.500). Then compare left to right, seat by seat.',
      steps: '1 · Pad: ' + Number(p2[0]).toFixed(3) + ' vs ' + Number(p2[1]).toFixed(3) + '<br>' +
        '2 · Compare the tenths seat first, then hundredths<br>' +
        '3 · <span class="res">' + p2[bigger] + '</span> is larger',
      diagnose: function () {
        return { label: 'Longer looked larger',
          your: 'the number with more digits FEELS bigger — but extra decimal places are smaller and smaller pieces',
          right: 'pad and compare seats: ' + Number(p2[0]).toFixed(3) + ' vs ' + Number(p2[1]).toFixed(3) + ' → ' + p2[bigger] };
      } };
  };

  BANKS.l2 = function () {
    var kind = pick(['addCarry', 'addCarry', 'subBorrow', 'addDec']);
    function rnd(n) { return Math.floor(Math.random() * n); }
    if (kind === 'addCarry') {
      var a = 0, b = 0, t, good = false;
      for (t = 0; t < 200 && !good; t++) {
        a = 12 + rnd(76); b = 12 + rnd(76);
        good = a % 10 + b % 10 >= 10 && Math.floor(a / 10) + Math.floor(b / 10) + 1 <= 9;
      }
      if (!good) { a = 47; b = 38; }
      var ans = a + b, oSum = a % 10 + b % 10;
      var noCarry = ans - 10;
      var glue = parseInt(String(Math.floor(a / 10) + Math.floor(b / 10)) + String(oSum), 10);
      return { type: 'num', a: ans, tol: 0.4, from: 'Level 2',
        q: 'Add: <span class="num">' + a + '</span> + <span class="num">' + b + '</span> = ?',
        explain: 'The ones make ' + oSum + ' — the 1 in front is a ten, so it carries one seat left: <span class="num">' + ans + '</span>.',
        hint: 'Stack them, ones over ones, and work right to left. A column that reaches 10 keeps its ones digit and sends a small 1 to the next column left.',
        steps: '1 · Ones: <span class="num">' + a % 10 + '</span> + <span class="num">' + b % 10 + '</span> = ' + oSum + ' → write ' + (oSum % 10) + ', carry 1<br>' +
          '2 · Tens: <span class="num">' + Math.floor(a / 10) + '</span> + <span class="num">' + Math.floor(b / 10) + '</span> + 1 carried = ' + (Math.floor(a / 10) + Math.floor(b / 10) + 1) + '<br>' +
          '3 · Answer: <span class="res">' + ans + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - glue) < 0.4 && glue !== ans) return { label: 'The carry got written down instead of carried',
            your: 'the whole ' + oSum + ' went into the answer, gluing digits into ' + glue,
            right: 'write only the ' + (oSum % 10) + ', carry the 1 into the tens → ' + ans };
          if (Math.abs(v - noCarry) < 0.4) return { label: 'Forgot the carry',
            your: 'your answer is exactly 10 short — the carried 1 (a whole ten) vanished',
            right: 'carry the 1 from ' + (a % 10) + '+' + (b % 10) + '=' + oSum + ' into the tens: ' + ans };
          if (Math.abs(v - Math.abs(a - b)) < 0.4) return { label: 'Subtracted instead of added',
            your: 'you found the gap between ' + a + ' and ' + b + ', not the total',
            right: a + ' + ' + b + ' = ' + ans };
          return { label: 'Column slip',
            your: fmtExact(v) + ' doesn\'t come from adding seat to seat',
            right: 'ones then tens, carrying the 1: ' + a + ' + ' + b + ' = ' + ans };
        } };
    }
    if (kind === 'subBorrow') {
      var a2 = 0, b2 = 0, t2, good2 = false;
      for (t2 = 0; t2 < 300 && !good2; t2++) {
        a2 = 30 + rnd(69); b2 = 12 + rnd(70);
        good2 = b2 < a2 && a2 % 10 < b2 % 10;
      }
      if (!good2) { a2 = 62; b2 = 27; }
      var ans2 = a2 - b2;
      var flip = Math.abs(a2 % 10 - b2 % 10) + Math.abs(Math.floor(a2 / 10) - Math.floor(b2 / 10)) * 10;
      var oa = a2 % 10, ob = b2 % 10, ta = Math.floor(a2 / 10), tb = Math.floor(b2 / 10);
      return { type: 'num', a: ans2, tol: 0.4, from: 'Level 2',
        q: 'Take away: <span class="num">' + a2 + '</span> − <span class="num">' + b2 + '</span> = ?',
        explain: oa + ' can\'t give ' + ob + ', so a ten changes seats — borrow, then subtract: <span class="num">' + ans2 + '</span>.',
        hint: 'Stack them, bigger on top. When a top digit is smaller than the one under it, borrow 10 from the seat to its left — and drop that seat by 1.',
        steps: '1 · Ones: <span class="num">' + oa + '</span> can\'t give <span class="num">' + ob + '</span> → borrow: ' + (oa + 10) + ' − ' + ob + ' = ' + (oa + 10 - ob) + '<br>' +
          '2 · Tens: the ' + ta + ' lent 1 → ' + (ta - 1) + '; ' + (ta - 1) + ' − ' + tb + ' = ' + (ta - 1 - tb) + '<br>' +
          '3 · Answer: <span class="res">' + ans2 + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - flip) < 0.4 && flip !== ans2) return { label: 'Columns flipped instead of borrowed',
            your: 'each column took small from big whichever row it sat in — ' + oa + ' short of ' + ob + ' became ' + Math.abs(oa - ob) + ' with no borrow, landing on ' + flip,
            right: 'the TOP row is being cut: borrow 10, then ' + a2 + ' − ' + b2 + ' = ' + ans2 };
          if (Math.abs(v - (a2 + b2)) < 0.4) return { label: 'Added instead of subtracted',
            your: a2 + ' + ' + b2 + ' = ' + (a2 + b2) + ' grows the pile — this one takes away',
            right: a2 + ' − ' + b2 + ' = ' + ans2 };
          if (Math.round(v - ans2) === 10) return { label: 'Borrowed but never paid it back',
            your: 'the ones took their 10, but the tens seat never went down by 1 — the answer ran 10 high',
            right: 'every borrow costs the lender 1: ' + a2 + ' − ' + b2 + ' = ' + ans2 };
          return { label: 'Column slip',
            your: fmtExact(v) + ' doesn\'t come from working the columns right to left',
            right: 'borrow where a column runs short: ' + a2 + ' − ' + b2 + ' = ' + ans2 };
        } };
    }
    var ah = (1 + rnd(8)) * 100 + (1 + rnd(9)) * 10;
    var bh = rnd(2) * 100 + pick([25, 75, 5, 45, 15, 35, 65, 85]);
    var ans3 = (ah + bh) / 100;
    var as = fmtExact(ah / 100), bs = fmtExact(bh / 100);
    var pa = (ah / 100).toFixed(2), pb = (bh / 100).toFixed(2);
    var ga = parseInt(as.replace('.', ''), 10), gb = parseInt(bs.replace('.', ''), 10), glue3 = ga + gb;
    return { type: 'num', a: ans3, tol: 0.0005, from: 'Level 2',
      q: 'Stack two shims: <span class="num">' + as + '</span> + <span class="num">' + bs + '</span> = ? (inches)',
      explain: 'The POINT lines up, not the right edge — pad with zeros: ' + pa + ' + ' + pb + ' = <span class="num">' + fmtExact(ans3) + '</span>.',
      hint: 'Stack them so the decimal POINTS sit in one column, pad the short one with zeros, then add like whole numbers. The point drops straight down.',
      steps: '1 · Points line up — pad: <span class="num">' + pa + '</span> + <span class="num">' + pb + '</span><br>' +
        '2 · Think in hundredths: ' + ah + ' + ' + bh + ' = ' + (ah + bh) + ' hundredths<br>' +
        '3 · The point drops straight down: <span class="res">' + fmtExact(ans3) + '</span>',
      diagnose: function (v) {
        if (Math.abs(v - glue3) < 0.005 || Math.abs(v - glue3 / 10) < 0.005 || Math.abs(v - glue3 / 100) < 0.005) return { label: 'Right edges lined up',
          your: 'stacked flush right the digits read ' + ga + ' + ' + gb + ' = ' + glue3 + ' — but those digits sat in different seats',
          right: 'points in one column, pad with zeros: ' + pa + ' + ' + pb + ' = ' + fmtExact(ans3) };
        if (Math.abs(v - Math.abs(ah - bh) / 100) < 0.005) return { label: 'Subtracted instead of added',
          your: 'you found the gap (' + fmtExact(Math.abs(ah - bh) / 100) + '), not the stack height',
          right: pa + ' + ' + pb + ' = ' + fmtExact(ans3) };
        if (Math.abs(v - ans3 * 10) < 0.005 || Math.abs(v - ans3 / 10) < 0.005) return { label: 'The point slipped a seat',
          your: fmtExact(v) + ' is the right digits with the decimal point one seat off',
          right: 'the point never moves: ' + pa + ' + ' + pb + ' = ' + fmtExact(ans3) };
        return { label: 'Column slip',
          your: fmtExact(v) + ' doesn\'t come from adding the padded columns',
          right: pa + ' + ' + pb + ' = ' + fmtExact(ans3) };
      } };
  };
  BANKS.l3 = function () {
      var kind = pick(['tableFact', 'tableFact', 'areaMultiply', 'howManyFit']);
      function rnd(n) { return Math.floor(Math.random() * n); }
      if (kind === 'tableFact') {
        var a = 3 + rnd(10), b = pick([4, 5, 6, 7, 8, 9, 11, 12]);
        var p = a * b;
        var list = [];
        for (var k = 1; k <= b; k++) list.push(a * k);
        return { type: 'num', a: p, tol: 0.4, from: 'Level 3',
          q: 'Times table: <span class="num">' + a + '</span> × <span class="num">' + b + '</span> = ?',
          explain: a + ' × ' + b + ' means ' + a + ' rows of ' + b + ' — <span class="num">' + p + '</span>.',
          hint: 'Build it from a row you own: ×10 slides the seat, ×9 is ×10 minus one row, ×11 is ×10 plus one row, ×5 is half of ×10, ×4 is double twice.',
          steps: '1 · Skip-count by <span class="num">' + a + '</span>, ' + b + ' steps: ' + list.join(', ') + '<br>' +
            '2 · Step ' + b + ' lands on <span class="res">' + p + '</span>',
          diagnose: function (v) {
            if (Math.abs(v - (a + b)) < 0.4) return { label: 'Added instead of multiplied',
              your: a + ' + ' + b + ' = ' + (a + b) + ' — that is one row plus one column, not ' + a + ' rows of ' + b,
              right: a + ' × ' + b + ' = ' + p };
            if (Math.abs(v - a * (b + 1)) < 0.4 || Math.abs(v - a * (b - 1)) < 0.4 ||
                Math.abs(v - (a + 1) * b) < 0.4 || Math.abs(v - (a - 1) * b) < 0.4) return { label: 'Neighbor fact',
              your: fmtExact(v) + ' sits one row or one column over from ' + a + ' × ' + b,
              right: a + ' × ' + b + ' = ' + p };
            return { label: 'Table slip',
              your: fmtExact(v) + ' is not on the ' + a + ' row — anchor on ' + a + ' × 10 = ' + (a * 10) + ' and step from there',
              right: a + ' × ' + b + ' = ' + p };
          } };
      }
      if (kind === 'areaMultiply') {
        var t = 1 + rnd(8), o = 1 + rnd(9), b2 = 2 + rnd(8);
        var a2 = t * 10 + o, p1 = t * 10 * b2, p2 = o * b2, pr = a2 * b2;
        return { type: 'num', a: pr, tol: 0.4, from: 'Level 3',
          q: 'Cut it into boxes: <span class="num">' + a2 + '</span> × <span class="num">' + b2 + '</span> = ?',
          explain: '(' + (t * 10) + ' × ' + b2 + ') + (' + o + ' × ' + b2 + ') = ' + p1 + ' + ' + p2 + ' = <span class="num">' + pr + '</span>.',
          hint: 'Split ' + a2 + ' at the seats: ' + (t * 10) + ' and ' + o + '. Multiply EACH piece by ' + b2 + ', then add the two boxes.',
          steps: '1 · Split: ' + a2 + ' = ' + (t * 10) + ' + ' + o + '<br>' +
            '2 · <span class="num">' + (t * 10) + '</span> × ' + b2 + ' = ' + p1 + ' · <span class="num">' + o + '</span> × ' + b2 + ' = ' + p2 + '<br>' +
            '3 · ' + p1 + ' + ' + p2 + ' = <span class="res">' + pr + '</span>',
          diagnose: function (v) {
            if (Math.abs(v - (a2 + b2)) < 0.4) return { label: 'Added instead of multiplied',
              your: a2 + ' + ' + b2 + ' = ' + (a2 + b2) + ' — that is one of each, not ' + b2 + ' rows of ' + a2,
              right: p1 + ' + ' + p2 + ' = ' + pr };
            if (Math.abs(v - p1) < 0.4 || Math.abs(v - p2) < 0.4) return { label: 'Dropped a box',
              your: fmtExact(v) + ' is only one of the two boxes — the other piece never got multiplied',
              right: p1 + ' + ' + p2 + ' = ' + pr };
            if (Math.abs(v - pr * 10) < 0.4 || Math.abs(v - pr / 10) < 0.05) return { label: 'Magnitude slip',
              your: fmtExact(v) + ' is the right digits at the wrong size — a zero slipped in or out',
              right: p1 + ' + ' + p2 + ' = ' + pr };
            return { label: 'Box slip',
              your: fmtExact(v) + ' is not (tens × ' + b2 + ') + (ones × ' + b2 + ')',
              right: p1 + ' + ' + p2 + ' = ' + pr };
          } };
      }
      var pp = 3 + rnd(8), fit = 5 + rnd(8), rem = 1 + rnd(pp - 1);
      var L = fit * pp + rem;
      return { type: 'num', a: fit, tol: 0.4, from: 'Level 3',
        q: 'A bar of stock is <span class="num">' + L + '</span> inches long. Each part needs <span class="num">' + pp + '</span> inches. How many whole parts fit?',
        explain: fit + ' parts × ' + pp + ' = ' + (fit * pp) + ' inches used — ' + rem + ' inch' + (rem > 1 ? 'es' : '') + ' left over, not enough for another part.',
        hint: 'Count by ' + pp + ' up the bar and stop BEFORE you pass ' + L + '. A part you cannot finish does not count.',
        steps: '1 · ' + fit + ' × ' + pp + ' = ' + (fit * pp) + ' fits inside ' + L + '<br>' +
          '2 · ' + (fit + 1) + ' × ' + pp + ' = ' + ((fit + 1) * pp) + ' is past the end of the bar<br>' +
          '3 · <span class="res">' + fit + '</span> whole parts, ' + rem + ' in left over',
        diagnose: function (v) {
          if (Math.abs(v - (fit + 1)) < 0.4) return { label: 'Rounded up — you cannot ship part of a part',
            your: 'part ' + (fit + 1) + ' would need ' + ((fit + 1) * pp) + ' inches and the bar has ' + L,
            right: fit + ' whole parts; the ' + rem + ' leftover inch' + (rem > 1 ? 'es' : '') + ' are scrap' };
          if (Math.abs(v - (L - pp)) < 0.4) return { label: 'Subtracted the part once',
            your: L + ' − ' + pp + ' = ' + (L - pp) + ' removes ONE part — the question asks how many times ' + pp + ' fits',
            right: 'count by ' + pp + ' → ' + fit + ' parts' };
          return { label: 'Fit slip',
            your: 'check it: ' + fmtExact(v) + ' × ' + pp + ' = ' + (Math.round(v * pp * 100) / 100) + ' against the ' + L + '-inch bar',
            right: fit + ' × ' + pp + ' = ' + (fit * pp) + ' with ' + rem + ' left over → ' + fit };
        } };
    };
  BANKS.l4 = function () {
    var kind = pick(['shareRem', 'nextDigit', 'frac2dec', 'frac2dec']);
    function walk(n, d) {
      var r = n % d, digits = [], states = [], rems = [], i, m, g;
      for (i = 0; i < 8 && r > 0; i++) {
        m = r * 10; g = Math.floor(m / d); r = m - g * d;
        states.push(m); digits.push(g); rems.push(r);
      }
      return { digits: digits, states: states, rems: rems };
    }
    var FR = [[1, 2], [1, 4], [3, 4], [1, 8], [3, 8], [5, 8], [7, 8], [3, 16], [5, 16]];
    if (kind === 'shareRem') {
      var p = 3 + Math.floor(Math.random() * 5);
      var s = 2 + Math.floor(Math.random() * 8);
      var r2 = 1 + Math.floor(Math.random() * (p - 1));
      var n2 = p * s + r2;
      var askRem = Math.random() < 0.5;
      return { type: 'num', a: askRem ? r2 : s, tol: 0.4, from: 'Level 4',
        q: '<span class="num">' + n2 + '</span> parts to pack, <span class="num">' + p + '</span> boxes, every box filled the same — ' +
          (askRem ? 'how many parts are <b>left over</b>?' : 'how many parts in each full box?'),
        explain: 'Biggest multiple of ' + p + ' that fits under ' + n2 + ': ' + p + ' × ' + s + ' = ' + (p * s) +
          '. Left over: ' + n2 + ' − ' + (p * s) + ' = ' + r2 + '. So ' + n2 + ' ÷ ' + p + ' = <span class="num">' + s +
          '</span> remainder <span class="num">' + r2 + '</span>.',
        hint: 'Walk the ' + p + 's table to the biggest multiple that still FITS under ' + n2 +
          ' — one more must go over. That many per box; the gap up to ' + n2 + ' is the remainder.',
        steps: '1 · Biggest fit: ' + p + '×' + s + ' = ' + (p * s) + ' (one more, ' + p + '×' + (s + 1) + ' = ' + (p * (s + 1)) +
          ', goes over ' + n2 + ')<br>2 · Left over: ' + n2 + ' − ' + (p * s) + ' = ' + r2 + '<br>' +
          '3 · ' + (askRem ? 'Remainder: <span class="res">' + r2 + '</span>' : 'Each full box: <span class="res">' + s + '</span>'),
        diagnose: function (v) {
          if (askRem && Math.abs(v - s) < 0.4) return { label: 'You gave the share, not the remainder',
            your: s + ' is how many each box HOLDS — the question asked what would not fit',
            right: n2 + ' − ' + p + '×' + s + ' = ' + n2 + ' − ' + (p * s) + ' = ' + r2 };
          if (!askRem && Math.abs(v - r2) < 0.4) return { label: 'You gave the remainder, not the share',
            your: r2 + ' is what is left OUTSIDE the boxes after filling them',
            right: 'each full box holds ' + s + ' (' + p + '×' + s + ' = ' + (p * s) + ' fits under ' + n2 + ')' };
          if (!askRem && Math.abs(v - (s + 1)) < 0.4) return { label: 'One too many per box',
            your: p + '×' + (s + 1) + ' = ' + (p * (s + 1)) + ' parts needed — you only have ' + n2,
            right: p + '×' + s + ' = ' + (p * s) + ' fits → ' + s + ' each, ' + r2 + ' left' };
          return { label: 'Share slipped',
            your: 'the check fails: ' + fmtExact(v) + ' does not rebuild ' + n2 + ' as boxes + remainder',
            right: p + '×' + s + ' + ' + r2 + ' = ' + n2 + ' → share ' + s + ', remainder ' + r2 };
        } };
    }
    if (kind === 'nextDigit') {
      var f3 = pick(FR);
      var w3 = walk(f3[0], f3[1]);
      var ix = Math.floor(Math.random() * w3.digits.length);
      var d3 = f3[1], m3 = w3.states[ix], g3 = w3.digits[ix], r3 = w3.rems[ix];
      var sofar = '0.' + w3.digits.slice(0, ix).join('');
      return { type: 'num', a: g3, tol: 0.4, from: 'Level 4',
        q: 'Long division: you\'re turning <span class="num">' + f3[0] + '/' + d3 + '</span> into a decimal, with <span class="num">' +
          sofar + '</span> written so far. The leftover gets a zero stuck on, making <span class="num">' + m3 +
          '</span>. <span class="num">' + d3 + '</span> into <span class="num">' + m3 + '</span> goes what digit?',
        explain: 'Would one more go over? ' + d3 + '×' + g3 + ' = ' + (d3 * g3) + ' fits inside ' + m3 + '; ' + d3 + '×' + (g3 + 1) +
          ' = ' + (d3 * (g3 + 1)) + ' goes over. Digit <span class="num">' + g3 + '</span>, new leftover ' + r3 + '.',
        hint: 'Walk the ' + d3 + 's table upward. The digit is the most times ' + d3 + ' FITS inside ' + m3 + ' — one more must go over.',
        steps: '1 · Walk the table: ' + d3 + '×' + g3 + ' = ' + (d3 * g3) + ' ≤ ' + m3 + '<br>' +
          '2 · One more: ' + d3 + '×' + (g3 + 1) + ' = ' + (d3 * (g3 + 1)) + ' — goes over<br>' +
          '3 · Digit <span class="res">' + g3 + '</span>, leftover ' + m3 + ' − ' + (d3 * g3) + ' = ' + r3,
        diagnose: function (v) {
          if (Math.abs(v - (g3 + 1)) < 0.4) return { label: 'Digit too big',
            your: d3 + '×' + (g3 + 1) + ' = ' + (d3 * (g3 + 1)) + ' overshoots ' + m3 + ' — the product has to FIT',
            right: d3 + '×' + g3 + ' = ' + (d3 * g3) + ' fits → digit ' + g3 };
          if (g3 > 0 && Math.abs(v - (g3 - 1)) < 0.4) return { label: 'Digit too small',
            your: d3 + '×' + (g3 - 1) + ' = ' + (d3 * (g3 - 1)) + ' fits — but so does one more: ' + d3 + '×' + g3 + ' = ' + (d3 * g3),
            right: 'push until one more would go over → ' + g3 };
          if (Math.abs(v - r3) < 0.4 && r3 !== g3) return { label: 'That\'s the leftover, not the digit',
            your: m3 + ' − ' + d3 + '×' + g3 + ' = ' + r3 + ' is what CARRIES to the next step',
            right: 'the digit written in the answer is ' + g3 + '; the ' + r3 + ' carries on' };
          return { label: 'Digit drifted',
            your: fmtExact(v) + ' would mean ' + d3 + '×' + fmtExact(v) + ' fits in ' + m3 + ' with one more going over — it doesn\'t',
            right: d3 + '×' + g3 + ' = ' + (d3 * g3) + ' fits → digit ' + g3 };
        } };
    }
    var f4 = pick(FR);
    var n4 = f4[0], d4 = f4[1], a4 = n4 / d4;
    var w4 = walk(n4, d4);
    var st = '1 · Top ÷ bottom: ' + n4 + ' ÷ ' + d4 + '. ' + d4 + ' into ' + n4 +
      '? Doesn\'t go — write <span class="num">0</span> and bring the point';
    var run4 = '0.';
    for (var i4 = 0; i4 < w4.digits.length; i4++) {
      run4 += String(w4.digits[i4]);
      st += '<br>' + (i4 + 2) + ' · ' + d4 + ' into ' + w4.states[i4] + ' goes <span class="num">' + w4.digits[i4] +
        '</span> — leftover ' + w4.rems[i4] + ' → ' + run4;
    }
    st += '<br>' + (w4.digits.length + 2) + ' · <span class="res">' + fmtExact(a4) + '</span> · check: ' +
      fmtExact(a4) + ' × ' + d4 + ' = ' + n4 + ' ✓';
    return { type: 'num', a: a4, tol: 0.0005, from: 'Level 4',
      q: 'Turn <span class="num">' + n4 + '/' + d4 + '</span> into a decimal. (A fraction IS a division: top ÷ bottom.)',
      explain: n4 + '/' + d4 + ' = ' + n4 + ' ÷ ' + d4 + ' = <span class="num">' + fmtExact(a4) + '</span>. Check by going backwards: ' +
        fmtExact(a4) + ' × ' + d4 + ' = ' + n4 + ' ✓',
      hint: 'Top ÷ bottom, never the other way. ' + d4 + ' won\'t go into ' + n4 + ' — write 0, bring the point, then work ' +
        d4 + ' into ' + (n4 * 10) + '. Each leftover gets a zero stuck on and carries.',
      steps: st,
      diagnose: function (v) {
        var inv = d4 / n4;
        if (Math.abs(v - inv) < (n4 === 1 ? 0.4 : 0.02)) return { label: 'Inverted — you worked bottom ÷ top',
          your: d4 + ' ÷ ' + n4 + ' ≈ ' + fmtExact(Math.round(inv * 100) / 100) + ' answers the upside-down question',
          right: 'a fraction is top ÷ bottom: ' + n4 + ' ÷ ' + d4 + ' = ' + fmtExact(a4) };
        if (Math.abs(v - a4 * 10) < 0.002 || Math.abs(v - a4 * 100) < 0.02 || Math.abs(v - a4 / 10) < 0.0005) return { label: 'Decimal slipped',
          your: fmtExact(v) + ' has the right digits in the wrong seats — the point slid',
          right: n4 + ' is smaller than ' + d4 + ', so the answer starts 0.: ' + fmtExact(a4) };
        return { label: 'A digit went off the rails',
          your: 'the check fails: ' + fmtExact(v) + ' × ' + d4 + ' does not land back on ' + n4,
          right: 'work it digit by digit: ' + fmtExact(a4) + ' (check: ' + fmtExact(a4) + ' × ' + d4 + ' = ' + n4 + ' ✓)' };
      } };
  };
  BANKS.l5 = function () {
    var kind = pick(['addSame', 'addSame', 'equivalent', 'mixedImproper']);
    function rnd(n) { return Math.floor(Math.random() * n); }
    var DP = { 2: 'halves', 4: 'quarters', 8: 'eighths', 16: 'sixteenths' };
    if (kind === 'addSame') {
      var d = pick([4, 8, 8, 16]);
      var a1, b1, t;
      for (t = 0; t < 30; t++) {
        a1 = 1 + rnd(d - 2); b1 = 1 + rnd(d - 1 - a1);
        if ((a1 + b1) % 2 === 1) break;
      }
      if ((a1 + b1) % 2 !== 1) { a1 = 1; b1 = 2; }
      var s1 = a1 + b1;
      return { type: 'mc', a: 0, from: 'Level 5',
        choices: [s1 + '/' + d, s1 + '/' + (2 * d), (a1 * b1) + '/' + d],
        q: '<span class="num">' + a1 + '/' + d + '</span> + <span class="num">' + b1 + '/' + d + '</span> = ?',
        explain: 'Same bottom = same-size pieces, so just count them: ' + a1 + ' + ' + b1 + ' = <span class="num">' + s1 + '/' + d + '</span>. The bottom stays ' + d + '.',
        hint: 'The bottoms already match, so the pieces are the same size. Add the TOPS only — the bottom is the size of the cut, and it never adds.',
        steps: '1 · Bottoms match (' + d + ' and ' + d + ') — the pieces are the same size<br>' +
          '2 · Add the tops: <span class="num">' + a1 + '</span> + <span class="num">' + b1 + '</span> = ' + s1 + '<br>' +
          '3 · Keep the bottom: <span class="res">' + s1 + '/' + d + '</span>',
        diagnose: function (chosen) {
          if (chosen === 1) return { label: 'Added the tops AND the bottoms — the classic',
            your: s1 + '/' + (2 * d) + ' says the pieces got SMALLER when you put them together. The bottom is a piece size, not an amount — ' + DP[d] + ' stay ' + DP[d] + ' when you add them',
            right: 'add the tops, keep the bottom: ' + a1 + ' + ' + b1 + ' = ' + s1 + ' → ' + s1 + '/' + d };
          return { label: 'Multiplied the tops',
            your: a1 + ' × ' + b1 + ' = ' + (a1 * b1) + ' — but adding fractions COUNTS pieces, it never multiplies them',
            right: a1 + ' + ' + b1 + ' = ' + s1 + ' → ' + s1 + '/' + d };
        } };
    }
    if (kind === 'equivalent') {
      var b = pick([[1, 2], [1, 4], [3, 4], [3, 8], [5, 8]]);
      var n0 = b[0], d0 = b[1], ks = [], kk;
      for (kk = 2; d0 * kk <= 16; kk *= 2) ks.push(kk);
      var k = pick(ks);
      var up = rnd(2) === 0;
      var fromN = up ? n0 : n0 * k, fromD = up ? d0 : d0 * k, toD = up ? d0 * k : d0;
      var a2 = up ? n0 * k : n0;
      return { type: 'num', a: a2, tol: 0.4, from: 'Level 5',
        q: 'Same amount, different cut: <span class="num">' + fromN + '/' + fromD + '</span> = <span class="num">?/' + toD + '</span> — what goes on top?',
        explain: 'The bottom went ' + fromD + ' → ' + toD + ' (' + (up ? '×' : '÷') + k + '), so the top takes the same ride: ' + fromN + ' ' + (up ? '×' : '÷') + ' ' + k + ' = <span class="num">' + a2 + '</span>. Same amount, different cuts.',
        hint: 'Compare the bottoms first: what got multiplied or divided to turn one into the other? Then do exactly the same thing to the top — top and bottom always move together.',
        steps: '1 · Bottom: ' + fromD + ' → ' + toD + ' — that is ' + (up ? '×' : '÷') + k + '<br>' +
          '2 · Same to the top: <span class="num">' + fromN + '</span> ' + (up ? '×' : '÷') + ' ' + k + '<br>' +
          '3 · = <span class="res">' + a2 + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - fromN) < 0.4) return { label: 'Copied the top',
            your: 'you changed the cut but kept the top — ' + fromN + '/' + toD + ' is a different amount than ' + fromN + '/' + fromD,
            right: 'top and bottom move together: ' + fromN + ' ' + (up ? '×' : '÷') + ' ' + k + ' = ' + a2 };
          if (up && Math.abs(v - (fromN + toD - fromD)) < 0.4) return { label: 'Added instead of multiplied',
            your: 'the bottom grew by ' + (toD - fromD) + ', so you added ' + (toD - fromD) + ' on top — but recutting MULTIPLIES: every old piece becomes ' + k + ' new ones',
            right: fromN + ' × ' + k + ' = ' + a2 };
          return { label: 'The recut changed the amount',
            your: v + '/' + toD + ' is not the same amount as ' + fromN + '/' + fromD,
            right: 'whatever the bottom does, the top does: ' + fromN + ' ' + (up ? '×' : '÷') + ' ' + k + ' = ' + a2 };
        } };
    }
    var d3 = pick([4, 8, 8, 16]);
    var w = 1 + rnd(2), n3 = 1 + rnd(d3 - 1);
    var a3 = w * d3 + n3;
    return { type: 'num', a: a3, tol: 0.4, from: 'Level 5',
      q: 'A part measures <span class="num">' + w + ' ' + n3 + '/' + d3 + '</span> inches. How many <b>' + DP[d3] + '</b> of an inch is that in total?',
      explain: 'A mixed number is a plus sign in disguise: each whole inch is ' + d3 + '/' + d3 + ', so ' + w + ' × ' + d3 + ' + ' + n3 + ' = <span class="num">' + a3 + '</span> ' + DP[d3] + ' — written as a fraction, ' + a3 + '/' + d3 + '.',
      hint: 'A mixed number means whole PLUS fraction. Turn every whole into bottom-many pieces first (one whole = bottom/bottom), then add the top on.',
      steps: '1 · Each whole inch = <span class="num">' + d3 + '</span>/' + d3 + '<br>' +
        '2 · ' + w + ' whole' + (w > 1 ? 's' : '') + ' = ' + w + ' × ' + d3 + ' = ' + (w * d3) + ' ' + DP[d3] + '<br>' +
        '3 · Add the top: ' + (w * d3) + ' + ' + n3 + ' = <span class="res">' + a3 + '</span>',
      diagnose: function (v) {
        if (Math.abs(v - n3) < 0.4) return { label: 'The whole number vanished',
          your: 'you answered just the ' + n3 + ' on top — but the ' + w + ' whole inch' + (w > 1 ? 'es' : '') + ' are ' + (w * d3) + ' more ' + DP[d3],
          right: w + ' × ' + d3 + ' + ' + n3 + ' = ' + a3 };
        if (Math.abs(v - n3 * d3) < 0.4) return { label: 'Multiplied instead of added',
          your: n3 + ' × ' + d3 + ' = ' + (n3 * d3) + ' — but a mixed number means PLUS: ' + w + ' ' + n3 + '/' + d3 + ' is ' + w + ' + ' + n3 + '/' + d3 + ', nothing gets multiplied together',
          right: w + ' × ' + d3 + ' + ' + n3 + ' = ' + a3 };
        if (Math.abs(v - (w + n3)) < 0.4) return { label: 'Added the whole straight to the top',
          your: w + ' + ' + n3 + ' = ' + (w + n3) + ' counts inches and ' + DP[d3] + ' as the same size piece — recut the wholes into ' + DP[d3] + ' first',
          right: w + ' × ' + d3 + ' + ' + n3 + ' = ' + a3 };
        return { label: 'The wholes got lost in the recut',
          your: v + ' is not wholes × bottom + top',
          right: w + ' × ' + d3 + ' + ' + n3 + ' = ' + a3 };
      } };
  };

  BANKS.l6 = function () {
    var LMD = 0.0625;
    function gcd2(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
    function fr(n, d) { var g = gcd2(n, d) || 1; return (n / g) + '/' + (d / g); }
    function fd(v) { return fmtExact(v, 3); }
    var kind = pick(['f2d', 'f2d', 'whichBigger', 'stack']);
    if (kind === 'f2d') {
      var n16 = pick([1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15]);
      var a = n16 * LMD;
      var fs = fr(n16, 16);
      var parts = fs.split('/');
      var n = parseInt(parts[0], 10), d = parseInt(parts[1], 10);
      return { type: 'num', a: a, tol: 0.0005, from: 'Level 6',
        q: 'What is <span class="num">' + fs + '</span> as a decimal?',
        explain: fs + ' = ' + n + ' ÷ ' + d + ' = <span class="num">' + fd(a) + '</span>.',
        hint: 'The bar means divide: do ' + n + ' ÷ ' + d + ' — or stack landmarks: every 16th is 0.0625, every 8th is 0.125.',
        steps: '1 · ' + fs + ' means <span class="num">' + n + '</span> ÷ <span class="num">' + d + '</span><br>' +
          '2 · = <span class="res">' + fd(a) + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - d / n) < 0.011 && Math.abs(d / n - a) > 0.02) return { label: 'Inverted the division',
            your: d + ' ÷ ' + n + ' ≈ ' + fd(d / n) + ' is bigger than 1 — but ' + fs + ' is a piece of ONE inch',
            right: 'top ÷ bottom: ' + n + ' ÷ ' + d + ' = ' + fd(a) };
          if (Math.abs(v - a * 10) < 0.005 || Math.abs(v - a / 10) < 0.0006) return { label: 'Decimal slipped one seat',
            your: fmtExact(v) + ' is the right digits with the point in the wrong seat',
            right: fs + ' = ' + fd(a) };
          return { label: 'Division slip',
            your: fmtExact(v) + ' is not ' + n + ' ÷ ' + d,
            right: fs + ' = ' + fd(a) };
        } };
    }
    if (kind === 'whichBigger') {
      var pairs = [[5, '0.3'], [6, '0.4'], [10, '0.6'], [12, '0.7'], [7, '0.45'], [9, '0.56'], [3, '0.19'], [11, '0.69']];
      var p = pick(pairs);
      var n2 = p[0], fs2 = fr(n2, 16), fv = n2 * LMD, dvs = p[1], dv = parseFloat(dvs);
      var bigger = fv > dv ? 0 : 1;
      var win = bigger === 0 ? fs2 : dvs;
      return { type: 'mc', a: bigger, choices: [fs2, dvs], from: 'Level 6',
        q: 'Which is larger: <span class="num">' + fs2 + '</span> or <span class="num">' + dvs + '</span>?',
        explain: fs2 + ' = ' + fv.toFixed(4) + ' vs ' + dv.toFixed(4) + ' → <span class="num">' + win + '</span>.',
        hint: 'Turn the fraction into its decimal first (top ÷ bottom), pad both to the same places, then compare seat by seat.',
        steps: '1 · ' + fs2 + ' = <span class="num">' + fd(fv) + '</span><br>' +
          '2 · Pad: ' + fv.toFixed(4) + ' vs ' + dv.toFixed(4) + '<br>' +
          '3 · <span class="res">' + win + '</span> is larger',
        diagnose: function () {
          return { label: 'Compared the writing, not the value',
            your: 'symbols side by side fool the eye until both speak decimal',
            right: fv.toFixed(4) + ' vs ' + dv.toFixed(4) + ' → ' + win };
        } };
    }
    var units = [['1/2', 0.5, 2], ['1/4', 0.25, 4], ['1/8', 0.125, 8], ['1/16', 0.0625, 16]];
    var idx = shuffle([0, 1, 2, 3]).slice(0, 2).sort();
    var t1 = units[idx[0]], t2 = units[idx[1]];
    var a3 = t1[1] + t2[1];
    var tb = 2 / (t1[2] + t2[2]);
    return { type: 'num', a: a3, tol: 0.0005, from: 'Level 6',
      q: 'Stack the landmarks: <span class="num">' + t1[0] + '</span> + <span class="num">' + t2[0] + '</span> = ? (answer as a decimal)',
      explain: t1[0] + ' + ' + t2[0] + ' = ' + fd(t1[1]) + ' + ' + fd(t2[1]) + ' = <span class="num">' + fd(a3) + '</span>.',
      hint: 'Turn each landmark into its decimal first (1/2 = .500, 1/4 = .250, 1/8 = .125, 1/16 = .0625), then add the decimals.',
      steps: '1 · ' + t1[0] + ' = ' + fd(t1[1]) + ' · ' + t2[0] + ' = ' + fd(t2[1]) + '<br>' +
        '2 · Add: <span class="res">' + fd(a3) + '</span>',
      diagnose: function (v) {
        if (Math.abs(v - tb) < 0.006) return { label: 'Added tops and bottoms',
          your: '2/' + (t1[2] + t2[2]) + ' ≈ ' + fmtExact(Math.round(tb * 1000) / 1000) + ' — different-sized pieces don\'t add by counts',
          right: fd(t1[1]) + ' + ' + fd(t2[1]) + ' = ' + fd(a3) };
        if (Math.abs(v - a3 * 10) < 0.005 || Math.abs(v - a3 / 10) < 0.0006) return { label: 'Decimal slipped one seat',
          your: fmtExact(v) + ' has the point in the wrong seat',
          right: fd(a3) };
        return { label: 'Stack slip',
          your: fmtExact(v) + ' is not the sum of those two landmark decimals',
          right: fd(t1[1]) + ' + ' + fd(t2[1]) + ' = ' + fd(a3) };
      } };
  };
  BANKS.l7 = function () {
    function rnd(n) { return Math.floor(Math.random() * n); }
    function ri(lo, hi) { return lo + rnd(hi - lo + 1); }
    function nf(v) { return fmtExact(v).replace('-', '−'); }
    function sg(v) { return (v < 0 ? '−' : '+') + fmtExact(Math.abs(v)); }
    var kind = pick(['slide', 'slide', 'subNeg', 'compare']);
    if (kind === 'slide') {
      var s = 0, m = 0, t;
      for (t = 0; t < 50; t++) {
        s = ri(-8, 8); m = ri(-9, 9);
        if (m !== 0 && Math.abs(s + m) <= 10) break;
      }
      var a = s + m;
      return { type: 'num', a: a, tol: 0.4, from: 'Level 7',
        q: 'The hook sits at <span class="num">' + nf(s) + '</span>. The crane moves <span class="num">' + sg(m) +
          '</span>. Where does the hook land?',
        explain: 'A ' + (m < 0 ? 'minus' : 'plus') + ' move slides ' + (m < 0 ? 'DOWN' : 'UP') + ' ' + Math.abs(m) +
          ': ' + nf(s) + (m < 0 ? ' − ' : ' + ') + Math.abs(m) + ' = <span class="num">' + nf(a) + '</span>.',
        hint: 'The sign on the move is a direction: plus slides UP the line, minus slides DOWN. Zero is just another stop on the way, not a wall.',
        steps: '1 · Start at <span class="num">' + nf(s) + '</span><br>' +
          '2 · Slide ' + (m < 0 ? 'DOWN' : 'UP') + ' <span class="num">' + Math.abs(m) + '</span><br>' +
          '3 · Land: <span class="res">' + nf(a) + '</span>',
        diagnose: function (v) {
          if (a !== 0 && Math.abs(v + a) <= 0.4) return { label: 'Dropped the sign',
            your: 'right distance from zero, wrong side of it',
            right: 'the slide ends ' + (a < 0 ? 'BELOW' : 'ABOVE') + ' zero: ' + nf(a) };
          if (Math.abs(v - (s - m)) <= 0.4 && s - m !== a) return { label: 'Moved the wrong way',
            your: nf(v) + ' is start MINUS move — the sign said go ' + (m < 0 ? 'down' : 'up'),
            right: nf(s) + (m < 0 ? ' − ' : ' + ') + Math.abs(m) + ' = ' + nf(a) };
          return { label: 'Lost on the line',
            your: nf(v) + ' is not where the slide ends',
            right: nf(s) + (m < 0 ? ' − ' : ' + ') + Math.abs(m) + ' = ' + nf(a) };
        } };
    }
    if (kind === 'subNeg') {
      var s2 = ri(1, 9), b = ri(1, 9);
      var a2 = s2 + b;
      return { type: 'num', a: a2, tol: 0.4, from: 'Level 7',
        q: '<span class="num">' + s2 + '</span> − (<span class="num">−' + b + '</span>) = ?',
        explain: 'Subtracting a negative removes a debt — you end up UP: ' + s2 + ' + ' + b +
          ' = <span class="num">' + a2 + '</span>.',
        hint: 'Minus a minus flips the direction twice. Taking a debt AWAY leaves you better off — this move goes UP the line.',
        steps: '1 · The thing subtracted is <span class="num">−' + b + '</span> — on its own, a slide DOWN<br>' +
          '2 · SUBTRACTING it flips it: go UP ' + b + '<br>' +
          '3 · ' + s2 + ' + ' + b + ' = <span class="res">' + a2 + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - (s2 - b)) <= 0.4) return { label: 'Subtracted straight through the minus',
            your: s2 + ' − ' + b + ' = ' + (s2 - b) + ' — but the thing being removed is NEGATIVE ' + b,
            right: 'minus a minus goes UP: ' + s2 + ' + ' + b + ' = ' + a2 };
          return { label: 'The flip got lost',
            your: fmtExact(v) + ' is not ' + s2 + ' with a −' + b + ' removed',
            right: 'subtracting a negative ADDS: ' + s2 + ' + ' + b + ' = ' + a2 };
        } };
    }
    var pairs = [[-7, -2], [-9, -4], [-1, -8], [2, -7], [-3, -5], [0, -6], [-2, -10], [1, -9]];
    var p = pick(pairs);
    var win = p[0] > p[1] ? 0 : 1;
    var wv = p[win], lv = p[1 - win];
    return { type: 'mc', a: win, choices: [nf(p[0]), nf(p[1])], from: 'Level 7',
      q: 'Which is the <b>larger</b> number — the one further UP the line?',
      explain: nf(wv) + ' sits ABOVE ' + nf(lv) + ' on the line — further below zero is always smaller.',
      hint: 'Put both on the line. Larger means further UP, closer to the plus side. Compare positions, not digit sizes.',
      steps: '1 · <span class="num">' + nf(wv) + '</span> sits higher than <span class="num">' + nf(lv) + '</span><br>' +
        '2 · Higher = larger → <span class="res">' + nf(wv) + '</span>',
      diagnose: function () {
        return { label: 'Magnitude trap',
          your: nf(lv) + ' LOOKS bigger because its digits are — but every one of those steps goes downward',
          right: 'position beats size: ' + nf(wv) + ' is larger' };
      } };
  };
  BANKS.l8 = function () {
    function r2(v) { return Math.round(v * 100) / 100; }
    function nf(v) { return fmtExact(v); }
    var kind = pick(['pctOf', 'pctOf', 'pct2dec', 'ratioScale']);
    if (kind === 'pctOf') {
      var pct = pick([10, 20, 25, 50, 75, 5, 15]);
      var base = pick([20, 30, 40, 60, 80, 120, 200]);
      var a = r2(base * pct / 100);
      var dec = pct / 100;
      return { type: 'num', a: a, tol: 0.005, from: 'Level 8',
        q: 'What is <span class="num">' + pct + '%</span> of <span class="num">' + base + '</span>?',
        explain: pct + '% = ' + nf(dec) + ', and "of" means multiply: ' + nf(dec) + ' × ' + base +
          ' = <span class="num">' + nf(a) + '</span>.',
        hint: 'Slide the percent two seats left to make it a plain number, then multiply. Or the shortcut: 10% of ' +
          base + ' is ' + nf(base / 10) + ' — build from there.',
        steps: '1 · ' + pct + '% = <span class="num">' + nf(dec) + '</span> (two seats left)<br>' +
          '2 · ' + nf(dec) + ' × ' + base + ' = <span class="res">' + nf(a) + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - base * pct) < Math.max(0.5, base * pct * 0.001)) return { label: 'The percent went in raw',
            your: pct + ' × ' + base + ' = ' + nf(base * pct) + ' — the two-seat slide never happened',
            right: pct + '% = ' + nf(dec) + ' → ' + nf(a) };
          if (Math.abs(v - a * 10) < 0.05) return { label: 'Slid one seat, not two',
            your: 'per-CENT is per hundred — one slide only divides by ten',
            right: nf(dec) + ' × ' + base + ' = ' + nf(a) };
          return { label: 'Percent slip',
            your: nf(v) + ' is not ' + pct + ' hundredths of ' + base,
            right: nf(dec) + ' × ' + base + ' = ' + nf(a) };
        } };
    }
    if (kind === 'pct2dec') {
      var p2 = pick([25, 50, 7, 45, 90, 5, 150, 12.5]);
      var a2 = r2(p2 / 100);
      return { type: 'num', a: a2, tol: 0.0005, from: 'Level 8',
        q: 'Write <span class="num">' + nf(p2) + '%</span> as a plain number (a decimal).',
        explain: nf(p2) + '% = ' + nf(p2) + ' ÷ 100 = <span class="num">' + nf(a2) + '</span>.',
        hint: 'Percent means ÷ 100 — slide the point two seats LEFT. Percents under 10 need a leading zero (7% → 0.07).',
        steps: '1 · ' + nf(p2) + '% = ' + nf(p2) + ' per hundred<br>' +
          '2 · Two seats left: <span class="res">' + nf(a2) + '</span>',
        diagnose: function (v) {
          if (Math.abs(v - p2 / 10) < 0.0005) return { label: 'Slid one seat, not two',
            your: nf(p2 / 10) + ' only divides by ten — percent divides by a hundred',
            right: nf(p2) + ' ÷ 100 = ' + nf(a2) };
          if (Math.abs(v - p2) < 0.0005) return { label: 'No slide at all',
            your: nf(p2) + ' is still wearing its % sign',
            right: nf(p2) + '% = ' + nf(a2) };
          return { label: 'Slide slip',
            your: nf(v) + ' is not ' + nf(p2) + ' ÷ 100',
            right: nf(a2) };
        } };
    }
    var ratios = [[3, 2], [2, 1], [4, 3], [5, 2], [3, 1]];
    var r = pick(ratios);
    var sc = pick([2, 3, 4, 5]);
    var A = r[0] * sc, B = r[1] * sc;
    return { type: 'num', a: B, tol: 0.005, from: 'Level 8',
      q: 'A <span class="num">' + r[0] + ' : ' + r[1] + '</span> mix gets scaled up until the left side is ' +
        '<span class="num">' + A + '</span>. What does the right side become?',
      explain: 'The multiplier is ' + A + ' ÷ ' + r[0] + ' = ' + sc + '. Both sides ride it: ' + r[1] + ' × ' + sc +
        ' = <span class="num">' + B + '</span>.',
      hint: 'Find the multiplier first: what × ' + r[0] + ' = ' + A + '? The right side takes the exact same ride.',
      steps: '1 · multiplier = ' + A + ' ÷ ' + r[0] + ' = <span class="num">' + sc + '</span><br>' +
        '2 · ' + r[1] + ' × ' + sc + ' = <span class="res">' + B + '</span>',
      diagnose: function (v) {
        if (Math.abs(v - r[1]) < 0.005) return { label: 'Scaled only one side',
          your: 'the right side stayed ' + r[1] + ' while the left grew — a different recipe now',
          right: 'both sides × ' + sc + ': ' + r[1] + ' × ' + sc + ' = ' + B };
        if (Math.abs(v - A) < 0.005 && A !== B) return { label: 'Copied the left side',
          your: A + ' : ' + A + ' is a 1:1 mix — the recipe was ' + r[0] + ':' + r[1],
          right: r[1] + ' × ' + sc + ' = ' + B };
        return { label: 'Recipe slip',
          your: nf(v) + ' breaks the ' + r[0] + ':' + r[1] + ' proportion',
          right: r[1] + ' × ' + sc + ' = ' + B };
      } };
  };

  BANKS.l24 = function () {
    var LINES = [
      ['a thick solid line outlining a shape', 'a visible edge you can see from this side'],
      ['a medium dashed line running through a view', 'a hidden edge behind the surface'],
      ['a thin long-short-long line through a hole\'s middle', 'a centerline, the hole\'s axis'],
      ['a thin line with arrowheads and a number in its gap', 'a dimension, the size of something']];
    var kind = pick(['whichLine', 'scaleReal', 'scaleReal']);
    if (kind === 'whichLine') {
      var li = Math.floor(Math.random() * LINES.length);
      var choices = [LINES[li][1]];
      for (var k = 0; k < LINES.length; k++) if (k !== li) choices.push(LINES[k][1]);
      return { type: 'mc', a: 0, choices: choices, from: 'Level 24',
        q: 'On a print you see <b>' + LINES[li][0] + '</b>. What is it telling you?',
        explain: LINES[li][0] + ' = <span class="num">' + LINES[li][1] + '</span>.',
        hint: 'Thick solid = edges you see, dashed = edges you cannot, long-short-long = centerlines, thin with arrows = measurement talk.',
        steps: LINES.map(function (x, i) {
          return (i === li ? '<span class="res">' : '<span class="num">') + x[0] + ' → ' + x[1] + '</span>';
        }).join('<br>'),
        diagnose: function () {
          return { label: 'Lines mixed up',
            your: 'that meaning belongs to a different line style',
            right: LINES[li][0] + ' → ' + LINES[li][1] };
        } };
    }
    var scales = [[2, 1], [1, 2], [4, 1]];
    var sc = pick(scales);
    var paper = pick([0.5, 1.0, 1.5, 2.0, 3.0]);
    var a2 = Math.round(paper * sc[1] / sc[0] * 1000) / 1000;
    var scs = sc[0] + ':' + sc[1];
    var wrong = Math.round(paper * sc[0] / sc[1] * 1000) / 1000;
    return { type: 'num', a: a2, tol: 0.005, from: 'Level 24',
      q: 'The title block says <span class="num">SCALE ' + scs + '</span>. A feature measures <span class="num">' +
        fmtExact(paper) + '"</span> on the paper. How big is the <b>real</b> feature?',
      explain: 'SCALE ' + scs + ' is paper:real → ' + fmtExact(paper) + ' × ' + sc[1] + ' ÷ ' + sc[0] +
        ' = <span class="num">' + fmtExact(a2) + '"</span>.',
      hint: 'Read the ratio as paper:real — real = paper × ' + sc[1] + ' ÷ ' + sc[0] + '. (And on a real print, the WRITTEN number still beats any ruler.)',
      steps: '1 · real = paper × ' + sc[1] + ' ÷ ' + sc[0] + '<br>' +
        '2 · ' + fmtExact(paper) + ' × ' + sc[1] + ' ÷ ' + sc[0] + ' = <span class="res">' + fmtExact(a2) + '"</span>',
      diagnose: function (v) {
        if (Math.abs(v - wrong) < 0.005 && Math.abs(wrong - a2) > 0.01) return { label: 'Read the ratio backwards',
          your: fmtExact(wrong) + ' flips paper and real',
          right: fmtExact(paper) + ' × ' + sc[1] + ' ÷ ' + sc[0] + ' = ' + fmtExact(a2) };
        if (Math.abs(v - paper) < 0.005 && Math.abs(paper - a2) > 0.01) return { label: 'Trusted the paper',
          your: 'that is the paper size — the scale changes it',
          right: fmtExact(a2) };
        return { label: 'Scale slip', your: fmtExact(v) + ' is not paper × ' + sc[1] + ' ÷ ' + sc[0], right: fmtExact(a2) };
      } };
  };

  function daily10Questions() {
    var eligible = LEVELS.filter(function (l) { return l.built && rec(l.id).passed && BANKS[l.id]; });
    if (!eligible.length) {
      eligible = LEVELS.filter(function (l) { return l.built && isUnlocked(l.id) && BANKS[l.id]; });
    }
    if (!eligible.length) return [];
    var qs = [];
    for (var k = 0; k < 10; k++) {
      var l = eligible[k % eligible.length];
      var q = BANKS[l.id]();
      q.levelId = l.id;
      qs.push(q);
    }
    return shuffle(qs);
  }

  /* ---------------- level page chrome ---------------- */
  function levelPage(id, parts) {
    var lvl = LEVELS[levelIndex(id)];
    var root = document.getElementById('sms-root');
    var TABS = [['1', 'EXPLAINER'], ['2', 'PLAYGROUND'], ['3', 'GAME'], ['4', 'BOSS']];
    root.innerHTML =
      '<div class="tabs">' + TABS.map(function (t, k) {
        return '<button data-tab="' + k + '" class="' + (k === 0 ? 'on' : '') + '">' +
          '<span class="step-n">PART ' + t[0] + '</span>' + t[1] + '</button>';
      }).join('') + '</div>' +
      '<div id="tab-panes"></div>';
    var panes = root.querySelector('#tab-panes');
    var current = -1;

    function open(k) {
      if (k === current) return;
      current = k;
      root.querySelectorAll('.tabs button').forEach(function (b, j) {
        b.classList.toggle('on', j === k);
      });
      panes.innerHTML = '';
      if (k === 0) { panes.innerHTML = parts.explainer; }
      if (k === 1) { parts.playground(panes); }
      if (k === 2) {
        var c = document.createElement('div');
        c.className = 'card';
        c.innerHTML = '<h2>Game — 10 rounds · points and streaks · mistakes get named</h2><div class="body"></div>';
        panes.appendChild(c);
        runGame(c.querySelector('.body'), {
          mode: 'game', title: 'GAME', levelId: id, questions: parts.gameQs(),
        });
      }
      if (k === 3) {
        var c2 = document.createElement('div');
        c2.className = 'card';
        c2.innerHTML = '<h2>Boss round — 90% unlocks the next level · no hints, no retries</h2><div class="body"></div>';
        panes.appendChild(c2);
        runGame(c2.querySelector('.body'), {
          mode: 'boss', title: 'BOSS', questions: parts.bossQs(), passPct: 90,
          onFinish: function (pct) {
            recordBoss(id, pct);
            var r = rec(id);
            var next = LEVELS[levelIndex(id) + 1];
            var extra = document.createElement('div');
            extra.className = 'callout' + (pct >= 90 ? '' : ' warn');
            extra.innerHTML = pct >= 90
              ? '<b>Level ' + lvl.n + ' beaten.</b> ' +
                (next ? (next.built ? 'Level ' + next.n + ' — ' + esc(next.title) + ' — is unlocked on the skill tree.'
                                    : 'Level ' + next.n + ' is unlocked. It gets built next — go say the word.')
                      : 'That was the last level. Toolmaker.') +
                ' Best: ' + r.best + '%. <a href="../index.html">Back to the skill tree →</a>'
              : 'Best so far: ' + r.best + '%. Scores only go up — replay the game, then hit the boss again. ' +
                '<a href="../index.html">Skill tree →</a>';
            c2.querySelector('.body').appendChild(extra);
          },
        });
      }
    }
    root.querySelectorAll('.tabs button').forEach(function (b) {
      b.addEventListener('click', function () { open(Number(b.dataset.tab)); });
    });
    open(0);
    return { open: open };
  }

  /* ---------------- export ---------------- */
  window.SMS = {
    WORLDS: WORLDS, LEVELS: LEVELS, RANKS: RANKS, BANKS: BANKS,
    state: state, save: save, rec: rec,
    durable: durable, exportCode: exportCode, importCode: importCode,
    recordBoss: recordBoss, recordGame: recordGame, nudge: nudge,
    isUnlocked: isUnlocked, gateFor: gateFor, worldComplete: worldComplete, rankInfo: rankInfo,
    fmt: fmt, fmtExact: fmtExact, parseNum: parseNum,
    shuffle: shuffle, pick: pick, esc: esc,
    intWords: intWords, placeWords: placeWords,
    dro: dro, runGame: runGame, daily10Questions: daily10Questions,
    levelPage: levelPage,
  };
})();
