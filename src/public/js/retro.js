/* GenericMart - retro.js
   Retro Mode toggle: dense compact arngren-true layout. Blueprint §5.6. */

(function () {
  'use strict';
  const TT = window.GM;
  const KEY = 'gm_mode';

  function get() { return localStorage.getItem(KEY) || 'modern'; }
  function set(v) {
    localStorage.setItem(KEY, v);
    document.documentElement.dataset.ttMode = v;
    document.querySelectorAll('[data-tt-retro-toggle]').forEach(t => {
      t.setAttribute('aria-pressed', v === 'retro');
      const lbl = t.querySelector('.retro-label');
      if (lbl) lbl.textContent = v === 'retro' ? (GM.t ? GM.t('mode.modern') : 'Modern Mode')
                                                 : (GM.t ? GM.t('mode.retro') : 'Retro Mode');
    });
    if (GM.announce) GM.announce(v === 'retro' ? 'Retro mode on' : 'Modern mode on');
  }

  // Apply early to prevent flash
  document.documentElement.dataset.ttMode = get();

  document.addEventListener('DOMContentLoaded', () => {
    set(get());
    document.querySelectorAll('[data-tt-retro-toggle]').forEach(btn =>
      btn.addEventListener('click', () => set(get() === 'retro' ? 'modern' : 'retro'))
    );
    document.addEventListener('tt:lang-changed', () => set(get()));
  });
})();
