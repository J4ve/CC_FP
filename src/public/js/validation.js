/* GenericMart - validation.js
   Inline checkout validation. Blueprint §5.4: SSL banner, masked card, CVV tooltip. */

(function () {
  'use strict';
  const TT = window.GM;

  const ERRS = {
    en: {
      email:   'Please enter a valid email (e.g. you@domain.com)',
      name:    'Please enter your full name',
      address: 'Please enter a street address',
      city:    'Please enter a city',
      zip:     'Postal code must be 4 digits',
      country: 'Please choose a country',
      card:    'Card number must be 13–19 digits',
      expiry:  'Expiry format MM/YY',
      cvv:     'CVV is 3 or 4 digits',
      terms:   'You must accept the terms to continue'
    },
    no: {
      email:   'Skriv inn en gyldig e-post (f.eks. du@domene.no)',
      name:    'Skriv inn fullt navn',
      address: 'Skriv inn en gateadresse',
      city:    'Skriv inn en by',
      zip:     'Postnummer må være 4 sifre',
      country: 'Velg et land',
      card:    'Kortnummer må være 13–19 sifre',
      expiry:  'Utløp må være MM/ÅÅ',
      cvv:     'CVV er 3 eller 4 sifre',
      terms:   'Du må godta vilkårene for å fortsette'
    }
  };
  const errFor = (k) => ((TT && ERRS[GM.lang]) || ERRS.en)[k];

  const RULES = {
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || errFor('email'),
    name:    v => v.trim().length >= 2 || errFor('name'),
    address: v => v.trim().length >= 4 || errFor('address'),
    city:    v => v.trim().length >= 2 || errFor('city'),
    zip:     v => /^[0-9]{4}$/.test(v) || errFor('zip'),
    country: v => !!v || errFor('country'),
    card:    v => /^[0-9]{13,19}$/.test(v.replace(/\s/g,'')) || errFor('card'),
    expiry:  v => /^(0[1-9]|1[0-2])\s*\/\s*[0-9]{2}$/.test(v) || errFor('expiry'),
    cvv:     v => /^[0-9]{3,4}$/.test(v) || errFor('cvv'),
    terms:   v => !!v || errFor('terms')
  };

  function showError(input, msg) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    let fb = input.parentElement.querySelector('.invalid-feedback');
    if (!fb) {
      fb = document.createElement('div');
      fb.className = 'invalid-feedback';
      input.parentElement.appendChild(fb);
    }
    fb.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }
  function clearError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
  }
  function validateField(input) {
    const rule = RULES[input.dataset.rule];
    if (!rule) return true;
    const result = rule(input.type === 'checkbox' ? input.checked : input.value);
    if (result === true) { clearError(input); return true; }
    showError(input, result); return false;
  }

  function setupForm(form) {
    const card = form.querySelector('[data-rule="card"]');
    if (card) card.addEventListener('input', () => {
      const digits = card.value.replace(/\D/g,'').slice(0,19);
      card.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });
    const exp = form.querySelector('[data-rule="expiry"]');
    if (exp) exp.addEventListener('input', () => {
      let v = exp.value.replace(/\D/g,'').slice(0,4);
      if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
      exp.value = v;
    });

    form.querySelectorAll('[data-rule]').forEach(inp => {
      inp.addEventListener('blur', () => validateField(inp));
      inp.addEventListener('input', () => {
        if (inp.classList.contains('is-invalid')) validateField(inp);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      form.querySelectorAll('[data-rule]').forEach(f => {
        if (!validateField(f) && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        GM.toast('Please fix the highlighted fields', 'error');
        GM.announce('Form contains errors. Please review highlighted fields.');
        return;
      }
      const cart = GM.getCart();
      if (!cart.length) { GM.toast('Cart is empty', 'error'); return; }
      const orderId = 'TT-' + Date.now().toString().slice(-7);
      localStorage.setItem('tt_last_order', JSON.stringify({ id: orderId, when: new Date().toISOString(), items: cart }));
      GM.saveCart([]);
      const page = document.getElementById('tt-checkout-page');
      page.innerHTML = `<div class="text-center py-5">
        <span class="material-symbols-outlined text-success" style="font-size:5rem" aria-hidden="true">check_circle</span>
        <h1 class="h3 fw-bold mt-3">${GM.t('checkout.confirmed.title')}</h1>
        <p class="text-muted">${GM.t('checkout.confirmed.body', { id: '<strong>'+orderId+'</strong>' }).replace('&lt;strong&gt;', '<strong>').replace('&lt;/strong&gt;', '</strong>')}</p>
        <a href="index.html" class="btn btn-primary mt-2">${GM.t('checkout.confirmed.home')}</a>
        <a href="catalog.html" class="btn btn-outline-secondary mt-2 ms-2">${GM.t('checkout.confirmed.shop')}</a>
      </div>`;
      GM.announce(GM.t('checkout.confirmed.title') + ' ' + orderId);
      window.scrollTo({ top: 0 });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tt-checkout-form');
    if (form) setupForm(form);
  });
})();
