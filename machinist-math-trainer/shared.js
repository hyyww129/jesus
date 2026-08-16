/* Machinist Math Trainer — shared helpers. Plain script, no modules, works from file://.
   Everything hangs off window.MMT.

   State lives in window.name: it survives page-to-page navigation in this tab but
   vanishes when the tab closes. Nothing is ever written to disk — scores are
   memory-only, as specified. */
(function () {
  "use strict";

  /* ---------------- module registry ---------------- */
  var MODULES = [
    { id: 'm1',  n: 1,  title: 'Reading a Ruler & Thousandths', file: 'modules/m01-ruler.html', built: true,
      desc: 'Fractions to decimals. What a thou (.001) and a tenth (.0001) really are.' },
    { id: 'm2',  n: 2,  title: 'The Number Line & Signed Moves', file: 'modules/m02-number-line.html', built: true,
      desc: 'Negative vs positive, and adding signed moves without guessing.' },
    { id: 'm3',  n: 3,  title: 'X, Y, Z Coordinates', file: 'modules/m03-coordinates.html', built: true,
      desc: 'The machine as graph paper. Part zero, absolute vs incremental.' },
    { id: 'm4',  n: 4,  title: 'The Edge Finder & Zero Offsets', file: 'modules/m04-edge-finder.html', built: true,
      desc: 'The 0.200 tip / 0.100 rule, sign by approach side, zero at center.' },
    { id: 'm5',  n: 5,  title: 'RPM from Cutting Speed', file: 'modules/m05-rpm.html', built: true,
      desc: 'RPM = SFM × 3.82 ÷ diameter — and why. Capped at 4200.' },
    { id: 'm6',  n: 6,  title: 'Feed Rate', file: 'modules/m06-feed.html', built: true,
      desc: 'IPM = RPM × flutes × chip load, with starter chip-load tables.' },
    { id: 'm7',  n: 7,  title: 'Depth, Peck & Passes', file: 'modules/m07-depth.html', built: true,
      desc: 'Splitting depth into passes, peck rules, pocket stepover.' },
    { id: 'm8',  n: 8,  title: 'Bolt-Hole Circle Trig', file: 'modules/m08-bolt-circle.html', built: false,
      desc: 'N holes on a circle with cos and sin doing the placing.' },
    { id: 'm9',  n: 9,  title: 'Right-Triangle Trig for Angles', file: 'modules/m09-triangles.html', built: false,
      desc: 'SOH-CAH-TOA: angle + distance into X and Y components.' },
    { id: 'm10', n: 10, title: 'Tolerances & Measurement', file: 'modules/m10-tolerance.html', built: false,
      desc: 'Calipers, mics, ±0.005, and which way to move the offset.' },
  ];

  /* machine truths for later modules — same numbers as the DPM3 trainer */
  var FACTS = {
    rpmMax: 4200,
    edgeFinderTip: 0.200, edgeFinderOffset: 0.100,
    sfm: { aluminumHSS: 250, aluminumCarbide: 600, steelHSS: 90, steelCarbide: 350 },
    chipload: { '0.125': 0.0008, '0.1875': 0.0012, '0.25': 0.0015, '0.375': 0.002, '0.5': 0.003, '0.75': 0.004 },
  };

  /* ---------------- state (window.name) ---------------- */
  function loadState() {
    try {
      var s = JSON.parse(window.name || '');
      if (s && s.__mmt === 1 && s.scores) return s;
    } catch (e) { /* fresh tab */ }
    return { __mmt: 1, scores: {} };
  }
  var state = loadState();
  function save() { window.name = JSON.stringify(state); }
  function rec(id) {
    if (!state.scores[id]) state.scores[id] = { best: 0, passed: false, confidence: 0, attempts: 0 };
    return state.scores[id];
  }
  function recordQuiz(id, pct) {
    var r = rec(id);
    r.attempts++;
    if (pct > r.best) r.best = pct;
    if (pct >= 90) r.passed = true;
    /* confidence starts as your best quiz score; Daily 10 nudges it after that */
    if (r.best > r.confidence) r.confidence = r.best;
    save();
  }
  function nudge(id, ok) {  /* Daily 10 spaced review: right +1, wrong −2 */
    var r = rec(id);
    if (r.attempts > 0 || r.confidence > 0) {
      r.confidence = Math.max(0, Math.min(100, r.confidence + (ok ? 1 : -2)));
      save();
    }
  }
  function moduleIndex(id) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return i; return -1; }
  function isUnlocked(id) {
    var i = moduleIndex(id);
    if (i <= 0) return true;
    return rec(MODULES[i - 1].id).passed;
  }

  /* ---------------- formatting ---------------- */
  function fmt(v, places) { return Number(v).toFixed(places === undefined ? 4 : places); }
  /* exact decimal for n/64ths etc: at least `min` places, no trailing-zero noise beyond it */
  function fmtExact(v, min) {
    min = min === undefined ? 4 : min;
    var s = Number(v).toFixed(6);
    while (s.length > 0 && s.indexOf('.') !== -1 && /0$/.test(s) &&
           s.length - s.indexOf('.') - 1 > min) s = s.slice(0, -1);
    return s;
  }
  function signed(v, places) { return (v >= 0 ? '+' : '') + fmt(v, places); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function reduceFrac(n, d) { var g = gcd(n, d); return [n / g, d / g]; }
  function fracStr(n, d) { var r = reduceFrac(n, d); return r[0] + '/' + r[1]; }
  function parseNum(raw) {
    if (raw === undefined || raw === null) return NaN;
    raw = String(raw).trim().replace(/["\s,]/g, '').replace(/−/g, '-');
    if (raw === '') return NaN;
    /* accept fractions like 3/8 too */
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

  /* ---------------- voice: how a machinist SAYS a number ----------------
     speakText uses the browser's built-in speech (no network, no accounts).
     Two reading styles, used deliberately:
       literal — digit by digit ("zero point zero zero zero five"), safe for
                 reading questions aloud because it never reveals the answer;
       shop    — how it's said on the floor ("five tenths", "three hundred
                 seventy-five thou"), shown AFTER answering and in playgrounds. */
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
  function digitWords(str) {
    var map = { '0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five',
      '6':'six','7':'seven','8':'eight','9':'nine','.':'point','-':'minus','−':'minus' };
    return String(str).split('').map(function (c) { return map[c] || ''; })
      .filter(Boolean).join(' ');
  }
  /* shop-style words for an inch measurement */
  function sayMeasure(v, asTyped) {
    v = Number(v);
    var neg = v < 0, av = Math.abs(v);
    var inches = Math.floor(av + 1e-9);
    var frac = Math.round((av - inches) * 1e6) / 1e6;
    var shop;
    if (frac === 0) {
      shop = intWords(inches) + (inches === 1 ? ' inch' : ' inches');
    } else {
      var tenthsInt = Math.round(frac * 10000);
      var isTenthExact = Math.abs(frac * 10000 - tenthsInt) < 1e-4;
      var fracWords;
      if (!isTenthExact) {
        /* finer than tenths (e.g. 1/64 = 15.625 thou): decimal thou */
        var thouStr = String(Math.round(frac * 1e6) / 1000);
        var parts = thouStr.split('.');
        fracWords = intWords(+parts[0]) + (parts[1] ? ' point ' + digitWords(parts[1]) : '') + ' thou';
      } else if (tenthsInt % 10 === 0) {
        fracWords = intWords(tenthsInt / 10) + ' thou';
      } else if (tenthsInt < 10) {
        fracWords = intWords(tenthsInt) + (tenthsInt === 1 ? ' tenth' : ' tenths');
      } else if (tenthsInt % 10 === 5) {
        fracWords = intWords(Math.floor(tenthsInt / 10)) + ' and a half thou';
      } else {
        var r = tenthsInt % 10;
        fracWords = intWords(Math.floor(tenthsInt / 10)) + ' thou and ' + intWords(r) + (r === 1 ? ' tenth' : ' tenths');
      }
      shop = inches > 0
        ? intWords(inches) + (inches === 1 ? ' inch' : ' inches') + ' and ' + fracWords
        : fracWords;
    }
    if (neg) shop = 'minus ' + shop;
    var literal = digitWords(asTyped !== undefined ? asTyped : (av < 1 ? v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '.0') : String(v)));
    return { shop: shop, literal: literal };
  }
  function sayFraction(n, d) {
    var names = { 2:'half',4:'quarter',8:'eighth',16:'sixteenth',32:'thirty-second',64:'sixty-fourth' };
    var w = names[d];
    if (!w) return intWords(n) + ' over ' + intWords(d);
    if (n === 1) return 'one ' + w;
    return intWords(n) + ' ' + (d === 2 ? 'halves' : w + 's');
  }
  /* read a question's HTML aloud — numbers spoken LITERALLY so nothing leaks */
  function spokenFromHtml(html) {
    var s = String(html).replace(/<[^>]*>/g, ' ').replace(/&\w+;/g, ' ');
    s = s.replace(/(\d+)\s*\/\s*(\d+)/g, function (m, a, b) { return sayFraction(+a, +b); });
    s = s.replace(/(\d*\.\d+)\s*(?:")?/g, function (m, d) { return digitWords(d) + ' inches, '; });
    s = s.replace(/(\d+)"/g, function (m, d) { return intWords(+d) + ' inches'; });
    return s.replace(/\s+/g, ' ').trim();
  }
  /* how to SAY the correct answer, shop-style (shown after answering) */
  function sayAnswer(q) {
    if (q.type === 'mc') {
      var c = String(q.choices[q.a]).replace(/<[^>]*>/g, '').replace(/"/g, '').trim();
      var m = c.match(/^(\d+)\/(\d+)$/);
      if (m) return sayFraction(+m[1], +m[2]);
      var d = parseFloat(c);
      if (!isNaN(d)) return sayMeasure(d, c).shop;
      return null;
    }
    if (q.unit === 'thou') return intWords(Math.round(q.a)) + ' thou';
    if (q.unit === 'tenths') return intWords(Math.round(q.a)) + (Math.round(q.a) === 1 ? ' tenth' : ' tenths');
    if (q.unit && q.unit !== 'in') {
      /* non-inch units from the later modules: RPM, feed, angles, counts */
      var UNIT_WORDS = { rpm: 'R P M', ipm: 'inches a minute', deg: 'degrees' };
      var uw = UNIT_WORDS[q.unit] || q.unit;
      var n = Math.round(q.a * 1000) / 1000;
      var whole = Math.trunc(Math.abs(n)), fracPart = String(Math.abs(n)).split('.')[1];
      var spoken = intWords(whole) + (fracPart ? ' point ' + digitWords(fracPart) : '');
      return (n < 0 ? 'minus ' : '') + spoken + ' ' + uw;
    }
    var s = sayMeasure(q.a);
    return s.shop + ' — read off the DRO as ' + s.literal;
  }
  function speakText(t) {
    try {
      if (!window.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(t);
      u.rate = 0.92;
      var vs = speechSynthesis.getVoices();
      var v = null;
      for (var k = 0; k < vs.length; k++) {
        if (/en[-_]US/i.test(vs[k].lang)) { v = vs[k]; break; }
        if (!v && /^en/i.test(vs[k].lang)) v = vs[k];
      }
      if (v) u.voice = v;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { /* no speech on this device — buttons just do nothing */ }
  }

  /* ---------------- DRO panel ---------------- */
  /* dro(el, axisLabel) -> {set(valueString, meaningHTML)} */
  function dro(el, axisLabel) {
    el.classList.add('dro');
    el.innerHTML = '<div class="row"><span class="ax">' + esc(axisLabel || '') +
      '</span><span class="val">—</span></div><div class="meaning"></div>';
    var val = el.querySelector('.val'), meaning = el.querySelector('.meaning');
    return {
      set: function (valueString, meaningHTML) {
        val.textContent = valueString;
        meaning.innerHTML = meaningHTML || '';
      },
    };
  }

  /* ---------------- quiz / practice engine ----------------
     runSet(container, opts):
       opts.mode      'quiz' (scored, pass/fail) or 'practice' (diagnostic, relaxed)
       opts.questions [{q, type:'num'|'mc', a, tol, choices, explain, diagnose(v), unit, from}]
                      For 'mc', a = index into choices (pre-shuffle).
       opts.title     heading text
       opts.passPct   default 90 (quiz only)
       opts.onFinish  function(pct, results)
       opts.onAnswer  function(question, ok)  — fires per answer (Daily 10 nudging)
  */
  function runSet(container, opts) {
    var qs = opts.questions.map(function (q) {
      if (q.type === 'mc') {
        var order = shuffle(q.choices.map(function (_, i) { return i; }));
        return Object.assign({}, q, { order: order });
      }
      return q;
    });
    var i = 0, correct = 0, results = [];
    var isQuiz = opts.mode === 'quiz';
    var passPct = opts.passPct === undefined ? 90 : opts.passPct;

    function render() {
      if (i >= qs.length) return renderEnd();
      var q = qs[i];
      var h = '<div class="q-progress">' + esc(opts.title || (isQuiz ? 'QUIZ' : 'PRACTICE')) +
        ' — QUESTION ' + (i + 1) + ' / ' + qs.length +
        (isQuiz ? '' : ' · running: ' + correct + ' right') +
        (q.from ? ' · from ' + esc(q.from) : '') + '</div>' +
        '<div class="q-text">' + q.q + ' <button class="say" data-read aria-label="read the question aloud">🔊 READ IT</button></div>';
      if (q.type === 'mc') {
        h += '<div class="choices">' + q.order.map(function (ci, k) {
          return '<button data-k="' + k + '">' + String.fromCharCode(65 + k) + ' · ' + q.choices[ci] + '</button>';
        }).join('') + '</div>';
      } else {
        h += '<div class="answer-row"><input type="text" inputmode="decimal" autocomplete="off" ' +
          'placeholder="' + esc(q.unit ? 'answer in ' + q.unit : 'type your answer') + '" aria-label="answer">' +
          '<button class="primary" data-go>CHECK</button></div>';
      }
      /* practice-only help: a where-do-I-start hint and a full walkthrough.
         The quiz stays help-free — that's what practice is for. */
      if (!isQuiz) {
        h += '<div class="btnrow help-row" style="margin-top:10px">' +
          (q.hint ? '<button data-hint>💡 WHERE DO I START?</button>' : '') +
          '<button data-walk>WALK ME THROUGH IT</button></div>' +
          '<div class="hint-slot"></div>';
      }
      h += '<div class="fb-slot"></div>';
      container.innerHTML = h;
      if (q.type === 'mc') {
        container.querySelectorAll('.choices button').forEach(function (b) {
          b.addEventListener('click', function () { answerMC(q, Number(b.dataset.k), b); });
        });
        /* keyboard parity with the numeric input.focus() below — otherwise
           NEXT removes the focused button and keyboard users fall back to <body> */
        container.querySelector('.choices button').focus();
      } else {
        var input = container.querySelector('input');
        var go = function () { answerNum(q, input.value); };
        container.querySelector('[data-go]').addEventListener('click', go);
        input.addEventListener('keydown', function (e) {
          if (e.key !== 'Enter') return;
          /* preventDefault stops the same keystroke's synthesized keypress from
             clicking the NEXT button we focus in showFeedback — without it the
             feedback screen is skipped entirely on keyboard submits */
          e.preventDefault();
          go();
        });
        input.focus();
      }
      var hintBtn = container.querySelector('[data-hint]');
      if (hintBtn) hintBtn.addEventListener('click', function () {
        hintBtn.disabled = true;
        container.querySelector('.hint-slot').innerHTML =
          '<div class="hintbox"><span class="t">WHERE TO START</span>' + q.hint + '</div>';
      });
      var walkBtn = container.querySelector('[data-walk]');
      if (walkBtn) walkBtn.addEventListener('click', function () { walkThrough(q); });
      var readBtn = container.querySelector('[data-read]');
      if (readBtn) readBtn.addEventListener('click', function () {
        /* numbers read digit-by-digit on purpose — hearing "zero point one eight
           seven" teaches how to READ the numeral without handing over the answer */
        speakText(spokenFromHtml(q.q));
      });
      if (opts.onQuestion) opts.onQuestion(q);
    }

    function sayLineHtml(q) {
      var say = sayAnswer(q);
      if (!say) return '';
      return '<span class="sayline">SAY IT LIKE A MACHINIST: <i>&ldquo;' + say + '&rdquo;</i>' +
        ' <button class="say" data-sayans aria-label="hear it spoken">🔊 HEAR IT</button></span>';
    }
    function wireSay(slot, q) {
      var b = slot.querySelector('[data-sayans]');
      if (b) b.addEventListener('click', function () { speakText(sayAnswer(q)); });
    }

    function stepsBlock(q) {
      return q.steps ? '<div class="steps"><span class="t">THE WHOLE PATH</span>' + q.steps + '</div>' : '';
    }
    function diagHtml(diag) {
      if (!diag) return '';
      if (typeof diag === 'string') return '<span class="diag">Your mistake: ' + diag + '</span>';
      return '<span class="diag"><b>' + diag.label + '.</b>' +
        '<span class="pathrow wrong">Where your number probably came from: <span class="path">' + diag.your + '</span></span>' +
        '<span class="pathrow right">The right path: <span class="path">' + diag.right + '</span></span></span>';
    }
    function freeze() {
      container.querySelectorAll('.choices button, .answer-row button, .answer-row input, [data-hint], [data-walk]')
        .forEach(function (el) { el.disabled = true; });
    }
    function nextBtnHtml(extra) {
      return '<div class="btnrow" style="margin-top:12px">' + (extra || '') +
        '<button class="primary" data-next>' + (i + 1 >= qs.length ? 'SEE RESULT' : 'NEXT QUESTION') + '</button></div>';
    }
    function wireNext(slot) {
      slot.querySelector('[data-next]').addEventListener('click', function () { i++; render(); });
      var retry = slot.querySelector('[data-retry]');
      if (retry) retry.addEventListener('click', function () { render(); });
      (retry || slot.querySelector('[data-next]')).focus();
    }

    /* "I don't know where to start" escape hatch: full worked path, honest miss. */
    function walkThrough(q) {
      if (!q._attempted) {
        q._attempted = true;
        results.push({ q: q, ok: false, walked: true });
        if (opts.onAnswer) opts.onAnswer(q, false);
        if (opts.onMiss) opts.onMiss(q, null, null);
      }
      freeze();
      var slot = container.querySelector('.fb-slot');
      slot.innerHTML = '<div class="feedback good"><b>Smart ask — here is the whole path.</b> ' +
        (q.explain || '') + stepsBlock(q) + sayLineHtml(q) +
        '<span class="diag">Counted as a miss in the running score — understanding first, the points come back on the next one.</span></div>' +
        nextBtnHtml();
      wireNext(slot);
      wireSay(slot, q);
    }

    function showFeedback(q, ok, userShown, diag, isRetry) {
      var slot = container.querySelector('.fb-slot');
      var h;
      if (ok) {
        h = '<div class="feedback good">' +
          (isRetry ? '<b>There it is — got it on the retry.</b> The first attempt is what counted for the score; the method is what you keep. '
                   : '<b>Right.</b> ') +
          (q.explain || '') + sayLineHtml(q) + '</div>' + nextBtnHtml();
      } else {
        var retryBtn = isQuiz ? '' : '<button data-retry>TRY IT AGAIN</button>';
        h = '<div class="feedback bad"><b>Not this time.</b> You answered <span class="num">' + esc(userShown) + '</span>. ' +
          (q.explain || '') + diagHtml(diag) + stepsBlock(q) + sayLineHtml(q) + '</div>' + nextBtnHtml(retryBtn);
      }
      slot.innerHTML = h;
      freeze();
      wireNext(slot);
      wireSay(slot, q);
    }

    /* only the FIRST attempt on a question counts toward the score */
    function finishAnswer(q, ok, userShown, diagText) {
      var first = !q._attempted;
      if (first) {
        q._attempted = true;
        if (ok) correct++;
        results.push({ q: q, ok: ok });
        if (opts.onAnswer) opts.onAnswer(q, ok);
        if (!ok && opts.onMiss) opts.onMiss(q, userShown, diagText);
      }
      showFeedback(q, ok, userShown, diagText, !first);
    }

    function answerMC(q, k, btn) {
      var chosen = q.order[k];
      var ok = chosen === q.a;
      btn.style.background = ok ? 'var(--good-bd)' : 'var(--orange)';
      btn.style.color = '#fff';
      var diag = (!ok && q.diagnose) ? q.diagnose(chosen) : null;
      finishAnswer(q, ok, q.choices[chosen].replace(/<[^>]*>/g, ''), diag);
    }

    function answerNum(q, raw) {
      var v = parseNum(raw);
      if (isNaN(v)) {
        var slot = container.querySelector('.fb-slot');
        slot.innerHTML = '<div class="feedback bad"><b>Type a number.</b> Decimals like 0.375 or fractions like 3/8 both work. Use a leading − for negatives.</div>';
        return;
      }
      var tol = q.tol === undefined ? 0.0005 : q.tol;
      var ok = Math.abs(v - q.a) <= tol;
      var diag = (!ok && q.diagnose) ? q.diagnose(v) : null;
      finishAnswer(q, ok, raw, diag);
    }

    function renderEnd() {
      var pct = Math.round(100 * correct / qs.length);
      var passed = isQuiz && pct >= passPct;
      var h = '<div class="result-banner">' +
        '<div class="big ' + (isQuiz ? (passed ? 'pass' : 'fail') : 'pass') + '">' + correct + ' / ' + qs.length + '</div>';
      if (isQuiz) {
        h += '<p>' + pct + '% — ' + (passed
          ? 'passed. You needed ' + passPct + '% and you got it.'
          : 'you need ' + passPct + '% (' + Math.ceil(passPct / 100 * qs.length) + ' right) to pass this module. Replay the playground, then try again — the questions change every attempt.') + '</p>';
      } else {
        h += '<p>Practice done. Misses below are the ones to sit with — each shows the exact mistake it caught.</p>';
      }
      var misses = results.filter(function (r) { return !r.ok; });
      if (misses.length) {
        h += '<div style="text-align:left">' + misses.map(function (r) {
          return '<div class="feedback bad" style="margin-top:8px"><b>' + (r.walked ? 'Walked through:' : 'Missed:') + '</b> ' + r.q.q +
            '<br>' + (r.q.explain || '') + '</div>';
        }).join('') + '</div>';
      }
      h += '</div>';
      container.innerHTML = h;
      if (opts.onFinish) opts.onFinish(pct, results);
    }

    render();
  }

  /* ---------------- instructor coach panel ----------------
     A built-in coach docked beside practice. Not a live AI — it is instant,
     offline, and knows the current question: it explains, works fresh examples,
     replays your last miss, tracks mistake patterns, and speaks. */
  function coachPanel(el, cfg) {
    cfg = cfg || {};
    var current = null, lastMiss = null, missCounts = {};
    el.classList.add('card', 'coach');
    el.innerHTML = '<h2>Instructor — right beside you</h2><div class="body">' +
      '<div class="coach-log" role="log" aria-live="polite"></div>' +
      '<div class="coach-quick">' +
      '<button data-c="explain">EXPLAIN IT ANOTHER WAY</button>' +
      '<button data-c="example">WORK ONE LIKE IT</button>' +
      '<button data-c="why">WHY WAS I WRONG?</button>' +
      '<button data-c="say">SAY THE ANSWER</button></div>' +
      '<div class="coach-ask"><input type="text" autocomplete="off" placeholder="ask the instructor…" aria-label="ask the instructor">' +
      '<button class="primary" data-c="send">ASK</button></div>' +
      '<div class="coach-live"></div>' +
      '<p class="coach-note">Built-in coach — instant, offline, and it knows this exact question. ' +
      'For a live back-and-forth, ask Claude in the chat this trainer came from.</p>' +
      '</div>';
    var log = el.querySelector('.coach-log');
    function plain(html) { return String(html).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }
    function bot(html, spoken) {
      var d = document.createElement('div');
      d.className = 'msg bot';
      d.innerHTML = html + (spoken ? '<br><button class="say">🔊 HEAR IT</button>' : '');
      if (spoken) d.querySelector('button.say').addEventListener('click', function () { speakText(spoken); });
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    }
    function you(text) {
      var d = document.createElement('div');
      d.className = 'msg you';
      d.textContent = text;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    }
    function doExplain() {
      if (!current) return bot('Load a question first — then I can talk you through it.');
      if (!current.hint) return bot('This one is best learned by swinging — answer it and I will break down whatever happens.');
      bot('The way I would start it: ' + current.hint, plain(current.hint));
      if (current._attempted && current.explain) bot('And since you have already answered: ' + current.explain);
    }
    function doExample() {
      var s = (cfg.regen && current && current.kind) ? cfg.regen(current.kind, current) : null;
      if (!s) return bot('Put a question on the table first — then I will work a twin of it with different numbers.');
      bot('Same idea, different numbers — watch the whole thing:<br><b>' + s.title + '</b>' +
        '<span class="steps">' + s.steps + '</span>', s.spoken || null);
    }
    function doWhy() {
      if (!lastMiss) return bot('No misses yet this set. When one happens I will show you exactly where your number came from.');
      var d = lastMiss.diag;
      var h = 'Your last miss: <b>' + plain(lastMiss.q.q) + '</b><br>';
      if (d && typeof d === 'object') {
        h += '<b>' + d.label + '.</b><br>Your path: <span class="res">' + d.your + '</span>' +
          '<br>Right path: <span class="num">' + d.right + '</span>';
      } else if (typeof d === 'string') {
        h += plain(d);
      } else {
        h += 'You asked to be walked through that one — smart move, not a wrong turn.';
      }
      bot(h);
    }
    function doSay() {
      if (!current) return bot('Nothing on the table yet.');
      if (!current._attempted) return bot('Answer it first — or tap WALK ME THROUGH IT. I don\'t hand over live answers; that\'s the deal that keeps the quiz honest.');
      var a = sayAnswer(current);
      if (a) bot('Out loud, that answer is: <b>&ldquo;' + a + '&rdquo;</b>', a);
      else bot('That one doesn\'t have a spoken form I trust.');
    }
    function route(text) {
      var t = text.toLowerCase();
      if (/why|wrong|mistake|miss/.test(t)) return doWhy();
      if (/example|another one|like it|work one|show me one|demo/.test(t)) return doExample();
      if (/\bsay\b|speak|pronounce|hear|out loud/.test(t)) return doSay();
      if (/hint|start|how|explain|understand|confus|help|stuck|another way|lost/.test(t)) return doExplain();
      bot('I know these moves: <b>explain it another way</b>, <b>work one like it</b>, <b>why was I wrong</b>, and <b>say the answer</b>. Tap a button, or ask in those words. For free-form questions, ask Claude in the chat.');
    }
    el.querySelectorAll('.coach-quick button').forEach(function (b) {
      b.addEventListener('click', function () {
        you(b.textContent.toLowerCase());
        ({ explain: doExplain, example: doExample, why: doWhy, say: doSay })[b.dataset.c]();
      });
    });
    var input = el.querySelector('.coach-ask input');
    function send() {
      var t = input.value.trim();
      if (!t) return;
      input.value = '';
      you(t);
      if (live.key) liveAsk(t);
      else route(t);
    }
    el.querySelector('[data-c="send"]').addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });

    /* ---- live AI instructor: the user's own Anthropic API key, direct from the
       browser. Only possible from a local context (file:// or localhost) — a
       hosted page blocks outside connections, so there we offer the copy bridge.
       The key lives in memory only and dies with the tab. ---- */
    var live = { key: null, model: 'claude-opus-5', chat: [], busy: false };
    var liveEl = el.querySelector('.coach-live');
    var isLocal = location.protocol === 'file:' ||
      location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    var TUTOR = 'You are a patient machinist instructor helping a complete beginner learn shop math for a ' +
      'TRAK DPM3 mill with a ProtoTRAK SMX control. Speak plainly, keep replies to 2-5 short sentences, ' +
      'use shop language (a thou is 0.001", a shop "tenth" is 0.0001"), give numbers in inches. ' +
      'Coach toward understanding; be encouraging without gushing.';

    function plainQ(q) { return q ? plain(q.q).replace(/🔊.*/g, '').trim() : null; }

    function apiCall(key, model, messages, system, maxTok) {
      var headers = {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      };
      var body = { model: model, max_tokens: maxTok || 1024, system: system, messages: messages };
      if (model === 'claude-opus-5') {
        body.output_config = { effort: 'low' };   // snappy tutoring replies
        body.fallbacks = 'default';               // recommended refusal fallback
        headers['anthropic-beta'] = 'server-side-fallback-2026-07-01';
      }
      return fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: headers, body: JSON.stringify(body),
      }).then(function (r) {
        if (r.status === 401) throw new Error('the API key was rejected (401)');
        if (r.status === 429) throw new Error('rate limited (429) — wait a moment and try again');
        if (!r.ok) {
          return r.json().then(
            function (j) { throw new Error((j && j.error && j.error.message) || ('HTTP ' + r.status)); },
            function () { throw new Error('HTTP ' + r.status); }
          );
        }
        return r.json();
      });
    }

    function liveAsk(text) {
      if (live.busy) return;
      live.busy = true;
      var sys = TUTOR;
      if (current) {
        sys += '\n\nThe student is currently on this practice question: "' + plainQ(current) + '".';
        sys += current._attempted
          ? ' They have already attempted it, so full explanations including the answer are fine.'
          : ' They have NOT attempted it yet: coach the method, but do NOT state this question\'s final answer.';
      }
      if (lastMiss && lastMiss.diag && lastMiss.diag.label) {
        sys += '\nTheir most recent mistake: ' + lastMiss.diag.label + ' — their path was ' + plain(lastMiss.diag.your) + '.';
      }
      live.chat.push({ role: 'user', content: text });
      if (live.chat.length > 12) live.chat = live.chat.slice(-12);
      var wait = document.createElement('div');
      wait.className = 'msg bot';
      wait.textContent = '…';
      log.appendChild(wait);
      log.scrollTop = log.scrollHeight;
      apiCall(live.key, live.model, live.chat.slice(), sys)
        .then(function (resp) {
          wait.remove();
          if (resp.stop_reason === 'refusal') {
            live.chat.pop();
            return bot('The AI declined that one. Rephrase it, or lean on the built-in coach.');
          }
          var t = (resp.content || []).filter(function (b) { return b.type === 'text'; })
            .map(function (b) { return b.text; }).join('\n').trim();
          if (!t) { live.chat.pop(); return bot('The AI sent nothing back — try again.'); }
          live.chat.push({ role: 'assistant', content: t });
          bot(esc(t).replace(/\n/g, '<br>'), t);
        })
        .catch(function (err) {
          wait.remove();
          live.chat.pop();
          bot('Live AI error: ' + esc(err.message) + '. The built-in coach still works.');
        })
        .then(function () { live.busy = false; });
    }

    function copyPrompt() {
      var lines = ['I\'m a beginner learning machinist shop math (TRAK DPM3 trainer). Coach me like a patient shop instructor.'];
      if (current) {
        lines.push('Current practice question: ' + plainQ(current));
        lines.push(current._attempted
          ? 'I have already attempted it.'
          : 'I have NOT attempted it yet — coach the method, don\'t just hand me the answer.');
      }
      if (lastMiss && lastMiss.diag && lastMiss.diag.label) {
        lines.push('My last mistake was: ' + lastMiss.diag.label + ' (my path: ' + plain(lastMiss.diag.your) + ').');
      }
      var text = lines.join('\n');
      var p = (navigator.clipboard && navigator.clipboard.writeText)
        ? navigator.clipboard.writeText(text) : Promise.reject(new Error('no clipboard'));
      p.then(function () { bot('Copied. Paste it to Claude in the chat — full AI, and it already knows your question and your last mistake.'); })
        .catch(function () {
          bot('Couldn\'t reach the clipboard — copy this by hand:<br><span class="steps">' + esc(text).replace(/\n/g, '<br>') + '</span>');
        });
    }

    function drawLive() {
      if (!isLocal) {
        liveEl.innerHTML =
          '<div class="live-note">🤖 Live AI can\'t run inside this hosted page (it blocks outside connections). ' +
          'Download the one-file offline copy and open it to GO LIVE with your own API key — or copy the question straight to Claude:</div>' +
          '<button data-copy>📋 COPY QUESTION FOR CLAUDE</button>';
      } else if (live.key) {
        liveEl.innerHTML =
          '<div class="live-badge">● LIVE — AI instructor connected (' +
          (live.model === 'claude-opus-5' ? 'Opus 5' : 'Haiku 4.5') + '). The ask box now talks to it.</div>' +
          '<div class="btnrow"><button data-copy>📋 COPY FOR CLAUDE</button><button data-disc>DISCONNECT</button></div>';
      } else {
        liveEl.innerHTML =
          '<div class="live-note">🤖 GO LIVE (optional): paste an Anthropic API key and the ask box becomes a real AI instructor that sees your question. ' +
          'The key stays in memory only — gone when the tab closes. Keys come from console.anthropic.com (paid, your account).</div>' +
          '<input type="password" data-key placeholder="sk-ant-…" autocomplete="off" aria-label="Anthropic API key">' +
          '<div class="btnrow">' +
          '<select data-model aria-label="AI model">' +
          '<option value="claude-opus-5">OPUS 5 — smartest</option>' +
          '<option value="claude-haiku-4-5">HAIKU 4.5 — fastest, cheapest</option>' +
          '</select>' +
          '<button class="primary" data-conn>CONNECT</button></div>' +
          '<div class="btnrow"><button data-copy>📋 COPY QUESTION FOR CLAUDE</button></div>';
      }
      var c = liveEl.querySelector('[data-copy]');
      if (c) c.addEventListener('click', copyPrompt);
      var d = liveEl.querySelector('[data-disc]');
      if (d) d.addEventListener('click', function () {
        live.key = null; live.chat = [];
        drawLive();
        bot('Disconnected — back to the built-in coach. The key is gone from memory.');
      });
      var conn = liveEl.querySelector('[data-conn]');
      if (conn) conn.addEventListener('click', function () {
        var k = liveEl.querySelector('[data-key]').value.trim();
        var m = liveEl.querySelector('[data-model]').value;
        if (!k) return;
        conn.disabled = true;
        conn.textContent = 'CONNECTING…';
        apiCall(k, m, [{ role: 'user', content: 'Say OK.' }], 'Reply with the word OK only.', 64)
          .then(function () {
            live.key = k; live.model = m; live.chat = [];
            drawLive();
            bot('Live AI instructor connected. Ask anything in the box below — it can see the current question and your recent mistakes.');
          })
          .catch(function (err) {
            conn.disabled = false;
            conn.textContent = 'CONNECT';
            bot('Could not connect: ' + esc(err.message) + '. Check the key and try again.');
          });
      });
    }
    drawLive();
    bot('I\'m watching this practice set. Stuck before you start? <b>EXPLAIN IT ANOTHER WAY</b>. Want a demo? <b>WORK ONE LIKE IT</b>. Just missed one? <b>WHY WAS I WRONG?</b>');
    return {
      notifyQuestion: function (q) { current = q; },
      notifyMiss: function (q, shown, diag) {
        lastMiss = { q: q, shown: shown, diag: diag };
        if (diag && diag.label) {
          missCounts[diag.label] = (missCounts[diag.label] || 0) + 1;
          if (missCounts[diag.label] === 2) {
            bot('Pattern spotted: that\'s the second <b>' + diag.label.toLowerCase() +
              '</b> this session. Right before you hit CHECK, ask: did I dodge it this time?');
          }
        }
      },
    };
  }

  /* ---------------- Daily 10 question banks ----------------
     One generator per built module; each call returns a fresh question object.
     Modules 2–10 add theirs here as they get built. */
  var BANKS = {};

  BANKS.m1 = function () {
    var kind = pick(['f2d', 'f2d', 'thou', 'compare', 'd2f']);
    var pool = [[1,2],[1,4],[3,4],[1,8],[3,8],[5,8],[7,8],[1,16],[3,16],[5,16],[7,16],[9,16],[11,16],[13,16],[15,16],[1,32],[3,32],[5,32],[7,32],[9,32],[15,32],[21,32],[27,32],[31,32],[1,64],[3,64],[5,64],[9,64],[17,64],[33,64],[63,64]];
    if (kind === 'f2d') {
      var f = pick(pool), dec = f[0] / f[1];
      return { type: 'num', a: dec, tol: 0.0005, from: 'Module 1',
        q: 'Convert <span class="num">' + f[0] + '/' + f[1] + '</span> to a decimal.',
        explain: f[0] + ' ÷ ' + f[1] + ' = <span class="num">' + fmtExact(dec) + '</span>.',
        hint: 'A fraction IS a division: read ' + f[0] + '/' + f[1] + ' as "' + f[0] + ' divided by ' + f[1] + '". Top goes in first.',
        steps: '1 · ' + f[0] + '/' + f[1] + ' = <span class="num">' + f[0] + ' ÷ ' + f[1] + '</span><br>' +
          '2 · Divide: <span class="res">' + fmtExact(dec) + '</span>',
        diagnose: m1DiagF2D(f[0], f[1], dec) };
    }
    if (kind === 'thou') {
      var v = pick([0.062, 0.125, 0.250, 0.375, 0.437, 0.500, 0.750, 0.031, 0.812]);
      var th = Math.round(v * 1000);
      return { type: 'num', a: th, tol: 0.6, unit: 'thou', from: 'Module 1',
        q: 'How many <b>thou</b> is <span class="num">' + fmtExact(v, 3) + '"</span>?',
        explain: 'One thou = 0.001". Multiply by 1000: ' + fmtExact(v, 3) + ' × 1000 = <span class="num">' + th + '</span> thou.',
        hint: 'A thou is 0.001". Slide the decimal point three places to the right — done.',
        steps: '1 · thou = inches × 1000<br>' +
          '2 · <span class="num">' + fmtExact(v, 3) + ' → ' + (v * 10).toFixed(2) + ' → ' + (v * 100).toFixed(1) + ' → ' + th + '</span><br>' +
          '3 · Answer: <span class="res">' + th + ' thou</span>',
        diagnose: function (u) {
          if (Math.abs(u - v) < 0.002) return { label: 'Units mix-up',
            your: 'you handed the inches back: ' + fmtExact(v, 3),
            right: fmtExact(v, 3) + ' × 1000 = ' + th + ' thou' };
          if (Math.abs(u - v * 100) < 1 || Math.abs(u - v * 10000) < 1) return { label: 'Decimal-place slip',
            your: 'the point moved, but not exactly three places → ' + u,
            right: fmtExact(v, 3) + ' × 1000 = ' + th + ' — three slides exactly' };
          return null;
        } };
    }
    if (kind === 'compare') {
      var f2 = pick(pool); var dec2 = f2[0] / f2[1];
      var off = pick([0.004, -0.004, 0.007, -0.007]);
      var other = Math.round((dec2 + off) * 10000) / 10000;
      var bigger = dec2 > other ? 0 : 1;
      return { type: 'mc', a: bigger, from: 'Module 1',
        q: 'Which is <b>larger</b>?',
        choices: [fracStr(f2[0], f2[1]), fmtExact(other) + '"'],
        explain: fracStr(f2[0], f2[1]) + ' = ' + fmtExact(dec2) + '. Compare: ' + fmtExact(dec2) + ' vs ' + fmtExact(other) + '.' };
    }
    /* d2f: decimal to nearest fraction, multiple choice — neighbor-mark distractors */
    var f3 = pick(pool); var n3 = f3[0], d3 = f3[1]; var dec3 = n3 / d3;
    var r = reduceFrac(n3, d3);
    var correct = fracStr(r[0], r[1]);
    var cands = [[n3 - 1, d3], [n3 + 1, d3], [2 * n3 - 1, 2 * d3], [2 * n3 + 1, 2 * d3], [2 * n3 - 3, 2 * d3], [2 * n3 + 3, 2 * d3]];
    var seen = {}; seen[correct] = true;
    var choices = [correct];
    for (var ci = 0; ci < cands.length && choices.length < 4; ci++) {
      var cn = cands[ci][0], cd = cands[ci][1];
      if (cn <= 0 || cn >= cd) continue;
      var cs = fracStr(cn, cd);
      if (!seen[cs]) { seen[cs] = true; choices.push(cs); }
    }
    return { type: 'mc', a: 0, from: 'Module 1',
      q: '<span class="num">' + fmtExact(dec3) + '"</span> is which fraction?',
      choices: choices,
      explain: correct + ' = ' + r[0] + ' ÷ ' + r[1] + ' = ' + fmtExact(dec3) + '.',
      diagnose: function () {
        return 'off by a neighboring mark — divide it out and compare decimals.';
      } };
  };

  function m1DiagF2D(n, d, dec) {
    return function (v) {
      if (Math.abs(v - d / n) <= 0.002 && n !== d) return { label: 'Inverted fraction',
        your: d + ' ÷ ' + n + ' = ' + fmtExact(d / n) + ' — bottom ÷ top',
        right: n + ' ÷ ' + d + ' = ' + fmtExact(dec) + ' — top ÷ bottom, always' };
      if (Math.abs(v - dec * 10) <= 0.005 || Math.abs(v - dec / 10) <= 0.005) return { label: 'Decimal-place slip',
        your: 'right digits, wrong spot: ' + fmtExact(v),
        right: n + ' ÷ ' + d + ' = ' + fmtExact(dec) };
      if (Math.abs(v - dec) <= 0.005) return { label: 'Rounded too early',
        your: fmtExact(v) + ' — cut short',
        right: 'carry it out: ' + n + ' ÷ ' + d + ' = ' + fmtExact(dec) };
      return { label: 'Wrong operation',
        your: 'whatever produced ' + fmtExact(v) + ' was not top ÷ bottom',
        right: n + ' ÷ ' + d + ' = ' + fmtExact(dec) };
    };
  }

  BANKS.m2 = function () {
    var kind = pick(['addMove', 'addMove', 'distance', 'distance', 'direction', 'whichBigger', 'gapZero']);
    function sg(v) { return signed(v, 3); }
    function r3(v) { return Math.round(v * 1000) / 1000; }
    function rpos(lo, hi) {  /* nonzero position on 1/8" steps */
      var n = Math.round((hi - lo) * 8), v, t;
      for (t = 0; t < 30; t++) {
        v = r3(lo + Math.floor(Math.random() * (n + 1)) / 8);
        if (v !== 0) return v;
      }
      return 0.125;
    }
    var t;
    if (kind === 'addMove') {
      var s, mv, a;
      for (t = 0; t < 60; t++) {
        s = rpos(-1.75, 1.75); mv = rpos(-1.5, 1.5); a = r3(s + mv);
        if (Math.abs(a) >= 0.1 && Math.abs(a) <= 2 && Math.abs(mv) >= 0.125) break;
      }
      return { type: 'num', a: a, tol: 0.0005, from: 'Module 2',
        q: 'The DRO reads X <span class="num">' + sg(s) + '</span>. The program calls a move of <span class="num">' + sg(mv) + '</span>. Where does the tool end up?',
        explain: 'position + move: ' + sg(s) + ' + (' + sg(mv) + ') = <span class="num">' + sg(a) + '</span>. A plus move slides RIGHT, a minus move slides LEFT.',
        hint: 'New position = where you ARE plus the signed move. Keep both signs exactly as written.',
        steps: '1 · new = start + move<br>2 · Plug in, signs and all: <span class="num">' + sg(s) + '</span> + <span class="num">(' + sg(mv) + ')</span><br>3 · Land at <span class="res">' + sg(a) + '"</span>',
        diagnose: function (v) {
          if (Math.abs(v + a) <= 0.002) return { label: 'Sign dropped at the end',
            your: sg(v) + ' is the mirror of the right spot — same distance from zero, wrong side of it',
            right: sg(s) + ' + (' + sg(mv) + ') = ' + sg(a) + ' — keep the sign the addition hands you' };
          if (Math.abs(v - r3(s - mv)) <= 0.002) return { label: 'Flipped the move\'s sign',
            your: sg(s) + ' − (' + sg(mv) + ') = ' + sg(r3(s - mv)) + ' — you moved the tool the wrong way',
            right: 'the program said ' + sg(mv) + ': ADD it as written → ' + sg(a) };
          if (Math.abs(v - mv) <= 0.002) return { label: 'Forgot the start',
            your: sg(v) + ' is the move itself — but the tool was not sitting at zero',
            right: sg(s) + ' + (' + sg(mv) + ') = ' + sg(a) };
          return { label: 'Not start + move',
            your: sg(v) + ' does not come from ' + sg(s) + ' + (' + sg(mv) + ')',
            right: sg(s) + ' + (' + sg(mv) + ') = ' + sg(a) };
        } };
    }
    if (kind === 'distance') {
      var p1, p2, d;
      for (t = 0; t < 60; t++) {
        p1 = rpos(-1.875, 1.875); p2 = rpos(-1.875, 1.875); d = r3(Math.abs(p1 - p2));
        if (d >= 0.125) break;
      }
      var opp = (p1 < 0 && p2 > 0) || (p1 > 0 && p2 < 0);
      return { type: 'num', a: d, tol: 0.0005, from: 'Module 2',
        q: 'Two hole centers: one at X <span class="num">' + sg(p1) + '</span>, the other at X <span class="num">' + sg(p2) + '</span>. How far apart are they?',
        explain: 'Distance = |a − b|: ' + sg(p1) + ' − (' + sg(p2) + ') = ' + sg(r3(p1 - p2)) + ', size <span class="num">' + fmtExact(d, 3) + '"</span>. A distance never carries a sign.',
        hint: 'Subtract one position from the other (either order), then drop any minus sign. Distance has no direction.',
        steps: '1 · Subtract, signs and all: <span class="num">' + sg(p1) + '</span> − <span class="num">(' + sg(p2) + ')</span> = ' + sg(r3(p1 - p2)) + '<br>2 · Keep the size only<br>3 · <span class="res">' + fmtExact(d, 3) + '"</span> apart',
        diagnose: function (v) {
          if (Math.abs(v + d) <= 0.002) return { label: 'Signed a distance',
            your: sg(v) + ' — you kept the minus, but a distance is never negative',
            right: '|' + sg(p1) + ' − (' + sg(p2) + ')| = ' + fmtExact(d, 3) };
          if (opp && Math.abs(v - r3(Math.abs(Math.abs(p1) - Math.abs(p2)))) <= 0.002 && Math.abs(r3(Math.abs(Math.abs(p1) - Math.abs(p2))) - d) > 0.004) return { label: 'Forgot the zero crossing',
            your: 'you subtracted the two sizes — but these points sit on OPPOSITE sides of zero',
            right: 'the gap spans zero, so the sizes add: ' + fmtExact(Math.abs(p1), 3) + ' + ' + fmtExact(Math.abs(p2), 3) + ' = ' + fmtExact(d, 3) };
          if (!opp && Math.abs(v - r3(Math.abs(p1) + Math.abs(p2))) <= 0.002 && Math.abs(r3(Math.abs(p1) + Math.abs(p2)) - d) > 0.004) return { label: 'Added the sizes',
            your: fmtExact(Math.abs(p1), 3) + ' + ' + fmtExact(Math.abs(p2), 3) + ' — that only works when the points straddle zero; these are both on the ' + (p1 < 0 ? 'minus' : 'plus') + ' side',
            right: 'same side → subtract: |' + sg(p1) + ' − (' + sg(p2) + ')| = ' + fmtExact(d, 3) };
          return { label: 'Not |a − b|',
            your: sg(v) + ' does not come from subtracting the two positions',
            right: '|' + sg(p1) + ' − (' + sg(p2) + ')| = ' + fmtExact(d, 3) };
        } };
    }
    if (kind === 'direction') {
      var cur, tgt;
      for (t = 0; t < 60; t++) {
        cur = rpos(-1.75, 1.75); tgt = rpos(-1.75, 1.75);
        if (Math.abs(tgt - cur) >= 0.125) break;
      }
      var diff = r3(tgt - cur);
      var word = diff > 0 ? 'PLUS' : 'MINUS';
      return { type: 'mc', a: diff > 0 ? 0 : 1, from: 'Module 2',
        choices: ['PLUS — jog toward the right', 'MINUS — jog toward the left'],
        q: 'The tool sits at X <span class="num">' + sg(cur) + '</span>. The next hole is at X <span class="num">' + sg(tgt) + '</span>. Which way do you jog?',
        explain: 'Direction = sign of (target − current): ' + sg(tgt) + ' − (' + sg(cur) + ') = ' + sg(diff) + ' → jog <span class="num">' + word + '</span>.',
        hint: 'Compute target − current — where you\'re GOING minus where you ARE, in that order. The sign of the result IS the jog direction.',
        steps: '1 · direction = sign of (target − current)<br>2 · <span class="num">' + sg(tgt) + '</span> − <span class="num">(' + sg(cur) + ')</span> = ' + sg(diff) + '<br>3 · jog <span class="res">' + word + '</span>',
        diagnose: function () {
          return { label: 'Direction flipped',
            your: 'that is the sign of current − target: ' + sg(cur) + ' − (' + sg(tgt) + ') = ' + sg(r3(cur - tgt)) + ' — the subtraction ran backwards',
            right: 'target − current: ' + sg(tgt) + ' − (' + sg(cur) + ') = ' + sg(diff) + ' → ' + word };
        } };
    }
    if (kind === 'whichBigger') {
      var v1, v2;
      for (t = 0; t < 60; t++) {
        v1 = rpos(-1.875, -0.125); v2 = rpos(-1.875, -0.125);
        if (v1 !== v2) break;
      }
      var ai = v1 > v2 ? 0 : 1;
      var win = ai === 0 ? v1 : v2, lose = ai === 0 ? v2 : v1;
      return { type: 'mc', a: ai, from: 'Module 2',
        choices: [fmtExact(v1, 3) + '"', fmtExact(v2, 3) + '"'],
        q: 'Which of these is the <b>larger</b> X position — the one further to the <b>right</b>?',
        explain: 'Bigger = further right on the line. ' + sg(win) + ' sits to the right of ' + sg(lose) + ' — with two negatives, the SMALLER digits win, because more minus means further left.',
        hint: 'Put both on the number line and ask which sits further RIGHT. A bigger number after a minus is further LEFT.',
        steps: '1 · ' + sg(lose) + ' is ' + fmtExact(Math.abs(lose), 3) + '" left of zero, ' + sg(win) + ' is ' + fmtExact(Math.abs(win), 3) + '" left of zero<br>2 · Further right wins<br>3 · <span class="res">' + sg(win) + '</span> is larger',
        diagnose: function () {
          return { label: 'Magnitude trap',
            your: 'you picked ' + sg(lose) + ' because its digits are bigger — but after a minus, bigger digits mean further LEFT',
            right: sg(win) + ' sits to the right of ' + sg(lose) + ' — further right = larger' };
        } };
    }
    var x = -Math.abs(rpos(-1.875, 1.875));
    var g = Math.abs(x);
    return { type: 'num', a: g, tol: 0.0005, from: 'Module 2',
      q: 'The DRO reads X <span class="num">' + sg(x) + '</span>. How far is the tool from part zero?',
      explain: 'Distance to zero is the absolute value: |' + sg(x) + '| = <span class="num">' + fmtExact(g, 3) + '"</span>. The sign said which side; the digits already said how far.',
      hint: 'The sign says which side of zero; the digits alone say how far. Strip the sign and you have the distance.',
      steps: '1 · distance to zero = |position|<br>2 · |<span class="num">' + sg(x) + '</span>| — drop the sign, keep the size<br>3 · <span class="res">' + fmtExact(g, 3) + '"</span> from zero',
      diagnose: function (v) {
        if (Math.abs(v - x) <= 0.002) return { label: 'Signed a distance',
          your: sg(x) + ' is the tool\'s ADDRESS — the question asked for a distance, and a distance is never negative',
          right: '|' + sg(x) + '| = ' + fmtExact(g, 3) + ' — the minus only said "left side"' };
        if (Math.abs(v - r3(2 * g)) <= 0.002) return { label: 'Doubled it',
          your: fmtExact(2 * g, 3) + ' is the distance from ' + sg(x) + ' to ' + sg(-x) + ' — mirror to mirror, not to zero',
          right: 'zero is the midpoint: |' + sg(x) + '| = ' + fmtExact(g, 3) };
        return { label: 'Not the gap',
          your: sg(v) + ' is not |' + sg(x) + '|',
          right: 'distance to zero = |' + sg(x) + '| = ' + fmtExact(g, 3) };
      } };
  };
  BANKS.m3 = function () {
    var kind = pick(['absToInc', 'absToInc', 'incToAbs', 'incToAbs', 'zDepth', 'zDepth', 'quadrantSign']);
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function par(v) { return v < 0 ? '(' + fmtExact(v) + ')' : fmtExact(v); }
    function coord() { return Math.round(Math.floor(Math.random() * 161) * 25) / 1000; } /* 0 … 4.000 by 0.025 */
    if (kind === 'absToInc') {
      var ax = pick(['X', 'Y']);
      var cur = coord(), tgt = cur;
      while (tgt === cur) tgt = coord();
      var inc = r4(tgt - cur);
      return { type: 'num', a: inc, tol: 0.0005, from: 'Module 3',
        q: 'The tool sits at ' + ax + ' <span class="num">' + fmtExact(cur) + '"</span>. The next position is ' + ax +
          ' <span class="num">' + fmtExact(tgt) + '"</span> absolute. What <b>incremental</b> ' + ax + ' move gets you there?',
        explain: 'Incremental = target − current: ' + fmtExact(tgt) + ' − ' + fmtExact(cur) + ' = <span class="num">' + signed(inc, 4) + '"</span>.',
        hint: 'Incremental asks: how far, and which way, from where the tool is NOW? One rule: target − current — in that order. The sign falls out of the subtraction; never pick it by feel.',
        steps: '1 · The rule: incremental = target − current<br>' +
          '2 · Plug in: <span class="num">' + fmtExact(tgt) + '</span> − <span class="num">' + fmtExact(cur) + '</span> = <span class="res">' + signed(inc, 4) + '"</span>',
        diagnose: function (v) {
          if (Math.abs(v - (cur - tgt)) <= 0.001) return { label: inc < 0 ? 'Dropped the minus sign' : 'Swapped the subtraction',
            your: 'current − target: ' + fmtExact(cur) + ' − ' + fmtExact(tgt) + ' = ' + signed(r4(cur - tgt), 4) + ' — the tool would drive the wrong way',
            right: 'target − current: ' + fmtExact(tgt) + ' − ' + fmtExact(cur) + ' = ' + signed(inc, 4) };
          if (Math.abs(v - tgt) <= 0.001) return { label: 'Gave absolute, not incremental',
            your: fmtExact(tgt) + ' is where the target IS — not how to get there',
            right: 'the MOVE is ' + fmtExact(tgt) + ' − ' + fmtExact(cur) + ' = ' + signed(inc, 4) };
          return { label: 'Arithmetic slip',
            your: v + ' is not target − current',
            right: fmtExact(tgt) + ' − ' + fmtExact(cur) + ' = ' + signed(inc, 4) };
        } };
    }
    if (kind === 'incToAbs') {
      var ax2 = pick(['X', 'Y']);
      var c2 = Math.round((20 + Math.floor(Math.random() * 121)) * 25) / 1000;  /* 0.500 … 3.500 */
      var mag = Math.round((2 + Math.floor(Math.random() * 47)) * 25) / 1000;   /* 0.050 … 1.200 */
      var sg = Math.random() < 0.5 ? -1 : 1;
      if (c2 + sg * mag < 0 || c2 + sg * mag > 4) sg = -sg;
      var mv = r4(sg * mag), abs = r4(c2 + mv);
      return { type: 'num', a: abs, tol: 0.0005, from: 'Module 3',
        q: 'You are at ' + ax2 + ' <span class="num">' + fmtExact(c2) + '"</span> and the program calls an incremental move of <span class="num">' +
          signed(mv, 4) + '"</span>. Where does the ' + ax2 + ' DRO read (absolute) after the move?',
        explain: 'New absolute = current + incremental: ' + fmtExact(c2) + ' + ' + par(mv) + ' = <span class="num">' + fmtExact(abs) + '"</span>.',
        hint: 'You know where you are and how far you move. New absolute = current + incremental — keep the sign glued to the move when you add.',
        steps: '1 · The rule: new absolute = current + incremental<br>' +
          '2 · Plug in: <span class="num">' + fmtExact(c2) + '</span> + <span class="num">' + par(mv) + '</span> = <span class="res">' + fmtExact(abs) + '"</span>',
        diagnose: function (v) {
          if (Math.abs(v - (c2 - mv)) <= 0.001) return { label: 'Flipped the move’s sign',
            your: fmtExact(c2) + ' − ' + par(mv) + ' = ' + fmtExact(r4(c2 - mv)) + ' — you drove the tool the opposite way',
            right: 'add the move as written: ' + fmtExact(c2) + ' + ' + par(mv) + ' = ' + fmtExact(abs) };
          if (Math.abs(v - mv) <= 0.001 || Math.abs(v - Math.abs(mv)) <= 0.001) return { label: 'Gave the move, not the destination',
            your: signed(mv, 4) + ' is the incremental move itself — the question asks where the DRO reads AFTER it',
            right: fmtExact(c2) + ' + ' + par(mv) + ' = ' + fmtExact(abs) };
          return { label: 'Arithmetic slip',
            your: v + ' is not current + incremental',
            right: fmtExact(c2) + ' + ' + par(mv) + ' = ' + fmtExact(abs) };
        } };
    }
    if (kind === 'zDepth') {
      if (Math.random() < 0.5) {
        var d = pick([0.100, 0.125, 0.150, 0.200, 0.250, 0.300, 0.375, 0.500]);
        var za = r4(-d);
        return { type: 'num', a: za, tol: 0.0005, from: 'Module 3',
          q: 'Part zero is on the <b>top</b> of the part, so the top face reads Z <span class="num">0</span>. You mill a step <span class="num">' +
            fmtExact(d, 3) + '"</span> deep. What does the Z DRO read at full depth?',
          explain: 'The whole part sits below Z0 and +Z is up, so depth is negative: <span class="num">Z ' + fmtExact(za) + '"</span>.',
          hint: 'Where is Z zero? On the top face. Which way is plus? Up. So which sign must anything BELOW the top face carry?',
          steps: '1 · Z0 is the top face; +Z is up, −Z is down into the part<br>' +
            '2 · Full depth is <span class="num">' + fmtExact(d, 3) + '"</span> below the top face<br>' +
            '3 · Below zero reads negative: <span class="res">Z ' + fmtExact(za) + '"</span>',
          diagnose: function (v) {
            if (Math.abs(v - d) <= 0.001) return { label: 'Positive Z for a depth',
              your: '+' + fmtExact(d, 3) + ' would put the tool ABOVE the part — +Z is up',
              right: 'cutting happens below Z0: Z ' + fmtExact(za) };
            if (Math.abs(Math.abs(v) - d * 1000) <= 1) return { label: 'Answered in thou',
              your: Math.round(Math.abs(v)) + ' is the depth in thou — the Z DRO reads inches',
              right: fmtExact(d, 3) + '" below zero → Z ' + fmtExact(za) + '"' };
            return { label: 'Depth slip',
              your: v + ' is not ' + fmtExact(d, 3) + '" below the top face',
              right: '0 − ' + fmtExact(d, 3) + ' = ' + fmtExact(za) };
          } };
      }
      var z0 = -pick([0.100, 0.150, 0.200, 0.250, 0.300]);
      var dd = pick([0.050, 0.075, 0.100, 0.125, 0.150]);
      var zb = r4(z0 - dd);
      return { type: 'num', a: zb, tol: 0.0005, from: 'Module 3',
        q: 'The tool tip sits at Z <span class="num">' + fmtExact(z0) + '"</span>. The next pass goes <span class="num">' + fmtExact(dd, 3) +
          '"</span> deeper. What Z do you feed down to?',
        explain: 'Deeper means MORE negative: ' + par(z0) + ' − ' + fmtExact(dd, 3) + ' = <span class="num">Z ' + fmtExact(zb) + '"</span>.',
        hint: 'Deeper is further below zero — the Z number gets MORE negative. Start from where the tip already is and push it down by the pass amount.',
        steps: '1 · Deeper = more negative: new Z = current Z − pass depth<br>' +
          '2 · Plug in: <span class="num">' + par(z0) + '</span> − <span class="num">' + fmtExact(dd, 3) + '</span> = <span class="res">Z ' + fmtExact(zb) + '"</span>',
        diagnose: function (v) {
          if (Math.abs(v - (z0 + dd)) <= 0.001) return { label: 'Went the wrong way',
            your: par(z0) + ' + ' + fmtExact(dd, 3) + ' = ' + fmtExact(r4(z0 + dd)) + ' — that RAISES the tool toward the surface',
            right: 'deeper subtracts: ' + par(z0) + ' − ' + fmtExact(dd, 3) + ' = ' + fmtExact(zb) };
          if (Math.abs(v - (-dd)) <= 0.001) return { label: 'Ignored the starting depth',
            your: 'Z ' + fmtExact(-dd) + ' answers as if the tip started at Z 0 — it is already at ' + fmtExact(z0),
            right: par(z0) + ' − ' + fmtExact(dd, 3) + ' = ' + fmtExact(zb) };
          if (Math.abs(v - Math.abs(zb)) <= 0.001) return { label: 'Dropped the minus sign',
            your: fmtExact(Math.abs(zb)) + ' is the right distance below the top — but below zero reads negative',
            right: 'Z ' + fmtExact(zb) + '" — depths carry the minus' };
          return { label: 'Depth slip',
            your: v + ' is not one pass deeper than ' + fmtExact(z0),
            right: par(z0) + ' − ' + fmtExact(dd, 3) + ' = ' + fmtExact(zb) };
        } };
    }
    /* quadrantSign — signs of X and Y by quadrant around part zero */
    var quads = [
      { sx: 1,  sy: 1,  txt: '<b>right</b> of part zero and <b>away from you</b>, toward the column' },
      { sx: 1,  sy: -1, txt: '<b>right</b> of part zero and <b>toward you</b> (off the front-right corner)' },
      { sx: -1, sy: 1,  txt: '<b>left</b> of part zero and <b>away from you</b>, toward the column' },
      { sx: -1, sy: -1, txt: '<b>left</b> of part zero and <b>toward you</b> (off the front-left corner)' },
    ];
    var qd = pick(quads);
    var qchoices = ['X +, Y +', 'X +, Y −', 'X −, Y +', 'X −, Y −'];
    var qsigns = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    var qa = (qd.sx > 0 ? 0 : 2) + (qd.sy > 0 ? 0 : 1);
    function sw(s) { return s > 0 ? '+' : '−'; }
    return { type: 'mc', a: qa, choices: qchoices, from: 'Module 3',
      q: 'A hole sits ' + qd.txt + '. Standing at the machine, what signs do its X and Y coordinates carry?',
      explain: '+X is to the right, +Y is away from you (toward the column). This point → X ' + sw(qd.sx) + ', Y ' + sw(qd.sy) + '.',
      hint: 'Take the axes one at a time. Left–right is X: right of zero is +, left is −. Toward–away is Y: away from you (toward the column) is +, toward you is −.',
      steps: '1 · Left–right is X: ' + (qd.sx > 0 ? 'right of zero → X +' : 'left of zero → X −') + '<br>' +
        '2 · Toward–away is Y: ' + (qd.sy > 0 ? 'away, toward the column → Y +' : 'toward you → Y −') + '<br>' +
        '3 · Together: <span class="res">X ' + sw(qd.sx) + ', Y ' + sw(qd.sy) + '</span>',
      diagnose: function (chosen) {
        var cx = qsigns[chosen][0], cy = qsigns[chosen][1];
        if (qd.sx !== qd.sy && cx === qd.sy && cy === qd.sx) return { label: 'Mixed up X and Y',
          your: 'you put the left–right sign on Y and the toward–away sign on X',
          right: 'left–right is ALWAYS X, toward–away is ALWAYS Y → X ' + sw(qd.sx) + ', Y ' + sw(qd.sy) };
        if (cx !== qd.sx && cy !== qd.sy) return { label: 'Both signs backwards',
          your: 'X ' + sw(cx) + ', Y ' + sw(cy) + ' is the diagonally opposite quadrant',
          right: 'right and away are the + directions → X ' + sw(qd.sx) + ', Y ' + sw(qd.sy) };
        if (cx !== qd.sx) return { label: 'X sign backwards',
          your: 'X ' + sw(cx) + ' puts the point on the ' + (cx > 0 ? 'right' : 'left') + ' — the question says the other side',
          right: (qd.sx > 0 ? 'right' : 'left') + ' of zero → X ' + sw(qd.sx) };
        return { label: 'Y sign backwards',
          your: 'Y ' + sw(cy) + ' means ' + (cy > 0 ? 'away from you' : 'toward you') + ' — the question says the opposite',
          right: (qd.sy > 0 ? 'away from you, toward the column' : 'toward you') + ' → Y ' + sw(qd.sy) };
      } };
  };

  BANKS.m4 = function () {
    var OFF = FACTS.edgeFinderOffset, TIP = FACTS.edgeFinderTip;
    var O3 = fmtExact(OFF, 3), T3 = fmtExact(TIP, 3);
    function sq(v) { return signed(v, 4); }
    function r4(v) { return Math.round(v * 10000) / 10000; }
    function nr(v, t) { return Math.abs(v - t) <= 0.002; }
    var kind = pick(['setValue', 'setValue', 'edgePos', 'center', 'width', 'zShim']);
    if (kind === 'setValue') {
      var axis = pick(['X', 'Y']);
      var dir = pick([1, -1]);
      var sgn = dir > 0 ? '+' : '-';
      var sideWord = axis === 'X' ? (dir > 0 ? 'LEFT' : 'RIGHT') : (dir > 0 ? 'NEAR' : 'FAR');
      var a = r4(-dir * OFF);
      return { type: 'num', a: a, tol: 0.0005, from: 'Module 4',
        q: 'You jog <span class="num">' + sgn + axis + '</span> until the edge finder kicks on the part\'s <b>' +
          sideWord + '</b> edge. That edge is ' + axis + ' zero. What do you SET ' + axis + ' to? (sign matters)',
        explain: 'The spindle center stops ' + O3 + ' on the side you came FROM — SET sign is OPPOSITE the jog: <span class="num">' + sq(a) + '</span>.',
        hint: 'The DRO tracks the spindle CENTER, and half the ' + T3 + ' tip separates it from the edge — on the side you came from. SET sign is OPPOSITE the jog.',
        steps: '1 · Tip is <span class="num">' + T3 + '"</span> across → center sits <span class="num">' + O3 + '"</span> from the touched edge<br>' +
          '2 · Jogged ' + sgn + axis + ' → the center stopped on the ' + (dir > 0 ? 'minus' : 'plus') + ' side<br>' +
          '3 · SET ' + axis + ' = <span class="res">' + sq(a) + '"</span>',
        diagnose: function (v) {
          if (nr(v, -a)) return { label: 'Sign flipped on the ' + O3,
            your: sq(-a) + ' pushes the ' + O3 + ' WITH the jog — every feature would cut ' + T3 + ' off location',
            right: 'the center stopped on the side you came FROM: SET = ' + sq(a) };
          if (nr(v, 0)) return { label: 'Forgot the ' + O3,
            your: '0.0000 claims the spindle center reached the edge — only the tip\'s skin did',
            right: 'the center is ' + O3 + ' back: SET = ' + sq(a) };
          if (nr(v, 2 * a) || nr(v, -2 * a)) return { label: 'Used the tip diameter',
            your: 'that is the whole ' + T3 + ' tip — the center rides only HALF that from the touch',
            right: 'half of ' + T3 + ' = ' + O3 + ' → SET = ' + sq(a) };
          return { label: 'Half-a-tip slip',
            your: sq(v) + ' does not come from edge ± half a tip',
            right: 'SET = 0 ' + (dir > 0 ? '−' : '+') + ' ' + O3 + ' = ' + sq(a) };
        } };
    }
    if (kind === 'edgePos') {
      var dir2 = pick([1, -1]);
      var sgn2 = dir2 > 0 ? '+' : '-';
      var R = pick([-1.8750, -1.2500, -0.7500, 0.6250, 1.2500, 2.4375]);
      var a2 = r4(R + dir2 * OFF);
      var op = dir2 > 0 ? '+' : '−';
      return { type: 'num', a: a2, tol: 0.0005, from: 'Module 4',
        q: 'You jog <span class="num">' + sgn2 + 'X</span>, the finder kicks, and the DRO reads <span class="num">X ' +
          sq(R) + '"</span>. What X value is the <b>edge</b> itself at?',
        explain: 'The DRO gives the spindle center; the edge is ' + O3 + ' farther along, in the jog direction: ' +
          sq(R) + ' ' + op + ' ' + O3 + ' = <span class="num">' + sq(a2) + '</span>.',
        hint: 'The reading is where the spindle CENTER stopped — the edge is half a tip beyond it, the way you were jogging.',
        steps: '1 · DRO at the kiss = spindle center = <span class="num">' + sq(R) + '</span><br>' +
          '2 · The edge sits <span class="num">' + O3 + '</span> beyond the center, in the jog direction (' + sgn2 + 'X)<br>' +
          '3 · edge = ' + sq(R) + ' ' + op + ' ' + O3 + ' = <span class="res">' + sq(a2) + '"</span>',
        diagnose: function (v) {
          if (nr(v, R)) return { label: 'Read the DRO as the edge',
            your: sq(R) + ' is the spindle CENTER — the tip\'s skin touched the edge, half a tip away',
            right: 'edge = ' + sq(R) + ' ' + op + ' ' + O3 + ' = ' + sq(a2) };
          if (nr(v, R - dir2 * OFF)) return { label: 'Sign flipped on the ' + O3,
            your: 'you stepped BACKWARD from the center — the edge is AHEAD, the way you were jogging',
            right: sq(R) + ' ' + op + ' ' + O3 + ' = ' + sq(a2) };
          return { label: 'Half-a-tip slip',
            your: sq(v) + ' does not come from center ± half a tip',
            right: sq(R) + ' ' + op + ' ' + O3 + ' = ' + sq(a2) };
        } };
    }
    if (kind === 'center') {
      var L = pick([-1.500, -1.000, -0.500, 0.500, 1.000]);
      var W = pick([0.750, 1.000, 1.250, 1.500, 2.000]);
      if (Math.abs(L + W / 2) < 0.001) W += 0.500;
      var R1 = r4(L - OFF), R2 = r4(L + W + OFF);
      var aC = r4(L + W / 2), half = r4((R2 - R1) / 2), sum = r4(R1 + R2);
      return { type: 'num', a: aC, tol: 0.0005, from: 'Module 4',
        q: 'Kiss the LEFT side of the part — DRO <span class="num">X ' + sq(R1) + '"</span>. Kiss the RIGHT side — ' +
          '<span class="num">X ' + sq(R2) + '"</span>. What X is the part\'s <b>center</b>?',
        explain: 'Center = average of the two raw readings: (' + sq(R1) + ' + ' + sq(R2) + ') ÷ 2 = <span class="num">' +
          sq(aC) + '</span>. The two ' + O3 + ' offsets point opposite ways and cancel.',
        hint: 'Both numbers are spindle-center POSITIONS, one per side. The middle of two positions is their average — and the two half-tip offsets kill each other.',
        steps: '1 · Each reading stands ' + O3 + ' OUTSIDE its own side<br>' +
          '2 · center = (<span class="num">' + sq(R1) + '</span> + <span class="num">' + sq(R2) + '</span>) ÷ 2<br>' +
          '3 · = ' + sq(sum) + ' ÷ 2 = <span class="res">' + sq(aC) + '"</span> — no correction, the offsets cancelled',
        diagnose: function (v) {
          if (nr(v, half)) return { label: 'Averaged the spread, not the positions',
            your: 'half the DISTANCE between kisses is a length, not a location',
            right: '(' + sq(R1) + ' + ' + sq(R2) + ') ÷ 2 = ' + sq(aC) };
          if (nr(v, aC + OFF) || nr(v, aC - OFF)) return { label: 'Corrected by ' + O3 + ' where it cancels',
            your: 'one reading is already ' + O3 + ' low and the other ' + O3 + ' high — the average killed both',
            right: '(' + sq(R1) + ' + ' + sq(R2) + ') ÷ 2 = ' + sq(aC) + ', no correction' };
          if (nr(v, sum)) return { label: 'Forgot to divide by 2',
            your: sq(sum) + ' is the SUM of the readings, not their middle',
            right: sq(sum) + ' ÷ 2 = ' + sq(aC) };
          return { label: 'Averaging slip',
            your: sq(v) + ' is not the average of the two readings',
            right: '(' + sq(R1) + ' + ' + sq(R2) + ') ÷ 2 = ' + sq(aC) };
        } };
    }
    if (kind === 'width') {
      var L2 = pick([-0.750, -0.250, 0.250, 0.750]);
      var W2 = pick([0.625, 0.875, 1.000, 1.375, 1.750]);
      var Ra = r4(L2 - OFF), Rb = r4(L2 + W2 + OFF);
      var spread = r4(Rb - Ra);
      return { type: 'num', a: W2, tol: 0.0005, from: 'Module 4',
        q: 'Same zero for both kisses: the LEFT side reads <span class="num">X ' + sq(Ra) + '"</span>, the RIGHT side reads ' +
          '<span class="num">X ' + sq(Rb) + '"</span>. How <b>wide</b> is the part?',
        explain: 'The spread ' + fmtExact(spread, 3) + ' carries ' + O3 + ' of tip hanging outside at EACH end — one full tip. Width = ' +
          fmtExact(spread, 3) + ' − ' + T3 + ' = <span class="num">' + fmt(W2, 4) + '</span>.',
        hint: 'Distance between the readings first. Then ask: is that the part alone, or the part plus something the tip added at each end?',
        steps: '1 · spread = <span class="num">' + sq(Rb) + '</span> − (<span class="num">' + sq(Ra) + '</span>) = <span class="num">' + fmtExact(spread, 3) + '</span><br>' +
          '2 · The center stands ' + O3 + ' OUTSIDE the part at each kiss → the spread holds one full tip<br>' +
          '3 · width = ' + fmtExact(spread, 3) + ' − ' + T3 + ' = <span class="res">' + fmt(W2, 4) + '"</span>',
        diagnose: function (v) {
          if (nr(v, spread)) return { label: 'Forgot the tip',
            your: 'the raw spread includes ' + O3 + ' of tip at EACH end',
            right: fmtExact(spread, 3) + ' − ' + T3 + ' = ' + fmt(W2, 4) };
          if (nr(v, spread - OFF)) return { label: 'Subtracted ' + O3 + ', not ' + T3,
            your: 'you corrected only ONE side — the tip pokes out at BOTH kisses',
            right: fmtExact(spread, 3) + ' − ' + T3 + ' = ' + fmt(W2, 4) };
          if (nr(v, spread + TIP)) return { label: 'Added the tip instead of subtracting',
            your: 'the spread is already too BIG by a tip',
            right: fmtExact(spread, 3) + ' − ' + T3 + ' = ' + fmt(W2, 4) };
          return { label: 'Spread slip',
            your: sq(v) + ' does not come from spread − tip',
            right: fmtExact(spread, 3) + ' − ' + T3 + ' = ' + fmt(W2, 4) };
        } };
    }
    var sh = pick([0.002, 0.003, 0.004]);
    return { type: 'num', a: sh, tol: 0.0005, from: 'Module 4',
      q: 'Z touch-off on a paper shim <span class="num">' + fmtExact(sh, 3) + '"</span> thick: the tool just drags on the ' +
        'paper, and the part\'s top face is Z zero. What do you SET Z to? (sign matters)',
      explain: 'The tool is riding a paper ' + fmtExact(sh, 3) + ' ABOVE the part. SET Z = <span class="num">+' + fmt(sh, 4) + '</span>, never 0.000.',
      hint: 'Where is the tool TIP right now, relative to Z zero? Something is between it and the part. Above zero is positive.',
      steps: '1 · The tip rests on the shim, not the part<br>' +
        '2 · tip height = part top + shim = 0 + <span class="num">' + fmtExact(sh, 3) + '</span><br>' +
        '3 · SET Z = <span class="res">+' + fmt(sh, 4) + '"</span>',
      diagnose: function (v) {
        if (Math.abs(v) <= 0.0009) return { label: 'Forgot the shim',
          your: 'SET 0.000 claims the tool is ON the part — every depth would run ' + fmtExact(sh, 3) + ' shallow',
          right: 'SET Z = +' + fmt(sh, 4) };
        if (Math.abs(v + sh) <= 0.0009) return { label: 'Sign flipped',
          your: 'minus puts the tip BELOW the top face — it is riding a shim ABOVE it',
          right: 'above zero is positive: +' + fmt(sh, 4) };
        return { label: 'Setup slip',
          your: signed(v, 4) + ' does not come from part top + shim',
          right: '0 + ' + fmtExact(sh, 3) + ' = +' + fmt(sh, 4) };
      } };
  };
  BANKS.m5 = function () {
    var CAP = FACTS.rpmMax, K = 3.82;
    var COMBOS = [
      { k: 'aluminumHSS', mat: 'aluminum', tool: 'HSS' },
      { k: 'aluminumCarbide', mat: 'aluminum', tool: 'carbide' },
      { k: 'steelHSS', mat: 'mild steel', tool: 'HSS' },
      { k: 'steelCarbide', mat: 'mild steel', tool: 'carbide' }];
    var DIAS = [[0.25, '1/4"'], [0.375, '3/8"'], [0.5, '1/2"'], [0.75, '3/4"'], [1, '1"']];
    function nf(x) { return String(Math.round(x * 1000) / 1000); }
    function nr(v, t) { return Math.abs(v - t) <= Math.max(2, Math.abs(t) * 0.015); }
    var kind = pick(['rpmCalc', 'rpmCalc', 'rpmCap', 'pickSfm']);
    if (kind === 'pickSfm') {
      var ci = Math.floor(Math.random() * COMBOS.length);
      var c = COMBOS[ci], val = FACTS.sfm[c.k];
      var choices = ['SFM ' + val];
      for (var i = 0; i < COMBOS.length; i++) if (i !== ci) choices.push('SFM ' + FACTS.sfm[COMBOS[i].k]);
      return { type: 'mc', a: 0, choices: choices, from: 'Module 5',
        q: 'Chart check: a <b>' + c.tool + '</b> end mill going into <b>' + c.mat + '</b>. Which starting point do you pull?',
        explain: 'Carbide runs faster than HSS; aluminum takes more speed than steel. ' + c.tool + ' in ' + c.mat +
          ' starts at <span class="num">' + val + ' SFM</span> — a starting point, not a law.',
        hint: 'The chart is a 2×2 grid: material picks the row, tool picks the column. Carbide beats HSS in the same metal; aluminum outruns steel with the same tool.',
        steps: COMBOS.map(function (co, i2) {
          var vv = FACTS.sfm[co.k];
          return (i2 === ci ? '<span class="res">' : '<span class="num">') + co.mat + ' · ' + co.tool + ' → ' + vv + ' SFM</span>' +
            (i2 === ci ? ' ← your cell' : '');
        }).join('<br>'),
        diagnose: function (chosen) {
          var pv = parseInt(String(choices[chosen]).replace(/\D/g, ''), 10);
          var pc = null;
          for (var i3 = 0; i3 < COMBOS.length; i3++) if (FACTS.sfm[COMBOS[i3].k] === pv) pc = COMBOS[i3];
          if (!pc) return null;
          return { label: pc.mat === c.mat ? 'Right material, wrong tool' : (pc.tool === c.tool ? 'Right tool, wrong material' : 'Wrong row AND wrong column'),
            your: 'SFM ' + pv + ' is the ' + pc.tool + '-in-' + pc.mat + ' cell of the chart',
            right: c.tool + ' in ' + c.mat + ' → SFM ' + val };
        } };
    }
    if (kind === 'rpmCap') {
      var caps = [];
      for (var a1 = 0; a1 < COMBOS.length; a1++) {
        var s1 = FACTS.sfm[COMBOS[a1].k];
        var smalls = [[0.125, '1/8"'], [0.1875, '3/16"']];
        for (var b1 = 0; b1 < smalls.length; b1++) {
          var raw1 = Math.round(s1 * K / smalls[b1][0]);
          if (raw1 > CAP + 300) caps.push({ c: COMBOS[a1], d: smalls[b1], raw: raw1 });
        }
      }
      var p1 = pick(caps), sC = FACTS.sfm[p1.c.k], dC = p1.d[0];
      return { type: 'num', a: CAP, tol: 1, unit: 'rpm', from: 'Module 5',
        q: 'Chart says <span class="num">' + sC + ' SFM</span> — ' + p1.c.tool + ' in ' + p1.c.mat + '. The end mill is ' +
          '<span class="num">' + p1.d[1] + '</span> (<span class="num">' + fmtExact(dC, 3) + '"</span>). The spindle maxes at ' +
          '<span class="num">' + CAP + ' RPM</span>. What do you actually run?',
        explain: 'The formula asks for ' + p1.raw + ' RPM; the machine only has ' + CAP + '. Run <span class="num">' + CAP + '</span>.',
        hint: 'Run SFM × 3.82 ÷ D as always, then hold the result against the machine max of ' + CAP + '. The smaller number wins.',
        steps: '1 · <span class="num">' + sC + '</span> × <span class="num">3.82</span> = <span class="num">' + nf(sC * K) + '</span><br>' +
          '2 · ÷ <span class="num">' + fmtExact(dC, 3) + '</span> = <span class="num">' + p1.raw + '</span><br>' +
          '3 · Over the ' + CAP + ' max → <span class="res">run ' + CAP + ' RPM</span>',
        diagnose: function (v) {
          if (nr(v, p1.raw)) return { label: 'Forgot the cap',
            your: p1.raw + ' is the raw formula number — no gear on this machine turns that fast',
            right: 'formula first, cap second: run ' + CAP };
          if (nr(v, sC / dC)) return { label: 'Skipped the 3.82',
            your: sC + ' ÷ ' + dC + ' = ' + nf(sC / dC) + ' — the 12 ÷ π conversion never happened',
            right: sC + ' × 3.82 ÷ ' + dC + ' = ' + p1.raw + ' → capped at ' + CAP };
          return { label: 'Formula error',
            your: nf(v) + ' is not SFM × 3.82 ÷ D (then cap-checked)',
            right: sC + ' × 3.82 ÷ ' + dC + ' = ' + p1.raw + ' → run ' + CAP };
        } };
    }
    var pool = [];
    var sfms = [90, 150, 250, 350, 400, 600];
    for (var a2 = 0; a2 < sfms.length; a2++) {
      for (var b2 = 0; b2 < DIAS.length; b2++) {
        var r2 = sfms[a2] * K / DIAS[b2][0];
        if (r2 >= 250 && r2 <= CAP - 60) pool.push([sfms[a2], DIAS[b2]]);
      }
    }
    var p2 = pick(pool), s2 = p2[0], d2 = p2[1][0];
    var a3 = Math.round(s2 * K / d2);
    return { type: 'num', a: a3, tol: 1, unit: 'rpm', from: 'Module 5',
      q: 'The chart says <span class="num">' + s2 + ' SFM</span>. The end mill is <span class="num">' + p2[1][1] +
        '</span> — <span class="num">' + fmtExact(d2, 3) + '"</span> across. What RPM do you dial in?',
      explain: s2 + ' × 3.82 ÷ ' + fmtExact(d2, 3) + ' = <span class="num">' + a3 + '</span> RPM — under the ' + CAP + ' cap.',
      hint: 'Multiply the SFM by 3.82 (that is 12 ÷ π), then divide by the diameter in inches. Cap-check against ' + CAP + ' to finish.',
      steps: '1 · RPM = SFM × 3.82 ÷ D<br>' +
        '2 · <span class="num">' + s2 + '</span> × <span class="num">3.82</span> = <span class="num">' + nf(s2 * K) + '</span><br>' +
        '3 · ÷ <span class="num">' + fmtExact(d2, 3) + '</span> = <span class="num">' + nf(s2 * K / d2) + '</span><br>' +
        '4 · Under ' + CAP + ' → <span class="res">' + a3 + ' RPM</span>',
      diagnose: function (v) {
        if (Math.abs(d2 - 1) > 0.001 && nr(v, s2 * K * d2)) return { label: 'Multiplied by the diameter',
          your: s2 + ' × 3.82 × ' + d2 + ' = ' + nf(s2 * K * d2) + ' — the diameter climbed on top',
          right: 'the diameter DIVIDES: ' + s2 + ' × 3.82 ÷ ' + d2 + ' = ' + a3 };
        if (nr(v, a3 * 2)) return { label: 'Divided by the radius',
          your: 'that is ÷ ' + nf(d2 / 2) + ' — the radius, half the tool',
          right: 'the formula wants the full diameter: ' + s2 + ' × 3.82 ÷ ' + d2 + ' = ' + a3 };
        if (nr(v, s2 / d2)) return { label: 'Skipped the 3.82',
          your: s2 + ' ÷ ' + d2 + ' = ' + nf(s2 / d2) + ' — the 12 ÷ π conversion never happened',
          right: s2 + ' × 3.82 ÷ ' + d2 + ' = ' + a3 };
        if (nr(v, a3 * 10) || nr(v, a3 / 10)) return { label: 'Decimal slip on the diameter',
          your: 'the diameter went in with its point in the wrong spot → ' + nf(v),
          right: s2 + ' × 3.82 ÷ ' + fmtExact(d2, 3) + ' = ' + a3 };
        return { label: 'Formula error',
          your: nf(v) + ' was not SFM × 3.82 ÷ D',
          right: s2 + ' × 3.82 ÷ ' + d2 + ' = ' + a3 };
      } };
  };

  BANKS.m6 = function () {
    var DIAS = [['0.125', '1/8"'], ['0.1875', '3/16"'], ['0.25', '1/4"'], ['0.375', '3/8"'], ['0.5', '1/2"'], ['0.75', '3/4"']];
    var RPMS = [600, 800, 1000, 1200, 1500, 1800, 2000, 2400, 3000, 3600];
    function r1(x) { return Math.round(x * 10) / 10; }
    function nf(x) { return String(Math.round(x * 10000) / 10000); }
    function nr(v, t) { return Math.abs(v - t) <= Math.max(0.15, Math.abs(t) * 0.02); }
    var kind = pick(['ipmCalc', 'ipmCalc', 'pickChip', 'backSolve']);
    if (kind === 'pickChip') {
      var ci = Math.floor(Math.random() * DIAS.length);
      var d = DIAS[ci], right = FACTS.chipload[d[0]];
      var choices = [nf(right) + '" / tooth'];
      var others = shuffle(DIAS.filter(function (x, i) { return i !== ci; })).slice(0, 3);
      for (var i = 0; i < others.length; i++) choices.push(nf(FACTS.chipload[others[i][0]]) + '" / tooth');
      return { type: 'mc', a: 0, choices: choices, from: 'Module 6',
        q: 'Chart check: what is the starting chip load for a <span class="num">' + d[1] + '</span> end mill?',
        explain: 'Bigger tools are stiffer and take bigger bites: a ' + d[1] + ' starts at <span class="num">' + nf(right) + '"</span> per tooth — a starting point, not a law.',
        hint: 'The chart runs with the tool: skinny tools take paper-thin bites, fat tools take bigger ones. Find the ' + d[1] + ' row.',
        steps: DIAS.map(function (x, i2) {
          return (i2 === ci ? '<span class="res">' : '<span class="num">') + x[1] + ' → ' + nf(FACTS.chipload[x[0]]) + '"</span>' + (i2 === ci ? ' ← your tool' : '');
        }).join('<br>'),
        diagnose: function (chosen) {
          var pv = parseFloat(String(choices[chosen]).replace('" / tooth', ''));
          var oc = null;
          for (var i3 = 0; i3 < DIAS.length; i3++) if (Math.abs(FACTS.chipload[DIAS[i3][0]] - pv) < 1e-9) oc = DIAS[i3];
          if (!oc) return null;
          return { label: 'Wrong row of the chart',
            your: nf(pv) + '" is the ' + oc[1] + ' starting bite',
            right: d[1] + ' starts at ' + nf(right) + '" per tooth' };
        } };
    }
    if (kind === 'backSolve') {
      var d2 = pick(DIAS), fl2 = pick([2, 3, 4]), rpm2 = pick(RPMS);
      var ipt2 = FACTS.chipload[d2[0]];
      var ipm2 = r1(rpm2 * fl2 * ipt2);
      return { type: 'num', a: ipt2, tol: 0.0003, unit: 'inches per tooth', from: 'Module 6',
        q: 'Reverse gear: the machine feeds <span class="num">' + ipm2.toFixed(1) + ' IPM</span> at <span class="num">' + rpm2 +
          ' RPM</span> with <span class="num">' + fl2 + '</span> flutes. What chip load is each tooth taking?',
        explain: 'Un-multiply: ' + ipm2.toFixed(1) + ' ÷ ' + rpm2 + ' ÷ ' + fl2 + ' = <span class="num">' + nf(ipt2) + '"</span> per tooth.',
        hint: 'Same formula driven backwards: ipt = IPM ÷ RPM ÷ flutes. Divide by BOTH the things that multiplied.',
        steps: '1 · ipt = IPM ÷ RPM ÷ flutes<br>' +
          '2 · <span class="num">' + ipm2.toFixed(1) + '</span> ÷ <span class="num">' + rpm2 + '</span> = <span class="num">' + nf(ipm2 / rpm2) + '</span> per rev<br>' +
          '3 · ÷ <span class="num">' + fl2 + '</span> teeth = <span class="res">' + nf(ipm2 / rpm2 / fl2) + '"</span> per tooth',
        diagnose: function (v) {
          if (Math.abs(v - ipm2 / rpm2) <= 0.0008 && fl2 !== 1) return { label: 'Stopped one divide short',
            your: nf(ipm2 / rpm2) + ' is per REVOLUTION — ' + fl2 + ' teeth share each rev',
            right: ipm2.toFixed(1) + ' ÷ ' + rpm2 + ' ÷ ' + fl2 + ' = ' + nf(ipt2) };
          if (Math.abs(v - ipt2 * 10) <= 0.002 || Math.abs(v - ipt2 / 10) <= 0.0002) return { label: 'Decimal slip',
            your: 'right digits, wrong spot: ' + nf(v),
            right: ipm2.toFixed(1) + ' ÷ ' + rpm2 + ' ÷ ' + fl2 + ' = ' + nf(ipt2) };
          return { label: 'Divide slip',
            your: nf(v) + ' is not IPM ÷ RPM ÷ flutes',
            right: ipm2.toFixed(1) + ' ÷ ' + rpm2 + ' ÷ ' + fl2 + ' = ' + nf(ipt2) };
        } };
    }
    var d3 = pick(DIAS), fl3 = pick([2, 2, 3, 4]), rpm3 = pick(RPMS);
    var ipt3 = FACTS.chipload[d3[0]];
    var a3 = r1(rpm3 * fl3 * ipt3);
    return { type: 'num', a: a3, tol: 0.1, unit: 'ipm', from: 'Module 6',
      q: 'A <span class="num">' + d3[1] + '</span> end mill with <span class="num">' + fl3 + '</span> flutes turns at ' +
        '<span class="num">' + rpm3 + ' RPM</span>, chip load <span class="num">' + nf(ipt3) + '"</span> per tooth. What feed do you dial in?',
      explain: rpm3 + ' × ' + fl3 + ' × ' + nf(ipt3) + ' = <span class="num">' + a3.toFixed(1) + '</span> IPM.',
      hint: 'Turns a minute × teeth per turn × inches per tooth — multiply straight through and the units cancel into inches per minute.',
      steps: '1 · IPM = RPM × flutes × chip load<br>' +
        '2 · <span class="num">' + rpm3 + '</span> × <span class="num">' + fl3 + '</span> = <span class="num">' + (rpm3 * fl3) + '</span> bites/min<br>' +
        '3 · × <span class="num">' + nf(ipt3) + '"</span> = <span class="res">' + a3.toFixed(1) + ' IPM</span>',
      diagnose: function (v) {
        if (nr(v, rpm3 * ipt3) && fl3 !== 1) return { label: 'Forgot the flutes',
          your: rpm3 + ' × ' + nf(ipt3) + ' = ' + r1(rpm3 * ipt3).toFixed(1) + ' — a one-tooth cutter; yours has ' + fl3,
          right: 'every tooth bites: ' + rpm3 + ' × ' + fl3 + ' × ' + nf(ipt3) + ' = ' + a3.toFixed(1) };
        if (nr(v, a3 * 10)) return { label: 'Decimal slip on the chip load — the tool-snapper',
          your: 'a 10× overfeed that breaks the tool in the first second of the cut',
          right: 'count the zeros twice: ' + rpm3 + ' × ' + fl3 + ' × ' + nf(ipt3) + ' = ' + a3.toFixed(1) };
        if (nr(v, a3 / 10)) return { label: 'Decimal slip on the chip load',
          your: 'a bite so thin the tool rubs and burns instead of cutting',
          right: rpm3 + ' × ' + fl3 + ' × ' + nf(ipt3) + ' = ' + a3.toFixed(1) };
        return { label: 'Formula error',
          your: 'whatever produced ' + r1(v).toFixed(1) + ' was not RPM × flutes × chip load',
          right: rpm3 + ' × ' + fl3 + ' × ' + nf(ipt3) + ' = ' + a3.toFixed(1) };
      } };
  };
  BANKS.m7 = function () {
    function n3(v) { return fmtExact(v, 3); }
    function nr(v, t) { return Math.abs(v - t) <= 0.35; }
    var kind = pick(['passCount', 'passCount', 'peckCount', 'stepover']);
    if (kind === 'peckCount') {
      var DR = [[0.125, '1/8"'], [0.25, '1/4"'], [0.375, '3/8"'], [0.5, '1/2"']];
      var dr = pick(DR);
      var mult = pick([3.4, 3.8, 4.2, 4.6, 5.2]);
      var dd = Math.round(dr[0] * mult * 1000) / 1000;
      var raw = dd / dr[0];
      var a = Math.ceil(raw - 1e-9);
      return { type: 'num', a: a, tol: 0.4, unit: 'pecks', from: 'Module 7',
        q: 'A <span class="num">' + dr[1] + '</span> drill has to reach <span class="num">' + n3(dd) + '"</span> deep — ' +
          'past three diameters, so you peck about one diameter per bite. How many pecks?',
        explain: n3(dd) + ' ÷ ' + n3(dr[0]) + ' = ' + (Math.round(raw * 10) / 10) + ' → round UP → <span class="num">' + a + '</span> pecks.',
        hint: 'One peck ≈ one diameter of depth (the common starting point). Divide, and remember a partial peck is still a trip down the hole.',
        steps: '1 · peck ≈ 1 × dia = <span class="num">' + n3(dr[0]) + '"</span><br>' +
          '2 · <span class="num">' + n3(dd) + '</span> ÷ <span class="num">' + n3(dr[0]) + '</span> = <span class="num">' + (Math.round(raw * 10) / 10) + '</span><br>' +
          '3 · Round UP → <span class="res">' + a + ' pecks</span>',
        diagnose: function (v) {
          if (nr(v, Math.floor(raw))) return { label: 'Rounded DOWN',
            your: Math.floor(raw) + ' pecks stops short of the bottom',
            right: 'the last partial bite is still a peck: ' + a };
          return { label: 'Divide slip',
            your: v + ' is not depth ÷ diameter rounded up',
            right: n3(dd) + ' ÷ ' + n3(dr[0]) + ' = ' + (Math.round(raw * 10) / 10) + ' → ' + a };
        } };
    }
    if (kind === 'stepover') {
      var combos = [
        { W: 1.500, D: 0.500, S: 0.250 }, { W: 2.000, D: 0.500, S: 0.250 },
        { W: 2.500, D: 0.500, S: 0.250 }, { W: 2.000, D: 0.375, S: 0.1875 },
        { W: 3.000, D: 0.750, S: 0.375 }];
      var c = pick(combos);
      var more = Math.ceil((c.W - c.D) / c.S - 1e-9);
      var aS = 1 + more;
      return { type: 'num', a: aS, tol: 0.4, unit: 'passes', from: 'Module 7',
        q: 'A pocket <span class="num">' + n3(c.W) + '"</span> wide, a <span class="num">' + n3(c.D) + '"</span> end mill, ' +
          'stepover <span class="num">' + n3(c.S) + '"</span>. How many passes to cover the width?',
        explain: 'First pass cuts a full ' + n3(c.D) + '; the rest advance ' + n3(c.S) + ' each: 1 + (' + n3(c.W) + ' − ' +
          n3(c.D) + ') ÷ ' + n3(c.S) + ' = <span class="num">' + aS + '</span>.',
        hint: 'Pass one is special — it cuts a full tool width. Handle it first, THEN divide what is left by the stepover and round up.',
        steps: '1 · Pass 1 covers <span class="num">' + n3(c.D) + '"</span><br>' +
          '2 · Left: ' + n3(c.W) + ' − ' + n3(c.D) + ' = <span class="num">' + n3(c.W - c.D) + '"</span><br>' +
          '3 · ÷ <span class="num">' + n3(c.S) + '</span> → round UP → ' + more + '<br>' +
          '4 · total = 1 + ' + more + ' = <span class="res">' + aS + ' passes</span>',
        diagnose: function (v) {
          if (nr(v, more)) return { label: 'Forgot pass one',
            your: more + ' only counts the stepover passes — the first full-width pass got left out',
            right: '1 + ' + more + ' = ' + aS };
          return { label: 'Coverage slip',
            your: v + ' is not 1 + (width − dia) ÷ stepover',
            right: '1 + (' + n3(c.W) + ' − ' + n3(c.D) + ') ÷ ' + n3(c.S) + ' = ' + aS };
        } };
    }
    var DEPTHS = [0.312, 0.437, 0.550, 0.625, 0.700, 0.850];
    var MAXES = [0.100, 0.125, 0.150, 0.200, 0.250];
    var d, mx, raw2;
    for (var t = 0; t < 40; t++) {
      d = pick(DEPTHS); mx = pick(MAXES); raw2 = d / mx;
      if (Math.abs(raw2 - Math.round(raw2)) > 0.05 && raw2 > 1.2 && raw2 < 9) break;
    }
    var aP = Math.ceil(raw2);
    var fl = Math.floor(raw2);
    return { type: 'num', a: aP, tol: 0.4, unit: 'passes', from: 'Module 7',
      q: 'A slot needs to end up <span class="num">' + n3(d) + '"</span> deep, at most <span class="num">' + n3(mx) +
        '"</span> per pass. How many passes?',
      explain: n3(d) + ' ÷ ' + n3(mx) + ' = ' + (Math.round(raw2 * 100) / 100) + ' → round UP → <span class="num">' + aP + '</span>.',
      hint: 'Divide the depth by the biggest bite you allow — then remember a partial pass is still a pass you have to make.',
      steps: '1 · passes = depth ÷ max per pass<br>' +
        '2 · <span class="num">' + n3(d) + '</span> ÷ <span class="num">' + n3(mx) + '</span> = <span class="num">' + (Math.round(raw2 * 100) / 100) + '</span><br>' +
        '3 · Round UP → <span class="res">' + aP + ' passes</span>',
      diagnose: function (v) {
        if (nr(v, fl)) return { label: 'Rounded DOWN — the part ships shallow',
          your: fl + ' passes only reaches ' + fmt(fl * mx, 3) + '" — the pocket ends short of the print',
          right: 'a partial pass is still a pass: round UP to ' + aP };
        return { label: 'Divide slip',
          your: v + ' is not depth ÷ max rounded up',
          right: n3(d) + ' ÷ ' + n3(mx) + ' = ' + (Math.round(raw2 * 100) / 100) + ' → ' + aP };
      } };
  };

  /* Daily 10: pull from all unlocked, built modules with a bank */
  function daily10Questions() {
    var eligible = MODULES.filter(function (m) { return m.built && isUnlocked(m.id) && BANKS[m.id]; });
    if (!eligible.length) return [];
    var qs = [];
    for (var k = 0; k < 10; k++) {
      var m = eligible[k % eligible.length];
      var q = BANKS[m.id]();
      q.moduleId = m.id;
      qs.push(q);
    }
    return shuffle(qs);
  }

  /* ---------------- module page chrome ----------------
     modulePage(id, {explainer, playground, practiceQs(), quizQs()})
     Builds the 4-part tab structure into #mmt-root and wires pass/unlock. */
  function modulePage(id, parts) {
    var mod = MODULES[moduleIndex(id)];
    var root = document.getElementById('mmt-root');
    var TABS = [
      ['1', 'EXPLAINER'], ['2', 'PLAYGROUND'], ['3', 'PRACTICE'], ['4', 'QUIZ'],
    ];
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
      calcAllow(k !== 3);
      panes.innerHTML = '';
      if (k === 0) { panes.innerHTML = parts.explainer; }
      if (k === 1) { parts.playground(panes); }
      if (k === 2) {
        var c = document.createElement('div');
        c.className = 'card'; c.innerHTML = '<h2>Practice — stuck? tap WHERE DO I START · mistakes get named</h2><div class="body"></div>';
        var setOpts = { mode: 'practice', title: 'PRACTICE', questions: parts.practiceQs() };
        if (parts.coach) {
          var split = document.createElement('div');
          split.className = 'practice-split';
          var qa = document.createElement('div');
          qa.appendChild(c);
          var coachEl = document.createElement('div');
          var coach = coachPanel(coachEl, parts.coach);
          split.appendChild(qa);
          split.appendChild(coachEl);
          panes.appendChild(split);
          setOpts.onQuestion = coach.notifyQuestion;
          setOpts.onMiss = coach.notifyMiss;
        } else {
          panes.appendChild(c);
        }
        runSet(c.querySelector('.body'), setOpts);
      }
      if (k === 3) {
        var c2 = document.createElement('div');
        c2.className = 'card'; c2.innerHTML = '<h2>Quiz — 90% marks this module done</h2><div class="body"></div>';
        panes.appendChild(c2);
        runSet(c2.querySelector('.body'), {
          mode: 'quiz', title: 'QUIZ', questions: parts.quizQs(), passPct: 90,
          onFinish: function (pct) {
            recordQuiz(id, pct);
            var r = rec(id);
            var next = MODULES[moduleIndex(id) + 1];
            var extra = document.createElement('div');
            extra.className = 'callout' + (pct >= 90 ? '' : ' warn');
            extra.innerHTML = pct >= 90
              ? '<b>Module ' + mod.n + ' complete.</b> ' +
                (next ? (next.built ? 'Module ' + next.n + ' — ' + esc(next.title) + ' — is now unlocked on the hub.'
                                    : 'Module ' + next.n + ' is unlocked and will appear on the hub as soon as it is built.')
                      : 'That was the last module.') +
                ' Best score: ' + r.best + '%. <a href="../index.html">Back to the hub →</a>'
              : 'Best so far: ' + r.best + '%. Scores only ever go up — replay any part and quiz again. ' +
                '<a href="../index.html">Hub →</a>';
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

  /* ---------------- built-in shop calculator ----------------
     A floating CALC button on every page. Immediate-execution four-function
     (works left to right, like the cheap calculator in a shop apron pocket).
     Teaching rules still apply: the tape line shows the running expression,
     and the "means" line translates the value into thou / nearest fraction.
     Hidden while a quiz is on screen — the quiz gate stays honest. */
  var CALC_SYM = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  function calcFmt(v) {
    if (typeof v !== 'number' || !isFinite(v)) return 'ERR';
    var s = String(parseFloat(v.toPrecision(11)));
    if (s.replace(/[-.]/g, '').length > 11) s = String(parseFloat(v.toPrecision(8)));
    return s;
  }
  function calcMeans(v) {
    if (typeof v !== 'number' || !isFinite(v)) return '';
    var av = Math.abs(v);
    if (v === 0 || av >= 100 || v === Math.round(v)) return '';
    var bits = [];
    if (av < 10) {
      var thou = Math.round(v * 1e6) / 1000;
      bits.push('= <b>' + calcFmt(thou) + ' thou</b>');
      if (av < 0.010 && thou !== Math.round(thou)) {
        bits.push('= <b>' + calcFmt(Math.round(v * 1e8) / 1e4) + ' tenths</b>');
      }
    }
    var n64 = v * 64;
    if (Math.abs(n64 - Math.round(n64)) < 1e-9 && Math.round(Math.abs(n64)) % 64 !== 0) {
      var whole = Math.floor(av), rest = Math.round((av - whole) * 64);
      bits.push('= <b>' + (v < 0 ? '−' : '') + (whole ? whole + ' ' : '') +
        fracStr(rest, 64) + '"</b> exactly');
    }
    return bits.join(' &nbsp;·&nbsp; ');
  }
  function calcSpeak(v) {
    if (typeof v !== 'number' || !isFinite(v)) return;
    var av = Math.abs(v);
    if (av > 0 && av < 10 && v !== Math.round(v)) speakText(sayMeasure(v).shop);
    else if (v === Math.round(v) && av < 1e6) speakText((v < 0 ? 'minus ' : '') + intWords(av));
    else speakText(digitWords(calcFmt(v)));
  }
  function calcMount() {
    if (!document.body || document.getElementById('mmt-calc-fab')) return;
    var C = { acc: null, op: null, entry: '0', fresh: true, expr: '', done: false };

    var fab = document.createElement('button');
    fab.id = 'mmt-calc-fab';
    fab.className = 'calc-fab';
    fab.setAttribute('aria-label', 'Open the calculator');
    fab.innerHTML = 'CALC';
    var panel = document.createElement('div');
    panel.className = 'calc';
    panel.style.display = 'none';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Shop calculator');
    var KEYS = [
      ['ac', 'AC', 'fn'], ['bs', '⌫', 'fn'], ['pm', '±', 'fn'], ['/', '÷', 'op'],
      ['7', '7', ''], ['8', '8', ''], ['9', '9', ''], ['*', '×', 'op'],
      ['4', '4', ''], ['5', '5', ''], ['6', '6', ''], ['-', '−', 'op'],
      ['1', '1', ''], ['2', '2', ''], ['3', '3', ''], ['+', '+', 'op'],
      ['say', '🔊', 'fn'], ['0', '0', ''], ['.', '.', ''], ['=', '=', 'eq'],
    ];
    panel.innerHTML =
      '<div class="calc-head"><span>SHOP CALCULATOR</span>' +
      '<button data-k="close" aria-label="Close calculator">✕</button></div>' +
      '<div class="calc-screen"><div class="calc-expr" data-expr>&nbsp;</div>' +
      '<div class="calc-val" data-val>0</div></div>' +
      '<div class="calc-means" data-means>&nbsp;</div>' +
      '<div class="calc-keys">' + KEYS.map(function (k) {
        return '<button data-k="' + k[0] + '"' + (k[2] ? ' class="' + k[2] + '"' : '') +
          ' aria-label="' + (k[0] === 'say' ? 'Say this number out loud' : k[1]) + '">' + k[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="calc-foot">Scratch math only — answers still go in the answer box. ' +
      'Type on your keyboard too. Closed during quizzes.</div>';

    function apply(a, o, b) {
      if (o === '+') return a + b;
      if (o === '-') return a - b;
      if (o === '*') return a * b;
      return b === 0 ? NaN : a / b;
    }
    function draw() {
      panel.querySelector('[data-expr]').textContent = C.expr || ' ';
      panel.querySelector('[data-val]').textContent = C.entry;
      var means = C.entry === 'ERR'
        ? 'you divided by zero — no answer exists. AC to clear.'
        : calcMeans(parseFloat(C.entry));
      panel.querySelector('[data-means]').innerHTML = means || '&nbsp;';
    }
    function press(k) {
      if (/^[0-9.]$/.test(k)) {
        if (C.done || C.entry === 'ERR') { C.expr = ''; C.done = false; C.acc = null; C.op = null; C.fresh = true; }
        if (C.fresh) { C.entry = (k === '.') ? '0.' : k; C.fresh = false; }
        else if (k === '.' && C.entry.indexOf('.') >= 0) return;
        else if (C.entry.replace(/[-.]/g, '').length >= 10) return;
        else C.entry = (C.entry === '0' && k !== '.') ? k : C.entry + k;
      } else if (k === '+' || k === '-' || k === '*' || k === '/') {
        if (C.entry === 'ERR') return;
        if (C.done) { C.expr = ''; C.done = false; }
        if (C.fresh && C.op !== null) {
          C.op = k;
          C.expr = C.expr.replace(/[+−×÷]$/, CALC_SYM[k]);
        } else {
          var v = parseFloat(C.entry);
          C.acc = (C.op !== null && C.acc !== null) ? apply(C.acc, C.op, v) : v;
          C.expr = (C.expr ? C.expr + ' ' : '') + calcFmt(v) + ' ' + CALC_SYM[k];
          C.op = k; C.entry = calcFmt(C.acc); C.fresh = true;
          if (C.entry === 'ERR') { C.acc = null; C.op = null; C.expr += ' → ERR'; C.done = true; }
        }
      } else if (k === '=') {
        if (C.op === null || C.acc === null || C.entry === 'ERR') return;
        var b = parseFloat(C.entry);
        var r = apply(C.acc, C.op, b);
        C.expr = C.expr + ' ' + calcFmt(b) + ' =';
        C.entry = calcFmt(r);
        C.acc = isFinite(r) ? r : null;
        C.op = null; C.fresh = true; C.done = true;
      } else if (k === 'ac') {
        C.acc = null; C.op = null; C.entry = '0'; C.fresh = true; C.expr = ''; C.done = false;
      } else if (k === 'bs') {
        if (!C.fresh && C.entry !== 'ERR') {
          C.entry = C.entry.slice(0, -1);
          if (C.entry === '' || C.entry === '-') C.entry = '0';
        }
      } else if (k === 'pm') {
        if (C.entry !== '0' && C.entry !== 'ERR') {
          C.entry = C.entry.charAt(0) === '-' ? C.entry.slice(1) : '-' + C.entry;
          if (C.fresh && C.op === null) C.acc = parseFloat(C.entry);
        }
      } else if (k === 'say') {
        calcSpeak(parseFloat(C.entry));
        return;
      }
      draw();
    }
    function setOpen(open) {
      panel.style.display = open ? 'block' : 'none';
      fab.classList.toggle('open', open);
      if (open) draw();
    }
    fab.addEventListener('click', function () { setOpen(panel.style.display === 'none'); });
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]');
      if (!b) return;
      if (b.dataset.k === 'close') { setOpen(false); return; }
      press(b.dataset.k);
    });
    document.addEventListener('keydown', function (e) {
      if (panel.style.display === 'none') return;
      if (e.key === 'Escape') { setOpen(false); e.stopPropagation(); return; }
      var tag = (e.target.tagName || '').toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return;
      var k = e.key;
      if (k === 'Enter' || k === '=') k = '=';
      else if (k === 'x' || k === 'X') k = '*';
      else if (k === 'Backspace') k = 'bs';
      else if (k === 'Delete' || k === 'c' || k === 'C') k = 'ac';
      else if (!/^[0-9.+\-*/]$/.test(k)) return;
      e.preventDefault();
      press(k);
    }, true);
    document.body.appendChild(fab);
    document.body.appendChild(panel);
  }
  /* modulePage hides the calculator while the quiz tab is up */
  function calcAllow(yes) {
    var fab = document.getElementById('mmt-calc-fab');
    if (!fab) return;
    fab.style.display = yes ? '' : 'none';
    if (!yes) {
      var panel = document.querySelector('.calc');
      if (panel) { panel.style.display = 'none'; fab.classList.remove('open'); }
    }
  }
  if (document.body) calcMount();
  else document.addEventListener('DOMContentLoaded', calcMount);

  /* ---------------- export ---------------- */
  window.MMT = {
    MODULES: MODULES, FACTS: FACTS, BANKS: BANKS,
    state: state, save: save, rec: rec,
    recordQuiz: recordQuiz, nudge: nudge, isUnlocked: isUnlocked,
    fmt: fmt, fmtExact: fmtExact, signed: signed,
    intWords: intWords, digitWords: digitWords, sayMeasure: sayMeasure,
    sayFraction: sayFraction, spokenFromHtml: spokenFromHtml, speakText: speakText,
    gcd: gcd, reduceFrac: reduceFrac, fracStr: fracStr,
    parseNum: parseNum, shuffle: shuffle, pick: pick, esc: esc,
    dro: dro, runSet: runSet, daily10Questions: daily10Questions,
    modulePage: modulePage, coachPanel: coachPanel, sayAnswerQ: sayAnswer,
    calcMount: calcMount, calcAllow: calcAllow,
  };
})();
