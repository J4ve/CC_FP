/* GenericMart - cart.js
   Full cart page rendering + free-shipping bar + zip estimator + promo code.
   Blueprint §5.4 / §6.1. */

(function () {
  'use strict';
  const TT = window.GM;
  const FREE_SHIP_THRESHOLD = 1000;
  const PROMOS = { 'TT10': 0.10, 'STUDENT': 0.15 };

  let promoCode = '';
  let zipShip = null;

  function calcShipping(zip) {
    if (!zip || !/^[0-9]{4}$/.test(zip)) return null;
    const first = +zip[0];
    return { cost: 89 + first * 12, eta: 2 + (first % 4) };
  }

  function totals() {
    const subtotal = GM.cartSubtotal();
    const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : (zipShip ? zipShip.cost : 0);
    const discount = promoCode && PROMOS[promoCode] ? subtotal * PROMOS[promoCode] : 0;
    const tax = (subtotal - discount) * 0.25;
    const total = subtotal - discount + shipping + tax;
    return { subtotal, shipping, discount, tax, total };
  }

  function render() {
    const cart = GM.getCart();
    const wrap = document.getElementById('tt-cart-rows');
    const summary = document.getElementById('tt-cart-summary');
    if (!wrap) return;

    if (!cart.length) {
      wrap.innerHTML = `<div class="text-center py-5 text-muted">
        <span class="material-symbols-outlined" style="font-size:4rem;opacity:.4" aria-hidden="true">shopping_bag</span>
        <h2 class="h5 mt-3">${GM.t('cart.empty.title')}</h2>
        <p>${GM.t('cart.empty.body')}</p>
        <a href="catalog.html" class="btn btn-primary">${GM.t('cart.empty.browse')}</a>
      </div>`;
      summary.innerHTML = '';
      return;
    }

    wrap.innerHTML = cart.map(it => {
      const raw = GM_PRODUCTS.find(x => x.id === it.id);
      if (!raw) return '';
      const p = GM.localizedProduct ? GM.localizedProduct(raw) : raw;
      const onSale = !!raw.salePrice;
      const line = GM.priceOf(raw) * it.qty;
      return `<div class="d-flex gap-3 py-3 border-bottom" data-row="${raw.id}">
        <a href="product.html?id=${raw.id}" style="width:96px;height:96px;flex-shrink:0;background:var(--tt-surface-low);border-radius:.25rem;display:flex;align-items:center;justify-content:center;overflow:hidden;color:inherit">
          ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="${GM.imgFallback}" style="width:100%;height:100%;object-fit:cover">`
                  : `<span class="material-symbols-outlined" style="font-size:2.5rem;color:var(--tt-outline-variant)" aria-hidden="true">${p.icon||'box'}</span>`}
        </a>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">
            <a href="product.html?id=${raw.id}" class="fw-semibold text-decoration-none" style="color:var(--tt-text-primary)">${p.name}</a>
            <button type="button" class="btn btn-sm btn-link text-danger p-0" aria-label="${GM.t('card.remove')} ${p.name}" data-remove="${raw.id}">
              <span class="material-symbols-outlined" style="font-size:18px">delete</span>
            </button>
          </div>
          <div class="text-muted small mt-1">${raw.brand} · ${raw.category}</div>
          <div class="d-flex align-items-center justify-content-between mt-2 flex-wrap gap-2">
            <div class="input-group input-group-sm" style="width:120px">
              <button class="btn btn-outline-secondary" type="button" data-dec="${raw.id}" aria-label="−">−</button>
              <input type="number" min="1" max="99" class="form-control text-center" value="${it.qty}" aria-label="${GM.t('product.qty')} ${p.name}" data-qty="${raw.id}">
              <button class="btn btn-outline-secondary" type="button" data-inc="${raw.id}" aria-label="+">+</button>
            </div>
            <div class="text-end">
              <div class="fw-bold">${GM.formatPrice(line)}</div>
              ${onSale ? `<small class="text-muted text-decoration-line-through">${GM.formatPrice(raw.price * it.qty)}</small>` : ''}
            </div>
          </div>
        </div>
      </div>`;
    }).join('');

    const t = totals();
    const remaining = Math.max(0, FREE_SHIP_THRESHOLD - t.subtotal);
    const pct = Math.min(100, (t.subtotal / FREE_SHIP_THRESHOLD) * 100);
    summary.innerHTML = `
      <div class="tt-shipbar">
        ${remaining > 0
          ? `<div class="d-flex justify-content-between small mb-1"><span>${GM.t('cart.shipping.adding')} <strong>${GM.formatPrice(remaining)}</strong> →</span><span>${GM.formatPrice(t.subtotal)} / ${GM.formatPrice(FREE_SHIP_THRESHOLD)}</span></div>`
          : `<div class="text-success fw-semibold small mb-1"><span class="material-symbols-outlined align-middle" aria-hidden="true">local_shipping</span> ${GM.t('cart.shipping.unlocked')}</div>`}
        <div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar bg-success" style="width:${pct}%"></div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <h3 class="h6 fw-bold">${GM.t('cart.shipping.estimator')}</h3>
          <div class="d-flex gap-2 mb-2">
            <input id="tt-zip" type="text" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" class="form-control form-control-sm" placeholder="${GM.t('cart.shipping.placeholder')}" aria-label="${GM.t('cart.shipping.placeholder')}">
            <button id="tt-zip-btn" class="btn btn-sm btn-outline-secondary" type="button">${GM.t('cart.shipping.estimate')}</button>
          </div>
          <div id="tt-zip-out" class="small text-muted" aria-live="polite">${GM.t('cart.shipping.help')}</div>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <h3 class="h6 fw-bold">${GM.t('cart.promo.title')}</h3>
          <div class="d-flex gap-2 mb-1">
            <input id="tt-promo" type="text" class="form-control form-control-sm text-uppercase" placeholder="${GM.t('cart.promo.placeholder')}" aria-label="${GM.t('cart.promo.title')}" value="${promoCode}">
            <button id="tt-promo-btn" class="btn btn-sm btn-outline-secondary" type="button">${GM.t('cart.promo.apply')}</button>
          </div>
          <div id="tt-promo-out" class="small ${promoCode && PROMOS[promoCode] ? 'text-success' : 'text-muted'}" aria-live="polite">
            ${promoCode && PROMOS[promoCode] ? GM.t('cart.promo.applied', { pct: PROMOS[promoCode]*100 }) : GM.t('cart.promo.hint')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h3 class="h6 fw-bold mb-3">${GM.t('cart.summary.title')}</h3>
          <div class="d-flex justify-content-between small mb-1"><span>${GM.t('cart.summary.subtotal')}</span><span>${GM.formatPrice(t.subtotal)}</span></div>
          ${t.discount > 0 ? `<div class="d-flex justify-content-between small mb-1 text-success"><span>${GM.t('cart.summary.discount')}</span><span>−${GM.formatPrice(t.discount)}</span></div>` : ''}
          <div class="d-flex justify-content-between small mb-1"><span>${GM.t('cart.summary.shipping')}</span><span>${t.shipping === 0 ? GM.t('cart.summary.free') : GM.formatPrice(t.shipping)}</span></div>
          <div class="d-flex justify-content-between small mb-2"><span>${GM.t('cart.summary.tax')}</span><span>${GM.formatPrice(t.tax)}</span></div>
          <hr>
          <div class="d-flex justify-content-between fw-bold"><span>${GM.t('cart.summary.total')}</span><span>${GM.formatPrice(t.total)}</span></div>
          <a href="checkout.html" class="btn btn-primary w-100 mt-3">
            <span class="material-symbols-outlined align-middle me-1" aria-hidden="true">lock</span>
            ${GM.t('cart.summary.checkout')}
          </a>
          <div class="tt-trust mt-3 small">
            <span class="material-symbols-outlined" aria-hidden="true">verified_user</span>
            <span>${GM.t('cart.summary.trust')}</span>
          </div>
        </div>
      </div>`;

    wrap.querySelectorAll('[data-remove]').forEach(b =>
      b.addEventListener('click', () => { GM.removeFromCart(+b.dataset.remove); render(); })
    );
    wrap.querySelectorAll('[data-inc]').forEach(b =>
      b.addEventListener('click', () => { const id = +b.dataset.inc; const cur = GM.getCart().find(i => i.id === id)?.qty || 0; GM.updateCartItem(id, cur + 1); render(); })
    );
    wrap.querySelectorAll('[data-dec]').forEach(b =>
      b.addEventListener('click', () => { const id = +b.dataset.dec; const cur = GM.getCart().find(i => i.id === id)?.qty || 0; GM.updateCartItem(id, Math.max(1, cur - 1)); render(); })
    );
    wrap.querySelectorAll('[data-qty]').forEach(inp =>
      inp.addEventListener('change', (e) => { const id = +e.target.dataset.qty; const v = Math.max(1, +e.target.value || 1); GM.updateCartItem(id, v); render(); })
    );

    document.getElementById('tt-zip-btn')?.addEventListener('click', () => {
      const v = document.getElementById('tt-zip').value.trim();
      const out = document.getElementById('tt-zip-out');
      const r = calcShipping(v);
      if (!r) { out.textContent = GM.t('cart.shipping.invalid'); out.className = 'small text-danger'; zipShip = null; return; }
      zipShip = r;
      out.textContent = GM.t('cart.shipping.result', { cost: GM.formatPrice(r.cost), eta: r.eta });
      out.className = 'small text-success';
      render();
    });
    document.getElementById('tt-promo-btn')?.addEventListener('click', () => {
      const code = document.getElementById('tt-promo').value.trim().toUpperCase();
      const out = document.getElementById('tt-promo-out');
      if (PROMOS[code]) {
        promoCode = code;
        out.textContent = GM.t('cart.promo.applied', { pct: PROMOS[code]*100 });
        out.className = 'small text-success';
        GM.toast(`Promo ${code} applied`, 'success');
      } else {
        promoCode = '';
        out.textContent = GM.t('cart.promo.invalid');
        out.className = 'small text-danger';
      }
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('tt-cart-rows')) return;
    render();
    document.addEventListener('tt:cart-changed', render);
    document.addEventListener('tt:lang-changed', render);
  });
})();
