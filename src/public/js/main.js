/* GenericMart - main.js
   Global init: shared state, navbar search, cart store, mini-cart, welcome guide, page-agnostic helpers.
   Blueprint §4.1 (predictability), §5.1 (sticky nav), §5.5 (welcome guide), §6.1 (feedback). */

(function () {
  'use strict';

  // ---------- Shared store -----------------------------------------------
  const TT = (window.GM = window.GM || {});
  const LS_KEYS = {
    cart:     'gm_cart',
    welcome:  'gm_welcome_dismissed',
    a11y:     'gm_a11y',
    mode:     'gm_mode',
    lang:     'gm_lang'
  };

  GM.formatPrice = (n) => {
    const locale = GM.lang === 'no' ? 'nb-NO' : 'en-US';
    return '₱' + Number(n).toLocaleString(locale);
  };
  GM.priceOf = (p) => p.salePrice ? p.salePrice : p.price;

  GM.getCart = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.cart) || '[]'); }
    catch { return []; }
  };
  GM.saveCart = (cart) => {
    localStorage.setItem(LS_KEYS.cart, JSON.stringify(cart));
    GM.updateCartBadge();
    document.dispatchEvent(new CustomEvent('tt:cart-changed'));
  };
  GM.cartCount = () => GM.getCart().reduce((s, i) => s + i.qty, 0);
  GM.cartSubtotal = () => GM.getCart().reduce((s, i) => {
    const p = GM_PRODUCTS.find(x => x.id === i.id);
    return p ? s + GM.priceOf(p) * i.qty : s;
  }, 0);

  GM.addToCart = (id, qty = 1) => {
    const product = GM_PRODUCTS.find(p => p.id === id);
    if (!product) return;
    const cart = GM.getCart();
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += qty;
    else cart.push({ id, qty });
    GM.saveCart(cart);
    const p = GM.localizedProduct ? GM.localizedProduct(product) : product;
    GM.toast(GM.t ? GM.t('toast.added', { name: p.name }) : `Added “${p.name}”`, 'success');
    GM.announce(`${p.name} added. Cart total ${GM.cartCount()} items.`);
  };
  GM.updateCartItem = (id, qty) => {
    let cart = GM.getCart();
    if (qty <= 0) cart = cart.filter(i => i.id !== id);
    else { const it = cart.find(i => i.id === id); if (it) it.qty = qty; }
    GM.saveCart(cart);
  };
  GM.removeFromCart = (id) => {
    const cart = GM.getCart().filter(i => i.id !== id);
    GM.saveCart(cart);
    GM.announce(GM.t ? GM.t('toast.removed') : 'Item removed from cart');
  };

  GM.updateCartBadge = () => {
    const total = GM.cartCount();
    document.querySelectorAll('[data-tt-cart-badge]').forEach(el => {
      el.textContent = total;
      el.style.display = total > 0 ? 'flex' : 'none';
    });
  };

  // ---------- ARIA live announcements ------------------------------------
  GM.announce = (msg) => {
    let lr = document.getElementById('tt-live-region');
    if (!lr) {
      lr = document.createElement('div');
      lr.id = 'tt-live-region';
      lr.setAttribute('role', 'status');
      lr.setAttribute('aria-live', 'polite');
      document.body.appendChild(lr);
    }
    lr.textContent = '';
    setTimeout(() => { lr.textContent = msg; }, 30);
  };

  // ---------- Search autocomplete (debounced) ----------------------------
  function setupSearch() {
    const input = document.getElementById('tt-search-input');
    const dropdown = document.getElementById('tt-search-dropdown');
    if (!input || !dropdown) return;

    let activeIdx = -1;
    let matches = [];
    let timer = null;

    function highlight(text, q) {
      const i = text.toLowerCase().indexOf(q.toLowerCase());
      if (i < 0) return text;
      return text.slice(0, i) + '<mark>' + text.slice(i, i + q.length) + '</mark>' + text.slice(i + q.length);
    }

    function render() {
      if (!matches.length) {
        dropdown.innerHTML = `<div class="p-3 text-muted small">${GM.t('search.noResults')}</div>`;
        return;
      }
      dropdown.innerHTML = matches.map((rawP, i) => {
        const p = GM.localizedProduct ? GM.localizedProduct(rawP) : rawP;
        return `
        <a class="item ${i === activeIdx ? 'is-active' : ''}" href="product.html?id=${p.id}" role="option">
          <div class="thumb">
            ${p.img ? `<img src="${p.img}" alt="" onerror="${GM.imgFallback}">` : `<span class="material-symbols-outlined" aria-hidden="true">${p.icon || 'box'}</span>`}
          </div>
          <div class="flex-grow-1 small">
            <div class="fw-semibold text-truncate">${highlight(p.name, input.value)}</div>
            <div class="text-muted" style="font-size:.75rem">${GM.localizedCategory ? GM.localizedCategory(TT_CATEGORIES.find(c=>c.id===rawP.category) || {label:rawP.category}) : rawP.category}</div>
          </div>
          <div class="fw-bold small">${GM.formatPrice(GM.priceOf(p))}</div>
        </a>`;
      }).join('');
    }

    function runQuery() {
      const q = input.value.trim().toLowerCase();
      if (!q) { dropdown.style.display = 'none'; return; }
      matches = GM_PRODUCTS.filter(p => {
        const np = GM.localizedProduct ? GM.localizedProduct(p) : p;
        return np.name.toLowerCase().includes(q) ||
               np.desc.toLowerCase().includes(q) ||
               p.category.toLowerCase().includes(q) ||
               p.brand.toLowerCase().includes(q);
      }).slice(0, 5);
      activeIdx = -1;
      dropdown.style.display = 'block';
      input.setAttribute('aria-expanded', 'true');
      render();
    }

    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(runQuery, 180);
    });
    input.addEventListener('focus', () => { if (input.value) runQuery(); });
    input.addEventListener('keydown', (e) => {
      if (!matches.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = (activeIdx + 1) % matches.length; render(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); activeIdx = (activeIdx - 1 + matches.length) % matches.length; render(); }
      if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); window.location.href = `product.html?id=${matches[activeIdx].id}`; }
      if (e.key === 'Escape') { dropdown.style.display = 'none'; input.setAttribute('aria-expanded','false'); }
    });
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
        input.setAttribute('aria-expanded','false');
      }
    });

    // Re-run query on lang change (if user has typed)
    document.addEventListener('tt:lang-changed', () => { if (input.value) runQuery(); });
  }

  // ---------- Mini-cart drawer -------------------------------------------
  GM.openMiniCart = () => {
    renderMiniCart();
    document.querySelector('.tt-minicart')?.classList.add('is-open');
    document.querySelector('.tt-minicart-backdrop')?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  GM.closeMiniCart = () => {
    document.querySelector('.tt-minicart')?.classList.remove('is-open');
    document.querySelector('.tt-minicart-backdrop')?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  function renderMiniCart() {
    const body = document.getElementById('tt-minicart-body');
    const sub  = document.getElementById('tt-minicart-subtotal');
    const cnt  = document.getElementById('tt-minicart-count');
    if (!body) return;
    const cart = GM.getCart();
    cnt.textContent = `(${GM.cartCount()})`;
    if (!cart.length) {
      body.innerHTML = `<div class="text-center text-muted py-5">
        <span class="material-symbols-outlined" style="font-size:3rem;opacity:.4">shopping_cart</span>
        <p class="mb-0 mt-2 fw-semibold">${GM.t('minicart.empty.title')}</p>
        <small>${GM.t('minicart.empty.body')}</small>
      </div>`;
      sub.textContent = GM.formatPrice(0);
      return;
    }
    body.innerHTML = cart.map(it => {
      const raw = GM_PRODUCTS.find(pr => pr.id === it.id);
      if (!raw) return '';
      const p = GM.localizedProduct ? GM.localizedProduct(raw) : raw;
      return `<div class="item">
        <div class="thumb">
          ${p.img ? `<img src="${p.img}" alt="" onerror="${GM.imgFallback}">` : `<span class="material-symbols-outlined">${p.icon||'box'}</span>`}
        </div>
        <div class="flex-grow-1 min-w-0">
          <div class="fw-semibold small text-truncate">${p.name}</div>
          <div class="text-muted small">${GM.formatPrice(GM.priceOf(p))} ${GM.lang === 'no' ? 'pr.' : 'each'}</div>
          <div class="d-flex align-items-center justify-content-between mt-1 gap-2">
            <div class="input-group input-group-sm" style="width:96px">
              <button class="btn btn-outline-secondary px-2" type="button" data-mc-dec="${raw.id}" aria-label="−">−</button>
              <input type="number" min="1" max="99" class="form-control text-center px-1" value="${it.qty}" aria-label="${GM.t('product.qty')} ${p.name}" data-mc-qty="${raw.id}" style="min-width:0">
              <button class="btn btn-outline-secondary px-2" type="button" data-mc-inc="${raw.id}" aria-label="+">+</button>
            </div>
            <div class="fw-bold small">${GM.formatPrice(GM.priceOf(p)*it.qty)}</div>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-link text-danger p-1 align-self-start" onclick="GM.removeFromCart(${raw.id})" aria-label="${GM.t('card.remove')} ${p.name}">
          <span class="material-symbols-outlined" style="font-size:18px">delete</span>
        </button>
      </div>`;
    }).join('');
    sub.textContent = GM.formatPrice(GM.cartSubtotal());

    // Bind +/− steppers (event delegation per render)
    body.querySelectorAll('[data-mc-inc]').forEach(b =>
      b.addEventListener('click', () => {
        const id = +b.dataset.mcInc;
        const cur = GM.getCart().find(i => i.id === id)?.qty || 0;
        GM.updateCartItem(id, Math.min(99, cur + 1));
      })
    );
    body.querySelectorAll('[data-mc-dec]').forEach(b =>
      b.addEventListener('click', () => {
        const id = +b.dataset.mcDec;
        const cur = GM.getCart().find(i => i.id === id)?.qty || 0;
        GM.updateCartItem(id, Math.max(1, cur - 1));
      })
    );
    body.querySelectorAll('[data-mc-qty]').forEach(inp =>
      inp.addEventListener('change', (e) => {
        const id = +e.target.dataset.mcQty;
        const v = Math.max(1, Math.min(99, +e.target.value || 1));
        GM.updateCartItem(id, v);
      })
    );
  }
  document.addEventListener('tt:cart-changed', () => {
    if (document.querySelector('.tt-minicart.is-open')) renderMiniCart();
  });
  document.addEventListener('tt:lang-changed', () => {
    if (document.querySelector('.tt-minicart.is-open')) renderMiniCart();
    GM.updateCartBadge();
  });

  // ---------- Welcome guide ----------------------------------------------
  function setupWelcome() {
    const overlay = document.getElementById('tt-welcome');
    if (!overlay) return;
    if (localStorage.getItem(LS_KEYS.welcome) === '1') return;
    let step = 0;
    const stepKeys = [
      { titleK: 'welcome.s1.title', bodyK: 'welcome.s1.body', icon: 'storefront' },
      { titleK: 'welcome.s2.title', bodyK: 'welcome.s2.body', icon: 'search' },
      { titleK: 'welcome.s3.title', bodyK: 'welcome.s3.body', icon: 'verified_user' }
    ];
    function render() {
      const s = stepKeys[step];
      overlay.querySelector('.tt-welcome').innerHTML = `
        <div class="text-center mb-3">
          <span class="material-symbols-outlined step-illu" aria-hidden="true">${s.icon}</span>
        </div>
        <h2 class="h5 fw-bold text-center">${GM.t(s.titleK)}</h2>
        <p class="text-muted text-center small">${GM.t(s.bodyK)}</p>
        <div class="d-flex align-items-center justify-content-between mt-4">
          <div class="step-dots" aria-hidden="true">
            ${stepKeys.map((_, i) => `<span class="d ${i === step ? 'is-active' : ''}"></span>`).join('')}
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-link text-muted btn-sm" data-tt-welcome-skip>${GM.t('welcome.skip')}</button>
            <button type="button" class="btn btn-primary btn-sm" data-tt-welcome-next>${step === stepKeys.length - 1 ? GM.t('welcome.start') : GM.t('welcome.next')}</button>
          </div>
        </div>`;
    }
    overlay.classList.add('is-open');
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    render();
    overlay.addEventListener('click', (e) => {
      if (e.target.matches('[data-tt-welcome-skip]')) close();
      if (e.target.matches('[data-tt-welcome-next]')) {
        if (step === stepKeys.length - 1) close();
        else { step++; render(); }
      }
    });
    function close() {
      overlay.classList.remove('is-open');
      localStorage.setItem(LS_KEYS.welcome, '1');
      GM.announce('Welcome guide dismissed');
    }
  }

  // ---------- Keyboard shortcuts -----------------------------------------
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      document.getElementById('tt-search-input')?.focus();
    }
    if (e.key === 'Escape') {
      GM.closeMiniCart();
      document.querySelectorAll('.tt-toast').forEach(t => t.classList.add('is-out'));
    }
  });

  // ---------- Active nav link --------------------------------------------
  function highlightNav() {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-tt-nav]').forEach(a => {
      if (a.dataset.ttNav === path) a.classList.add('active');
    });
  }

  // ---------- Init -------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setupSearch();
    setupWelcome();
    highlightNav();
    GM.updateCartBadge();
    GM.LS_KEYS = LS_KEYS;
  });
})();
