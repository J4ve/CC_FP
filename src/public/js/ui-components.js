/* GenericMart - ui-components.js
   Shared visual primitives: product card renderer, list row, toast, Quick View modal, star ratings.
   Blueprint §4.1 (one card schema), §6.1 (toast feedback). */

(function () {
  'use strict';
  const TT = window.GM;

  // ---------- Stars -------------------------------------------------------
  GM.starsHtml = (rating) => {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)         html += '<span class="material-symbols-outlined" aria-hidden="true">star</span>';
      else if (rating >= i-0.5) html += '<span class="material-symbols-outlined" aria-hidden="true">star_half</span>';
      else                      html += '<span class="material-symbols-outlined" aria-hidden="true" style="font-variation-settings:\'FILL\' 0">star</span>';
    }
    return html;
  };

  // Image fallback (src error -> swap to icon span)
  GM.imgFallback = "this.onerror=null;this.style.display='none';this.parentElement.classList.add('img-failed');";

  // ---------- Product card -----------------------------------------------
  GM.productCardHtml = (rawP) => {
    const p = GM.localizedProduct ? GM.localizedProduct(rawP) : rawP;
    const onSale = !!p.salePrice;
    const badge = p.badge === 'Sale' || onSale
      ? `<span class="badge-corner badge-sale">${GM.t ? GM.t('badge.sale') || 'Sale' : 'Sale'}</span>`
      : (p.badge === 'New' ? `<span class="badge-corner badge-new">${GM.t ? GM.t('badge.new') || 'New' : 'New'}</span>` : '');
    const detailHref = `product.html?id=${p.id}`;
    return `<article class="tt-product-card" data-id="${p.id}" aria-label="${p.name}">
      ${badge}
      <a class="media" href="${detailHref}" aria-label="${p.name}" style="text-decoration:none;color:inherit">
        ${p.img
          ? `<img loading="lazy" src="${p.img}" alt="${p.name}" onerror="${GM.imgFallback}">`
          : ''}
        <span class="material-symbols-outlined" aria-hidden="true" style="${p.img?'display:none':'display:block'}">${p.icon || 'box'}</span>
        <div class="quick-view">
          <button type="button" class="btn" onclick="event.preventDefault();event.stopPropagation();GM.openQuickView(${p.id})" aria-label="${GM.t('card.quickView')} - ${p.name}">${GM.t('card.quickView')}</button>
        </div>
      </a>
      <div class="body">
        <div class="chips" aria-hidden="true">
          ${(p.chips || []).map(c => `<span class="chip">${c}</span>`).join('')}
        </div>
        <a class="name" href="${detailHref}">${p.name}</a>
        <div class="d-flex align-items-center mt-2">
          <span class="stars" aria-label="${p.rating} / 5">${GM.starsHtml(p.rating)}</span>
          <span class="reviews">(${p.reviews})</span>
        </div>
        <div class="d-flex align-items-end justify-content-between mt-auto pt-2">
          <div>
            <span class="price">${GM.formatPrice(GM.priceOf(p))}</span>
            ${onSale ? `<span class="price-old">${GM.formatPrice(p.price)}</span>` : ''}
          </div>
          <button type="button" class="add-btn" onclick="event.stopPropagation();GM.addToCart(${p.id})" aria-label="${GM.t('card.addToCart')} - ${p.name}">
            <span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </article>`;
  };

  // ---------- List row ---------------------------------------------------
  GM.productRowHtml = (rawP) => {
    const p = GM.localizedProduct ? GM.localizedProduct(rawP) : rawP;
    const onSale = !!p.salePrice;
    return `<div class="tt-list-row">
      <a class="thumb" href="product.html?id=${p.id}">
        ${p.img ? `<img loading="lazy" src="${p.img}" alt="${p.name}" onerror="${GM.imgFallback}">` : ''}
        <span class="material-symbols-outlined" aria-hidden="true" style="${p.img?'display:none':'display:block'}">${p.icon || 'box'}</span>
      </a>
      <div class="flex-grow-1 min-w-0">
        <div class="d-flex justify-content-between gap-2">
          <a href="product.html?id=${p.id}" class="fw-semibold text-decoration-none" style="color:var(--tt-text-primary)">${p.name}</a>
          <div class="text-end">
            <div class="fw-bold">${GM.formatPrice(GM.priceOf(p))}</div>
            ${onSale ? `<small class="text-muted text-decoration-line-through">${GM.formatPrice(p.price)}</small>` : ''}
          </div>
        </div>
        <div class="small text-muted mt-1">${p.desc}</div>
        <div class="d-flex gap-1 mt-2 flex-wrap">
          ${(p.chips||[]).map(c => `<span class="chip" style="background:var(--tt-surface-variant);font-size:.65rem;font-weight:700;padding:.15rem .4rem;border-radius:.2rem">${c}</span>`).join('')}
        </div>
        <div class="d-flex gap-2 mt-2">
          <button type="button" class="btn btn-sm btn-primary" onclick="GM.addToCart(${p.id})" data-i18n="card.addToCart">${GM.t('card.addToCart')}</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" onclick="GM.openQuickView(${p.id})" data-i18n="card.quickView">${GM.t('card.quickView')}</button>
        </div>
      </div>
    </div>`;
  };

  // ---------- Toast -------------------------------------------------------
  GM.toast = (msg, type = 'success') => {
    let stack = document.querySelector('.tt-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'tt-toast-stack';
      document.body.appendChild(stack);
    }
    const el = document.createElement('div');
    el.className = 'tt-toast ' + (type === 'error' ? 'error' : type === 'info' ? 'info' : '');
    el.setAttribute('role', 'status');
    const icon = type === 'error' ? 'error' : type === 'info' ? 'info' : 'check_circle';
    el.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
                    <span class="flex-grow-1">${msg}</span>
                    <button type="button" class="btn-close btn-close-white" aria-label="Dismiss"></button>`;
    el.querySelector('.btn-close').addEventListener('click', () => el.remove());
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 300);
    }, 3500);
  };

  // ---------- Quick View --------------------------------------------------
  // Build modal once; use explicit close handler (don't rely solely on data-bs-dismiss
  // because we re-render innerHTML on every open).
  function ensureQvModal() {
    let modal = document.getElementById('tt-qv-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'tt-qv-modal';
    modal.className = 'modal fade tt-qv';
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', 'tt-qv-title');
    modal.innerHTML = `<div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content position-relative"></div>
    </div>`;
    document.body.appendChild(modal);
    // Delegate close click
    modal.addEventListener('click', (e) => {
      const closer = e.target.closest('[data-tt-qv-close]');
      if (closer) {
        e.preventDefault();
        bootstrap.Modal.getOrCreateInstance(modal).hide();
      }
    });
    // Esc key handled by Bootstrap (keyboard:true) but ensure focus management
    return modal;
  }

  GM.openQuickView = (id) => {
    const raw = GM_PRODUCTS.find(x => x.id === id);
    if (!raw) return;
    const p = GM.localizedProduct ? GM.localizedProduct(raw) : raw;
    const onSale = !!p.salePrice;
    const modal = ensureQvModal();

    modal.querySelector('.modal-content').innerHTML = `
      <button type="button" class="qv-close" data-tt-qv-close aria-label="Close Quick View">
        <span class="material-symbols-outlined" aria-hidden="true">close</span>
      </button>
      <div class="modal-body">
        <div class="qv-grid">
          <div class="qv-img">
            ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="${GM.imgFallback}">` : ''}
            <span class="material-symbols-outlined" aria-hidden="true" style="${p.img?'display:none':'display:block'}">${p.icon || 'box'}</span>
          </div>
          <div class="qv-info">
            <span class="text-uppercase small text-secondary fw-semibold" style="letter-spacing:.06em">${GM.localizedCategory ? GM.localizedCategory(TT_CATEGORIES.find(c=>c.id===raw.category) || {label:raw.category}) : raw.category}</span>
            <h2 id="tt-qv-title" class="h4 fw-bold mt-1">${p.name}</h2>
            <p class="text-muted small">${p.desc}</p>
            <div class="d-flex align-items-baseline gap-2 mb-3">
              <span class="h3 fw-bold mb-0">${GM.formatPrice(GM.priceOf(p))}</span>
              ${onSale ? `<span class="text-muted text-decoration-line-through">${GM.formatPrice(p.price)}</span>` : ''}
            </div>
            <div class="specs mb-3">
              ${Object.entries(p.specs).map(([k,v]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-primary flex-grow-1" data-tt-qv-add>
                <span class="material-symbols-outlined align-middle me-1" aria-hidden="true">add_shopping_cart</span>
                ${GM.t('card.addToCart')}
              </button>
              <a href="product.html?id=${raw.id}" class="btn btn-outline-secondary">${GM.t('card.fullDetails')}</a>
            </div>
          </div>
        </div>
      </div>`;
    modal.querySelector('[data-tt-qv-add]').addEventListener('click', () => {
      GM.addToCart(raw.id);
      bootstrap.Modal.getInstance(modal).hide();
    });
    bootstrap.Modal.getOrCreateInstance(modal, { keyboard: true, backdrop: true }).show();
  };
})();
