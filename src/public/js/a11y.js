/* GenericMart - a11y.js
   Side-sheet panel + persisted prefs (font, contrast, dark, motion, audio, grid cols, language).
   All flags applied to <html> so descendants (incl. Bootstrap rems) inherit. */

(function () {
  'use strict';
  const TT = window.GM;
  const KEY = 'gm_a11y';

  const defaults = {
    font: 16,
    contrast: 'normal',
    theme: 'light',          // light | dark
    motion: 'normal',
    audio: 'on',
    cols: 4,                 // 2..8
    lang: null               // mirrors GM.lang
  };
  function load() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch { return { ...defaults }; }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  function apply(s) {
    const html = document.documentElement;
    html.dataset.ttFont     = s.font;
    html.dataset.ttContrast = s.contrast;
    html.dataset.ttTheme    = s.theme;
    html.dataset.ttMotion   = s.motion;
    html.dataset.ttAudio    = s.audio;
    html.style.setProperty('--tt-grid-cols', s.cols);
  }

  function chime(type) {
    const s = load();
    if (s.audio !== 'on') return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = type === 'error' ? 220 : 660;
      g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  function buildPanel() {
    if (document.getElementById('tt-a11y-panel')) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'tt-a11y-backdrop';
    document.body.appendChild(backdrop);

    const panel = document.createElement('aside');
    panel.id = 'tt-a11y-panel';
    panel.className = 'tt-a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'tt-a11y-title');
    panel.setAttribute('aria-modal', 'false');
    panel.innerHTML = `
      <div class="head">
        <h3 id="tt-a11y-title" data-i18n="a11y.title">Accessibility</h3>
        <button type="button" class="btn-close" aria-label="Close" data-tt-a11y-close></button>
      </div>
      <div class="body">
        <div class="row">
          <label data-i18n="a11y.textSize">Text size</label>
          <div class="d-flex gap-1">
            <button type="button" class="size" data-font="14" aria-label="Small text">A</button>
            <button type="button" class="size" data-font="16" aria-label="Default text">A</button>
            <button type="button" class="size" data-font="18" aria-label="Large text">A+</button>
            <button type="button" class="size" data-font="20" aria-label="Larger text">A++</button>
            <button type="button" class="size" data-font="22" aria-label="Largest text">A+++</button>
          </div>
        </div>
        <div class="row">
          <label for="tt-cb-dark" data-i18n="a11y.darkMode">Dark mode</label>
          <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="tt-cb-dark"></div>
        </div>
        <div class="row">
          <label for="tt-cb-contrast" data-i18n="a11y.contrast">High contrast</label>
          <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="tt-cb-contrast"></div>
        </div>
        <div class="row">
          <label for="tt-cb-motion" data-i18n="a11y.motion">Reduce motion</label>
          <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="tt-cb-motion"></div>
        </div>
        <div class="row">
          <label for="tt-cb-audio" data-i18n="a11y.audio">Audio cues</label>
          <div class="form-check form-switch m-0"><input class="form-check-input" type="checkbox" id="tt-cb-audio"></div>
        </div>
        <div class="row">
          <label for="tt-rng-cols" data-i18n="a11y.gridCols">Catalog columns</label>
          <div class="d-flex align-items-center gap-2">
            <input id="tt-rng-cols" type="range" min="2" max="8" step="1">
            <span class="col-count" id="tt-rng-cols-out">4</span>
          </div>
        </div>
        <div class="row">
          <label data-i18n="a11y.language">Language</label>
          <div class="lang-grp">
            <button type="button" data-lang="en">EN</button>
            <button type="button" data-lang="no">NO</button>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-outline-secondary w-100 mt-3" data-tt-a11y-reset data-i18n="a11y.reset">Reset to defaults</button>
      </div>
    `;
    document.body.appendChild(panel);
  }

  function bind() {
    const s = load();
    if (TT && GM.lang) s.lang = GM.lang;
    apply(s);

    const panel = document.getElementById('tt-a11y-panel');
    const backdrop = document.querySelector('.tt-a11y-backdrop');
    if (!panel || !backdrop) return;

    const open = () => { panel.classList.add('is-open'); backdrop.classList.add('is-open'); };
    const close = () => { panel.classList.remove('is-open'); backdrop.classList.remove('is-open'); };
    backdrop.addEventListener('click', close);
    panel.querySelector('[data-tt-a11y-close]').addEventListener('click', close);
    document.querySelectorAll('[data-tt-a11y-toggle]').forEach(b =>
      b.addEventListener('click', e => { e.preventDefault(); panel.classList.contains('is-open') ? close() : open(); })
    );
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
    });

    // Font size
    panel.querySelectorAll('.size').forEach(b => {
      b.classList.toggle('is-active', +b.dataset.font === +s.font);
      b.addEventListener('click', () => {
        const nx = load(); nx.font = +b.dataset.font; apply(nx); save(nx);
        panel.querySelectorAll('.size').forEach(x => x.classList.toggle('is-active', x === b));
        GM.announce && GM.announce('Text size changed');
      });
    });

    // Toggles
    const cb = id => panel.querySelector('#' + id);
    cb('tt-cb-dark').checked     = s.theme === 'dark';
    cb('tt-cb-contrast').checked = s.contrast === 'high';
    cb('tt-cb-motion').checked   = s.motion === 'reduced';
    cb('tt-cb-audio').checked    = s.audio === 'on';

    cb('tt-cb-dark').addEventListener('change', e => {
      const nx = load(); nx.theme = e.target.checked ? 'dark' : 'light'; apply(nx); save(nx);
      GM.announce && GM.announce('Dark mode ' + (e.target.checked ? 'on' : 'off'));
    });
    cb('tt-cb-contrast').addEventListener('change', e => {
      const nx = load(); nx.contrast = e.target.checked ? 'high' : 'normal'; apply(nx); save(nx);
      GM.announce && GM.announce('High contrast ' + (e.target.checked ? 'on' : 'off'));
    });
    cb('tt-cb-motion').addEventListener('change', e => {
      const nx = load(); nx.motion = e.target.checked ? 'reduced' : 'normal'; apply(nx); save(nx);
      GM.announce && GM.announce('Reduced motion ' + (e.target.checked ? 'on' : 'off'));
    });
    cb('tt-cb-audio').addEventListener('change', e => {
      const nx = load(); nx.audio = e.target.checked ? 'on' : 'off'; save(nx);
      GM.announce && GM.announce('Audio cues ' + (e.target.checked ? 'on' : 'off'));
    });

    // Grid columns
    const rng  = cb('tt-rng-cols');
    const rout = cb('tt-rng-cols-out');
    rng.value = s.cols; rout.textContent = s.cols;
    rng.addEventListener('input', e => {
      const nx = load(); nx.cols = +e.target.value; apply(nx); save(nx);
      rout.textContent = nx.cols;
      GM.announce && GM.announce(nx.cols + ' columns');
    });

    // Language
    const langGrp = panel.querySelector('.lang-grp');
    langGrp.querySelectorAll('button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.lang === (TT?.lang || 'en'));
      b.addEventListener('click', () => {
        GM.setLang && GM.setLang(b.dataset.lang);
        langGrp.querySelectorAll('button').forEach(x => x.classList.toggle('is-active', x === b));
        // mirror in saved a11y blob too
        const nx = load(); nx.lang = b.dataset.lang; save(nx);
        GM.announce && GM.announce('Language: ' + (b.dataset.lang === 'no' ? 'Bokmål' : 'English'));
      });
    });

    // Header navbar lang pill (if present) - sync
    document.querySelectorAll('[data-tt-lang-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = (TT?.lang || 'en') === 'en' ? 'no' : 'en';
        GM.setLang && GM.setLang(next);
        langGrp.querySelectorAll('button').forEach(x => x.classList.toggle('is-active', x.dataset.lang === next));
        const nx = load(); nx.lang = next; save(nx);
      });
      const updatePill = () => {
        const lbl = btn.querySelector('[data-tt-lang-label]');
        if (lbl) lbl.textContent = (TT?.lang || 'en').toUpperCase();
      };
      updatePill();
      document.addEventListener('tt:lang-changed', updatePill);
    });

    // Reset
    panel.querySelector('[data-tt-a11y-reset]').addEventListener('click', () => {
      const nx = { ...defaults };
      apply(nx); save(nx);
      GM.setLang && GM.setLang('en');
      cb('tt-cb-dark').checked = false;
      cb('tt-cb-contrast').checked = false;
      cb('tt-cb-motion').checked = false;
      cb('tt-cb-audio').checked = true;
      rng.value = 4; rout.textContent = 4;
      panel.querySelectorAll('.size').forEach(x => x.classList.toggle('is-active', +x.dataset.font === 16));
      langGrp.querySelectorAll('button').forEach(x => x.classList.toggle('is-active', x.dataset.lang === 'en'));
      GM.announce && GM.announce('Accessibility settings reset');
    });
  }

  // Apply prefs early to prevent flash
  apply(load());

  document.addEventListener('DOMContentLoaded', () => {
    buildPanel();
    bind();
    document.addEventListener('tt:cart-changed', () => chime('success'));
  });
})();
