/* GenericMart - catalog.js
   Catalog page: filters, pagination, view toggle, autocomplete-deep-link.
   Blueprint §5.2/§5.3: 12 items/page, removable filter chips, lazy images. */

(function () {
  'use strict';
  const TT = window.GM;
  const PER_PAGE = 12;

  const state = {
    q: '',
    category: 'all',
    brand: 'all',
    minPrice: 0,
    maxPrice: 25000,
    motorPower: 'all',
    batteryType: 'all',
    sort: 'featured',
    view: 'grid',
    page: 1
  };

  function readUrl() {
    const u = new URLSearchParams(location.search);
    if (u.get('q'))   state.q = u.get('q');
    if (u.get('cat')) state.category = u.get('cat');
    if (u.get('open')) {
      const id = +u.get('open');
      if (GM_PRODUCTS.find(p => p.id === id)) {
        setTimeout(() => GM.openQuickView(id), 200);
      }
    }
  }

  function filtered() {
    return GM_PRODUCTS.filter(p => {
      if (state.q) {
        const q = state.q.toLowerCase();
        const np = GM.localizedProduct ? GM.localizedProduct(p) : p;
        if (!(np.name.toLowerCase().includes(q) ||
              np.desc.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q))) return false;
      }
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (state.brand !== 'all'    && p.brand    !== state.brand)    return false;
      const price = GM.priceOf(p);
      if (price < state.minPrice || price > state.maxPrice) return false;
      if (state.motorPower !== 'all' && p.motorPower !== state.motorPower) return false;
      if (state.batteryType !== 'all' && p.batteryType !== state.batteryType) return false;
      return true;
    });
  }

  function sorted(list) {
    const arr = [...list];
    if (state.sort === 'price-asc')  arr.sort((a,b) => GM.priceOf(a) - GM.priceOf(b));
    if (state.sort === 'price-desc') arr.sort((a,b) => GM.priceOf(b) - GM.priceOf(a));
    if (state.sort === 'rating')     arr.sort((a,b) => b.rating - a.rating);
    if (state.sort === 'name')       arr.sort((a,b) => a.name.localeCompare(b.name));
    return arr;
  }

  function renderChips() {
    const wrap = document.getElementById('tt-active-chips');
    if (!wrap) return;
    const chips = [];
    if (state.q)                 chips.push({ k: 'q',           label: `“${state.q}”` });
    if (state.category !== 'all') {
      const c = TT_CATEGORIES.find(x => x.id === state.category);
      chips.push({ k: 'category', label: (GM.localizedCategory ? GM.localizedCategory(c||{label:state.category}) : state.category) });
    }
    if (state.brand !== 'all')    chips.push({ k: 'brand',       label: (GM.t('sidebar.brand')) + ': ' + state.brand });
    if (state.motorPower !== 'all') chips.push({ k: 'motorPower', label: (GM.t('sidebar.motor')) + ': ' + state.motorPower });
    if (state.batteryType !== 'all') chips.push({ k: 'batteryType', label: (GM.t('sidebar.battery')) + ': ' + state.batteryType });
    if (state.minPrice > 0 || state.maxPrice < 25000) chips.push({ k: 'price', label: `${GM.formatPrice(state.minPrice)}–${GM.formatPrice(state.maxPrice)}` });
    wrap.innerHTML = chips.length
      ? chips.map(c => `<button class="tt-filter-chip" type="button" data-clear="${c.k}">${c.label} <span class="x" aria-hidden="true">×</span><span class="visually-hidden">Remove</span></button>`).join('')
        + `<button class="btn btn-sm btn-link" type="button" id="tt-clear-all">${GM.t('catalog.clearAll')}</button>`
      : `<span class="text-muted small">${GM.t('catalog.noFilters')}</span>`;
  }

  function renderResults() {
    const grid = document.getElementById('tt-grid');
    const summary = document.getElementById('tt-summary');
    const pagWrap = document.getElementById('tt-pagination');
    const list = sorted(filtered());
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    if (state.page > pages) state.page = pages;
    const slice = list.slice((state.page-1) * PER_PAGE, state.page * PER_PAGE);

    summary.textContent = total === 0
      ? GM.t('catalog.empty.title')
      : `${GM.t('catalog.summary.showing')} ${(state.page-1)*PER_PAGE + 1}–${Math.min(state.page*PER_PAGE, total)} ${GM.t('catalog.summary.of')} ${total} ${GM.t('catalog.summary.products')}`;

    grid.classList.add('tt-grid-products');
    if (state.view === 'list') {
      grid.classList.add('tt-list-view');
      grid.innerHTML = slice.length
        ? slice.map(p => GM.productRowHtml(p)).join('')
        : `<div class="col-12 w-100">${emptyState()}</div>`;
    } else {
      grid.classList.remove('tt-list-view');
      grid.innerHTML = slice.length
        ? slice.map(p => GM.productCardHtml(p)).join('')
        : `<div style="grid-column:1/-1">${emptyState()}</div>`;
    }

    let pag = '';
    for (let i = 1; i <= pages; i++) {
      pag += `<button type="button" class="btn btn-sm ${i === state.page ? 'btn-primary' : 'btn-outline-secondary'}" data-page="${i}" aria-label="Page ${i}" ${i === state.page ? 'aria-current="page"' : ''}>${i}</button>`;
    }
    pagWrap.innerHTML = pages > 1 ? pag : '';

    GM.announce(`${total} ${GM.t('catalog.summary.products')}. Page ${state.page} of ${pages}.`);
  }

  function emptyState() {
    return `<div class="text-center py-5 text-muted">
      <span class="material-symbols-outlined" style="font-size:3rem;opacity:.4" aria-hidden="true">search_off</span>
      <p class="fw-semibold mb-1 mt-2">${GM.t('catalog.empty.title')}</p>
      <button type="button" class="btn btn-sm btn-outline-primary" id="tt-empty-clear">${GM.t('catalog.empty.cta')}</button>
    </div>`;
  }

  function setupBrandList() {
    const sel = document.getElementById('tt-brand-filter');
    if (!sel) return;
    const brands = [...new Set(GM_PRODUCTS.map(p => p.brand))].sort();
    sel.innerHTML = `<option value="all">${GM.t('sidebar.brand.all')}</option>` + brands.map(b => `<option value="${b}">${b}</option>`).join('');
    sel.value = state.brand;
  }
  function setupSpecLists() {
    const motors = [...new Set(GM_PRODUCTS.map(p => p.motorPower).filter(Boolean))].sort();
    const batts  = [...new Set(GM_PRODUCTS.map(p => p.batteryType).filter(Boolean))].sort();
    const m = document.getElementById('tt-motor-filter');
    const b = document.getElementById('tt-battery-filter');
    if (m) { m.innerHTML = `<option value="all">${GM.t('sidebar.motor.any')}</option>` + motors.map(x => `<option value="${x}">${x}</option>`).join(''); m.value = state.motorPower; }
    if (b) { b.innerHTML = `<option value="all">${GM.t('sidebar.battery.any')}</option>` + batts.map(x => `<option value="${x}">${x}</option>`).join(''); b.value = state.batteryType; }
  }
  function setupCategoryList() {
    const wrap = document.getElementById('tt-cat-list');
    if (!wrap) return;
    wrap.innerHTML = `<button class="cat-link ${state.category==='all'?'is-active':''}" data-cat="all" type="button">
        <span class="material-symbols-outlined" aria-hidden="true">apps</span> ${GM.t('header.allCategories')}
      </button>` +
      TT_CATEGORIES.map(c => `<button class="cat-link ${state.category===c.id?'is-active':''}" data-cat="${c.id}" type="button">
          <span class="material-symbols-outlined" aria-hidden="true">${c.icon}</span> ${GM.localizedCategory ? GM.localizedCategory(c) : c.label}
        </button>`).join('');
  }
  function setupSortOptions() {
    const sel = document.getElementById('tt-sort');
    if (!sel) return;
    sel.innerHTML = `
      <option value="featured">${GM.t('catalog.sort.featured')}</option>
      <option value="price-asc">${GM.t('catalog.sort.priceAsc')}</option>
      <option value="price-desc">${GM.t('catalog.sort.priceDesc')}</option>
      <option value="rating">${GM.t('catalog.sort.rating')}</option>
      <option value="name">${GM.t('catalog.sort.name')}</option>`;
    sel.value = state.sort;
  }

  function bind() {
    document.getElementById('tt-cat-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      state.category = btn.dataset.cat;
      state.page = 1;
      setupCategoryList(); renderChips(); renderResults();
    });
    document.getElementById('tt-brand-filter')?.addEventListener('change', (e) => {
      state.brand = e.target.value; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-motor-filter')?.addEventListener('change', (e) => {
      state.motorPower = e.target.value; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-battery-filter')?.addEventListener('change', (e) => {
      state.batteryType = e.target.value; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-min-price')?.addEventListener('input', (e) => {
      state.minPrice = +e.target.value || 0; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-max-price')?.addEventListener('input', (e) => {
      state.maxPrice = +e.target.value || 25000; state.page = 1; renderChips(); renderResults();
    });
    document.getElementById('tt-sort')?.addEventListener('change', (e) => {
      state.sort = e.target.value; renderResults();
    });
    document.querySelectorAll('[data-view]').forEach(b =>
      b.addEventListener('click', () => {
        state.view = b.dataset.view;
        document.querySelectorAll('[data-view]').forEach(x => {
          x.classList.toggle('btn-primary', x === b);
          x.classList.toggle('btn-outline-secondary', x !== b);
          x.setAttribute('aria-pressed', x === b);
        });
        renderResults();
      })
    );
    document.getElementById('tt-active-chips')?.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-clear]');
      if (chip) {
        const k = chip.dataset.clear;
        if (k === 'price') {
          state.minPrice = 0; state.maxPrice = 25000;
          document.getElementById('tt-min-price').value = 0;
          document.getElementById('tt-max-price').value = 25000;
        }
        else if (k === 'q')        { state.q = ''; }
        else if (k === 'category') { state.category = 'all'; setupCategoryList(); }
        else if (k === 'brand')    { state.brand = 'all'; document.getElementById('tt-brand-filter').value = 'all'; }
        else if (k === 'motorPower'){ state.motorPower = 'all'; document.getElementById('tt-motor-filter').value = 'all'; }
        else if (k === 'batteryType'){ state.batteryType = 'all'; document.getElementById('tt-battery-filter').value = 'all'; }
        state.page = 1; renderChips(); renderResults();
      }
      if (e.target.id === 'tt-clear-all') {
        Object.assign(state, { q: '', category: 'all', brand: 'all', motorPower: 'all', batteryType: 'all', minPrice: 0, maxPrice: 25000, page: 1 });
        document.getElementById('tt-brand-filter').value = 'all';
        document.getElementById('tt-motor-filter').value = 'all';
        document.getElementById('tt-battery-filter').value = 'all';
        document.getElementById('tt-min-price').value = 0;
        document.getElementById('tt-max-price').value = 25000;
        setupCategoryList(); renderChips(); renderResults();
      }
    });
    document.getElementById('tt-pagination')?.addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (b) { state.page = +b.dataset.page; renderResults(); window.scrollTo({ top: document.getElementById('tt-grid').offsetTop - 80, behavior: 'smooth' }); }
    });
    document.getElementById('tt-grid')?.addEventListener('click', (e) => {
      if (e.target.id === 'tt-empty-clear') document.getElementById('tt-clear-all')?.click();
    });

    // Re-render on language change
    document.addEventListener('tt:lang-changed', () => {
      setupBrandList(); setupSpecLists(); setupCategoryList(); setupSortOptions();
      renderChips(); renderResults();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('tt-grid')) return;
    readUrl();
    setupBrandList();
    setupSpecLists();
    setupCategoryList();
    setupSortOptions();
    bind();
    renderChips();
    renderResults();
  });
})();
