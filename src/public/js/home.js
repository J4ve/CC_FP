/* GenericMart - home.js
   Featured products + filter pills on homepage. */

(function () {
  'use strict';
  const TT = window.GM;
  let activePill = 'all';

  function render() {
    const grid = document.getElementById('tt-featured');
    if (!grid) return;
    let list = GM_PRODUCTS.slice();
    if (activePill === 'drones')   list = list.filter(p => p.category === 'drones');
    if (activePill === 'vehicles') list = list.filter(p => p.category === 'vehicles');
    if (activePill === 'sale')     list = list.filter(p => !!p.salePrice);
    list = list.slice(0, 8);
    grid.classList.add('tt-grid-products');
    grid.innerHTML = list.map(p => GM.productCardHtml(p)).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('tt-featured')) return;
    document.querySelectorAll('[data-pill]').forEach(b =>
      b.addEventListener('click', () => {
        activePill = b.dataset.pill;
        document.querySelectorAll('[data-pill]').forEach(x => x.classList.toggle('is-active', x === b));
        render();
      })
    );
    render();
    document.addEventListener('tt:lang-changed', render);
  });
})();
