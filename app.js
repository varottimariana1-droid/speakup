(function () {
  'use strict';

  const app = document.getElementById('app');
  const $ = (sel, el) => (el || document).querySelector(sel);

  /* ---------- utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const PRAISE = ['Isso mesmo! 🎉', 'Muito bem! 👏', 'Arrasou! ⭐', 'Perfeito! 🙌', 'Boa! 💪'];
  const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

  /* ---------- progresso (salvo no aparelho) ---------- */
  const KEY = 'speakup-v1';
  const fresh = () => ({ name: '', askedName: false, words: {}, stars: {}, learned: {}, streak: { count: 0, last: '' } });
  let state = load();
  function load() {
    try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return fresh(); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* sem armazenamento */ } }

  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function touchStreak() {
    const now = new Date(), t = ymd(now);
    if (state.streak.last === t) return;
    const y = new Date(now); y.setDate(y.getDate() - 1);
    state.streak.count = state.streak.last === ymd(y) ? state.streak.count + 1 : 1;
    state.streak.last = t;
    save();
  }
  function streakNow() {
    const now = new Date(), y = new Date(now); y.setDate(y.getDate() - 1);
    return [ymd(now), ymd(y)].includes(state.streak.last) ? state.streak.count : 0;
  }

  const wid = (t, w) => t.id + ':' + w.en;
  const getW = id => state.words[id] || (state.words[id] = { lvl: 0, right: 0, wrong: 0 });
  function mark(t, w, ok) {
    const s = getW(wid(t, w));
    if (ok) { s.right++; s.lvl = Math.min(3, s.lvl + 1); } else { s.wrong++; s.lvl = Math.max(0, s.lvl - 1); }
    save();
  }
  function reviewList() {
    const out = [];
    THEMES.forEach(t => t.words.forEach(w => {
      const s = state.words[wid(t, w)];
      if (s && s.wrong > 0 && s.lvl < 2) out.push({ t, w });
    }));
    return out;
  }
  const MODE_KEYS = ['quiz', 'memory', 'fill'];
  const themeStars = t => MODE_KEYS.reduce((n, m) => n + (state.stars[t.id + ':' + m] || 0), 0);
  const totalStars = () => Object.values(state.stars).reduce((a, b) => a + b, 0);
  function saveStars(key, n) { if (n > (state.stars[key] || 0)) { state.stars[key] = n; save(); } }
  const starsFor = (right, total) => { const p = right / total; return p === 1 ? 3 : p >= 0.8 ? 2 : p >= 0.5 ? 1 : 0; };
  const starsHTML = n => `<span class="stars" role="img" aria-label="${n} de 3 estrelas">${'★'.repeat(n)}${'☆'.repeat(3 - n)}</span>`;

  /* ---------- áudio (voz do próprio navegador) ---------- */
  const hasTTS = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  let voice = null;
  function pickVoice() {
    if (!hasTTS) return;
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    const prefs = [/samantha/i, /google us english/i, /aria|jenny|guy/i, /karen|daniel|moira/i];
    voice = null;
    for (const p of prefs) { voice = vs.find(v => p.test(v.name) && /en[-_](US|GB|AU)/i.test(v.lang)); if (voice) break; }
    voice = voice || vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text, slow) {
    if (!hasTTS) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      if (voice) u.voice = voice;
      u.rate = slow ? 0.55 : 0.85;
      speechSynthesis.speak(u);
    } catch (e) { /* sem áudio */ }
  }

  /* ---------- casca da página ---------- */
  let cleanup = null;
  function setHeader(h) {
    const back = $('#back'), ttl = $('#ttl');
    if (!h) { back.classList.add('is-hidden'); ttl.textContent = '🗣️ Speak Up'; }
    else { back.classList.remove('is-hidden'); back.href = h.back; back.textContent = h.backLabel || '← Voltar'; ttl.textContent = h.title || ''; }
    $('#st-stars').textContent = '⭐ ' + totalStars();
    $('#st-streak').textContent = '🔥 ' + streakNow();
  }
  function mount(html, head, keepScroll) {
    app.innerHTML = html;
    setHeader(head);
    if (!keepScroll) window.scrollTo(0, 0);
    const f = $('[data-focus]', app);
    if (f) f.focus({ preventScroll: true });
  }

  /* ---------- rotas ---------- */
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    if (hasTTS) speechSynthesis.cancel();
    app.onclick = null; app.onsubmit = null;
    const [a, b, c] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (a === 'review') return viewReview();
    if (a === 't') {
      const t = THEMES.find(x => x.id === b);
      if (!t) return viewHome();
      const views = { learn: viewLearn, quiz: viewQuiz, memory: viewMemory, fill: viewFill };
      return c && views[c] ? views[c](t) : viewTheme(t);
    }
    viewHome();
  }
  window.addEventListener('hashchange', route);

  /* ---------- início ---------- */
  function viewHome() {
    const rev = reviewList().length;
    const nameCard = state.askedName ? '' : `
      <form class="name-card" id="nameForm">
        <label for="nm">Como você se chama?</label>
        <div class="row">
          <input id="nm" name="nm" maxlength="20" autocomplete="given-name" placeholder="Seu nome">
          <button class="btn btn-primary" type="submit">Salvar</button>
          <button class="btn" type="button" data-act="skipname">Pular</button>
        </div>
      </form>`;
    mount(`
      <section class="hero">
        <h1 tabindex="-1" data-focus>${state.name ? 'Oi, ' + esc(state.name) + '! 👋' : 'Oi! 👋'}</h1>
        <p>Escolha um tema e aprenda inglês. Toque no 🔊 para ouvir como se fala.</p>
      </section>
      ${nameCard}
      ${rev ? `<a class="review" href="#/review"><span class="ico" aria-hidden="true">🔁</span><span><b>Revisar palavras difíceis</b><small>${rev} ${rev === 1 ? 'palavra' : 'palavras'} para treinar</small></span></a>` : ''}
      <h2 class="section-title">Temas</h2>
      <div class="themes">
        ${THEMES.map(t => {
          const s = themeStars(t);
          return `<a class="tcard" href="#/t/${t.id}" style="--tc:${t.color}">
            <span class="tc-emoji" aria-hidden="true">${t.emoji}</span>
            <span class="tc-name">${esc(t.name)}</span>
            <span class="tc-en" lang="en">${esc(t.en)}</span>
            <span class="bar" aria-hidden="true"><i style="width:${Math.round(s / 9 * 100)}%"></i></span>
            <span class="tc-stars">⭐ ${s} de 9</span>
          </a>`;
        }).join('')}
      </div>
      ${hasTTS ? '' : '<p class="notice">Este navegador não consegue falar as palavras. Tente o Chrome, o Safari ou o Edge.</p>'}
      <p class="footnote">Dica: se não ouvir nada, aumente o volume e, no iPhone, desligue o modo silencioso.</p>
    `);
    app.onclick = e => {
      if (e.target.closest('[data-act="skipname"]')) { state.askedName = true; save(); viewHome(); }
    };
    app.onsubmit = e => {
      e.preventDefault();
      state.name = ($('#nm').value || '').trim().slice(0, 20);
      state.askedName = true; save(); viewHome();
    };
  }

  /* ---------- página do tema ---------- */
  const MODES = [
    { id: 'learn', ico: '🃏', name: 'Aprender', desc: 'Veja, ouça e repita cada palavra' },
    { id: 'quiz', ico: '🎧', name: 'Ouvir e escolher', desc: 'Ouça a palavra e toque na resposta' },
    { id: 'memory', ico: '🧩', name: 'Jogo da memória', desc: 'Encontre os pares' },
    { id: 'fill', ico: '✏️', name: 'Completar a frase', desc: 'Escolha a palavra que falta' }
  ];
  function viewTheme(t) {
    mount(`
      <section class="theme-hero" style="--tc:${t.color}">
        <div class="th-emoji" aria-hidden="true">${t.emoji}</div>
        <div><h1 tabindex="-1" data-focus>${esc(t.name)}</h1><p lang="en">${esc(t.en)} · ${t.words.length} palavras</p></div>
      </section>
      <div class="modes">
        ${MODES.map(m => {
          const right = m.id === 'learn'
            ? (state.learned[t.id] ? '<span class="done-badge">✓ Visto</span>' : '')
            : starsHTML(state.stars[t.id + ':' + m.id] || 0);
          return `<a class="mode" href="#/t/${t.id}/${m.id}">
            <span class="mode-ico" aria-hidden="true">${m.ico}</span>
            <span class="mode-txt"><b>${m.name}</b><small>${m.desc}</small></span>${right}
          </a>`;
        }).join('')}
      </div>
      <details class="wordlist">
        <summary>📖 Ver todas as palavras</summary>
        <ul>
          ${t.words.map(w => `<li><button class="wrow" data-say="${esc(w.en)}" aria-label="Ouvir ${esc(w.en)}">
            <span class="we" aria-hidden="true">${w.e}</span>
            <span class="wt"><b lang="en">${esc(w.en)}</b><span>(${esc(w.pron)})</span><small>${esc(w.pt)}</small></span>
            <span class="wi" aria-hidden="true">🔊</span></button></li>`).join('')}
        </ul>
      </details>
    `, { back: '#/', backLabel: '← Início', title: t.name });
    app.onclick = e => {
      const s = e.target.closest('[data-say]');
      if (s) speak(s.dataset.say);
    };
  }

  /* ---------- modo Aprender ---------- */
  function viewLearn(t) {
    const head = { back: '#/t/' + t.id, backLabel: '← Voltar', title: 'Aprender' };
    let i = 0;
    const seen = new Set([0]);
    draw(false);

    function draw(say) {
      const w = t.words[i], n = t.words.length;
      mount(`
        <div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${n}" aria-valuenow="${i + 1}"><i style="width:${(i + 1) / n * 100}%"></i></div>
        <p class="counter">Palavra ${i + 1} de ${n}</p>
        <article class="learn-card" style="--tc:${t.color}">
          <span class="big-emoji" aria-hidden="true">${w.e}</span>
          <h1 class="word" lang="en" tabindex="-1" data-focus>${esc(w.en)}</h1>
          <p class="pron">(${esc(w.pron)})</p>
          <p class="pt">${esc(w.pt)}</p>
          <div class="row">
            <button class="btn btn-speak btn-lg" data-act="say">🔊 Ouvir</button>
            <button class="btn btn-lg" data-act="slow">🐢 Devagar</button>
          </div>
        </article>
        <div class="nav-row">
          <button class="btn" data-act="prev" ${i === 0 ? 'disabled' : ''}>← Anterior</button>
          <button class="btn btn-primary" data-act="next">${i === n - 1 ? 'Concluir ✓' : 'Próxima →'}</button>
        </div>
      `, head, true);
      if (say) speak(w.en);
    }
    function finish() {
      state.learned[t.id] = true; touchStreak(); save();
      mount(`
        <div class="empty">
          <span class="big-emoji" aria-hidden="true">🎉</span>
          <h1 tabindex="-1" data-focus>Você viu todas as palavras!</h1>
          <p>Agora vamos praticar para fixar.</p>
          <div class="row">
            <a class="btn btn-primary btn-lg" href="#/t/${t.id}/quiz">🎧 Praticar agora</a>
            <a class="btn btn-lg" href="#/t/${t.id}">Voltar ao tema</a>
          </div>
        </div>`, head);
    }
    function go(step) {
      const n = t.words.length;
      if (step > 0 && i === n - 1) return finish();
      i = Math.max(0, Math.min(n - 1, i + step));
      seen.add(i);
      draw(true);
    }
    app.onclick = e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const act = b.dataset.act, w = t.words[i];
      if (act === 'say') speak(w.en);
      else if (act === 'slow') speak(w.en, true);
      else if (act === 'next') go(1);
      else if (act === 'prev') go(-1);
    };
    const onKey = e => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    cleanup = () => document.removeEventListener('keydown', onKey);
  }

  /* ---------- tela de resultado (todos os modos) ---------- */
  function resultView(o) {
    touchStreak();
    const msgs = ['Sem problema! Errar faz parte de aprender.', 'Bom começo! Tente mais uma vez.', 'Muito bem! Falta pouco para a nota máxima.', 'Perfeito! Você mandou muito bem!'];
    const trophy = o.stars >= 3 ? '🏆' : o.stars === 2 ? '🎉' : o.stars === 1 ? '👍' : '💪';
    const uniq = [];
    (o.missed || []).forEach(m => { if (!uniq.includes(m)) uniq.push(m); });
    mount(`
      <section class="result">
        <div class="trophy" aria-hidden="true">${trophy}</div>
        <h1 tabindex="-1" data-focus>${esc(o.summary)}</h1>
        ${o.stars === null ? '' : `<div class="big-stars" role="img" aria-label="${o.stars} de 3 estrelas">${'★'.repeat(o.stars)}<span class="off">${'★'.repeat(3 - o.stars)}</span></div><p>${msgs[o.stars]}</p>`}
        ${uniq.length ? `<div class="missed"><h2>Palavras para treinar</h2><div class="chips">
          ${uniq.map(m => `<button class="chip" data-say="${esc(m.w.en)}">🔊 <span lang="en">${esc(m.w.en)}</span><small>(${esc(m.w.pron)}) ${esc(m.w.pt)}</small></button>`).join('')}
        </div></div>` : ''}
        <div class="row">
          <button class="btn btn-primary btn-lg" data-act="again">🔁 Jogar de novo</button>
          <a class="btn btn-lg" href="${o.exit}">${esc(o.exitLabel)}</a>
        </div>
      </section>`, o.head);
    app.onclick = e => {
      const s = e.target.closest('[data-say]');
      if (s) return speak(s.dataset.say);
      if (e.target.closest('[data-act="again"]')) o.again();
    };
  }

  /* ---------- modo Ouvir e escolher (e revisão) ---------- */
  function makeQuestions(items, n) {
    const picked = items
      .map(it => ({ it, k: getW(wid(it.t, it.w)).lvl + Math.random() * 1.5 }))
      .sort((a, b) => a.k - b.k).slice(0, n).map(x => x.it);
    return shuffle(picked).map((it, i) => ({
      t: it.t, w: it.w,
      type: i % 2 === 0 ? 'listen' : 'see',
      options: shuffle([it.w, ...shuffle(it.t.words.filter(x => x !== it.w)).slice(0, 3)])
    }));
  }

  function runQuiz(cfg) {
    const qs = cfg.qs, total = qs.length;
    let i = 0, right = 0;
    const missed = [];
    show();

    function show() {
      const q = qs[i], style = q.t.style;
      const head = cfg.head;
      const top = `
        <div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${i + 1}"><i style="width:${i / total * 100}%"></i></div>
        <p class="counter">Pergunta ${i + 1} de ${total}</p>`;
      const prompt = q.type === 'listen'
        ? `<h1 class="q-title" tabindex="-1" data-focus>Ouça e toque na resposta certa</h1>
           <div class="row"><button class="btn btn-speak btn-lg" data-act="say">🔊 Ouvir</button><button class="btn btn-lg" data-act="slow">🐢 Devagar</button></div>`
        : `<h1 class="q-title" tabindex="-1" data-focus>Como se diz em inglês?</h1>
           <div class="prompt">${style === 'emoji'
             ? `<span class="pe" aria-hidden="true">${q.w.e}</span><span class="sr">${esc(q.w.pt)}</span>`
             : `<span class="pt-big">${esc(q.w.pt)}</span>`}</div>`;
      const opts = q.options.map((o, idx) => {
        if (q.type === 'see') return `<button class="opt" data-i="${idx}" lang="en">${esc(o.en)}</button>`;
        return style === 'emoji'
          ? `<button class="opt opt-emoji" data-i="${idx}" aria-label="${esc(o.pt)}"><span aria-hidden="true">${o.e}</span></button>`
          : `<button class="opt" data-i="${idx}">${esc(o.pt)}</button>`;
      }).join('');
      const cls = q.type === 'listen' && style === 'emoji' ? 'emoji' : 'text two';
      mount(`${top}<div class="qwrap">${prompt}<div class="options ${cls}">${opts}</div><div id="fb" role="status" aria-live="polite"></div></div>`, head, true);
      window.scrollTo(0, 0);
      if (q.type === 'listen') speak(q.w.en);

      let answered = false;
      app.onclick = e => {
        const act = e.target.closest('[data-act]');
        if (act && act.dataset.act === 'say') return speak(q.w.en);
        if (act && act.dataset.act === 'slow') return speak(q.w.en, true);
        if (act && act.dataset.act === 'next') return next();
        const o = e.target.closest('.opt');
        if (o && !answered) { answered = true; answer(+o.dataset.i); }
      };

      function answer(idx) {
        const ok = q.options[idx] === q.w;
        app.querySelectorAll('.opt').forEach((b, j) => {
          b.classList.add('locked');
          if (q.options[j] === q.w) b.classList.add('correct');
          else if (j === idx) b.classList.add('wrong');
        });
        mark(q.t, q.w, ok);
        if (ok) right++; else missed.push(q);
        $('#fb').innerHTML = `
          <div class="feedback ${ok ? 'good' : 'bad'}">
            <div class="fb-text">
              <strong>${ok ? praise() : 'Quase! Era esta:'}</strong>
              <span><span lang="en">${esc(q.w.en)}</span> (${esc(q.w.pron)}) = ${esc(q.w.pt)}</span>
            </div>
            <button class="btn btn-icon" data-act="say" aria-label="Ouvir de novo">🔊</button>
            <button class="btn btn-primary" data-act="next">${i === total - 1 ? 'Ver resultado' : 'Continuar'}</button>
          </div>`;
        speak(q.w.en);
        $('#fb [data-act="next"]').focus({ preventScroll: true });
        $('#fb').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      function next() {
        if (i < total - 1) { i++; show(); } else finish();
      }
    }
    function finish() {
      const stars = cfg.onFinish(right, total);
      resultView({
        head: cfg.head, stars, missed,
        summary: `${right} de ${total} certas`,
        again: cfg.again, exit: cfg.exit, exitLabel: cfg.exitLabel
      });
    }
  }

  function viewQuiz(t) {
    runQuiz({
      qs: makeQuestions(t.words.map(w => ({ t, w })), 8),
      head: { back: '#/t/' + t.id, backLabel: '← Voltar', title: 'Ouvir e escolher' },
      onFinish: (r, n) => { const s = starsFor(r, n); saveStars(t.id + ':quiz', s); return s; },
      again: () => viewQuiz(t), exit: '#/t/' + t.id, exitLabel: 'Voltar ao tema'
    });
  }

  function viewReview() {
    const list = reviewList();
    const head = { back: '#/', backLabel: '← Início', title: 'Revisão' };
    if (!list.length) {
      mount(`<div class="empty"><span class="big-emoji" aria-hidden="true">🌟</span>
        <h1 tabindex="-1" data-focus>Nada para revisar por enquanto</h1>
        <p>As palavras que você errar aparecem aqui para treinar de novo.</p>
        <a class="btn btn-primary btn-lg" href="#/">Escolher um tema</a></div>`, head);
      return;
    }
    runQuiz({
      qs: makeQuestions(list, 10), head,
      onFinish: () => null,
      again: viewReview, exit: '#/', exitLabel: 'Voltar ao início'
    });
  }

  /* ---------- modo Jogo da memória ---------- */
  function viewMemory(t) {
    const head = { back: '#/t/' + t.id, backLabel: '← Voltar', title: 'Jogo da memória' };
    const pairs = shuffle(t.words).slice(0, 6);
    const cards = shuffle(pairs.flatMap(w => [{ w, side: 'en' }, { w, side: 'pic' }]));
    const emoji = t.style === 'emoji';
    let first = null, lock = false, moves = 0, matched = 0;

    const face = c => c.side === 'en'
      ? `<span class="back txt" lang="en">${esc(c.w.en)}</span>`
      : (emoji ? `<span class="back">${c.w.e}</span>` : `<span class="back txt">${esc(c.w.pt)}</span>`);
    const label = c => c.side === 'en' ? c.w.en : (emoji ? c.w.pt : c.w.pt);

    mount(`
      <h1 class="q-title" tabindex="-1" data-focus>Encontre os pares</h1>
      <p class="counter" style="margin-top:-8px">Combine a palavra em inglês com ${emoji ? 'a figura' : 'o significado'}.</p>
      <div class="mem-info"><span id="mv">Jogadas: 0</span><span id="pr">Pares: 0 de 6</span></div>
      <div class="mem-grid">
        ${cards.map((c, i) => `<button class="mcard" data-i="${i}" aria-label="Carta virada para baixo"><span class="front" aria-hidden="true">?</span>${face(c).replace('<span', '<span aria-hidden="true"')}</button>`).join('')}
      </div>
    `, head);

    const els = () => app.querySelectorAll('.mcard');
    const unflip = i => { const el = els()[i]; el.classList.remove('flipped'); el.setAttribute('aria-label', 'Carta virada para baixo'); };

    app.onclick = e => {
      const el = e.target.closest('.mcard');
      if (!el || lock) return;
      const i = +el.dataset.i, c = cards[i];
      if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
      el.classList.add('flipped');
      el.setAttribute('aria-label', label(c));
      if (c.side === 'en') speak(c.w.en);
      if (first === null) { first = i; return; }

      moves++; $('#mv').textContent = 'Jogadas: ' + moves;
      const a = cards[first], j = first;
      first = null;
      if (a.w === c.w && a.side !== c.side) {
        [j, i].forEach(k => { const x = els()[k]; x.classList.remove('flipped'); x.classList.add('matched'); });
        mark(t, c.w, true);
        matched++; $('#pr').textContent = 'Pares: ' + matched + ' de 6';
        if (matched === 6) setTimeout(done, 900);
      } else {
        lock = true;
        setTimeout(() => { unflip(j); unflip(i); lock = false; }, 1000);
      }
    };

    function done() {
      const stars = moves <= 8 ? 3 : moves <= 12 ? 2 : 1;
      saveStars(t.id + ':memory', stars);
      resultView({
        head, stars, missed: [],
        summary: `Todos os pares em ${moves} jogadas`,
        again: () => viewMemory(t), exit: '#/t/' + t.id, exitLabel: 'Voltar ao tema'
      });
    }
  }

  /* ---------- modo Completar a frase ---------- */
  function viewFill(t) {
    const head = { back: '#/t/' + t.id, backLabel: '← Voltar', title: 'Completar a frase' };
    const qs = shuffle(t.sentences).slice(0, 6).map(s => Object.assign({}, s, { options: shuffle(s.o) }));
    const total = qs.length;
    let i = 0, right = 0;
    const missed = [];
    show();

    function show() {
      const q = qs[i];
      const sentence = esc(q.s).replace('___', '<span class="blank" id="blank">?</span>');
      mount(`
        <div class="progress" role="progressbar" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${i + 1}"><i style="width:${i / total * 100}%"></i></div>
        <p class="counter">Frase ${i + 1} de ${total}</p>
        <h1 class="q-title" tabindex="-1" data-focus>Escolha a palavra que falta</h1>
        <p class="sentence" lang="en">${sentence}</p>
        <div class="hint-row" id="hint"><button class="hint-btn" data-act="hint">💡 Ver dica em português</button></div>
        <div class="options text two">${q.options.map((o, idx) => `<button class="opt" data-i="${idx}" lang="en">${esc(o)}</button>`).join('')}</div>
        <div id="fb" role="status" aria-live="polite"></div>
      `, head, true);
      window.scrollTo(0, 0);

      let answered = false;
      const full = q.s.replace('___', q.a);
      app.onclick = e => {
        const act = e.target.closest('[data-act]');
        if (act) {
          if (act.dataset.act === 'hint') { $('#hint').innerHTML = `<span class="hint-text">${esc(q.pt)}</span>`; return; }
          if (act.dataset.act === 'say') return speak(full);
          if (act.dataset.act === 'next') return next();
        }
        const o = e.target.closest('.opt');
        if (o && !answered) { answered = true; answer(+o.dataset.i); }
      };

      function answer(idx) {
        const ok = q.options[idx] === q.a;
        app.querySelectorAll('.opt').forEach((b, j) => {
          b.classList.add('locked');
          if (q.options[j] === q.a) b.classList.add('correct');
          else if (j === idx) b.classList.add('wrong');
        });
        const blank = $('#blank');
        blank.textContent = q.a;
        blank.classList.add(ok ? 'correct' : 'wrong');
        $('#hint').innerHTML = '';
        const w = t.words.find(x => x.en.toLowerCase() === q.a.toLowerCase());
        if (w) mark(t, w, ok);
        if (ok) right++; else if (w) missed.push({ t, w });
        $('#fb').innerHTML = `
          <div class="feedback ${ok ? 'good' : 'bad'}">
            <div class="fb-text">
              <strong>${ok ? praise() : 'Quase! A resposta certa é “' + esc(q.a) + '”.'}</strong>
              <span class="sub">${esc(q.pt)}</span>
            </div>
            <button class="btn btn-icon" data-act="say" aria-label="Ouvir a frase">🔊</button>
            <button class="btn btn-primary" data-act="next">${i === total - 1 ? 'Ver resultado' : 'Continuar'}</button>
          </div>`;
        speak(full);
        $('#fb [data-act="next"]').focus({ preventScroll: true });
        $('#fb').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      function next() {
        if (i < total - 1) { i++; show(); } else finish();
      }
    }
    function finish() {
      const stars = starsFor(right, total);
      saveStars(t.id + ':fill', stars);
      resultView({
        head, stars, missed,
        summary: `${right} de ${total} certas`,
        again: () => viewFill(t), exit: '#/t/' + t.id, exitLabel: 'Voltar ao tema'
      });
    }
  }

  route();
})();
