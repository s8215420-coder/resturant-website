/* ===== Cafe Crave — Shared logic (header, footer, cart, toast, animations) ===== */
(function () {
  'use strict';

  const CART_KEY = 'cafeCraveCart';
  const GST_RATE = 0.05;
  const NAV = [
    ['index.html', 'Home'], ['menu.html', 'Menu'], ['about.html', 'About'],
    ['reservation.html', 'Reservation'], ['contact.html', 'Contact']
  ];
  const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450"><rect width="100%" height="100%" fill="#f4ead6"/>' +
    '<text x="50%" y="50%" fill="#1f3d2b" font-family="Georgia" font-size="34" text-anchor="middle">Cafe Crave</text></svg>');

  const money = n => '₹' + Number(n).toLocaleString('en-IN');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Cart (LocalStorage) ---------- */
  function getCart() {
    try { const c = JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(c) ? c : []; }
    catch (e) { return []; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage blocked */ }
    updateCount();
  }
  function addToCart(item) {
    const cart = getCart();
    const found = cart.find(i => i.id === item.id);
    if (found) found.qty += 1;
    else cart.push({ id: item.id, name: item.name, price: Number(item.price), img: item.img, qty: 1 });
    saveCart(cart);
    toast(item.name + ' added to cart');
  }
  function changeQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty < 1) cart = cart.filter(i => i.id !== id);
    saveCart(cart);
  }
  function removeItem(id) { saveCart(getCart().filter(i => i.id !== id)); }
  function totals(cart) {
    const subtotal = cart.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0);
    const gst = Math.round(subtotal * GST_RATE);
    return { subtotal, gst, total: subtotal + gst };
  }
  function updateCount() {
    const count = getCart().reduce((s, i) => s + Number(i.qty), 0);
    document.querySelectorAll('.cart-count').forEach(el => { el.textContent = count; });
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- Header & Footer ---------- */
  function renderHeader() {
    const host = document.getElementById('site-header');
    if (!host) return;
    const page = location.pathname.split('/').pop() || 'index.html';
    const links = NAV.map(([href, label]) =>
      `<li><a href="${href}" class="${page === href ? 'active' : ''}">${label}</a></li>`).join('');
    host.innerHTML = `
      <div class="container nav">
        <a class="brand" href="index.html" aria-label="Cafe Crave home">Cafe <em>Crave</em></a>
        <button class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-links"><span></span><span></span><span></span></button>
        <ul class="nav-links" id="nav-links">
          ${links}
          <li><a href="cart.html" class="cart-link ${page === 'cart.html' ? 'active' : ''}">Cart <span class="cart-count" aria-live="polite">0</span></a></li>
        </ul>
      </div>`;
    const toggle = host.querySelector('.nav-toggle');
    const menu = host.querySelector('.nav-links');
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    menu.addEventListener('click', e => {
      if (e.target.closest('a')) { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  function renderFooter() {
    const host = document.getElementById('site-footer');
    if (!host) return;
    host.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div><a class="brand" href="index.html">Cafe <em>Crave</em></a>
            <p style="margin-top:1rem;font-size:.92rem">Good food. Great moments. Fresh ingredients, warm hospitality and flavours worth coming back for.</p></div>
          <div><h4>Explore</h4><ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}<li><a href="cart.html">Cart</a></li></ul></div>
          <div><h4>Visit Us</h4><ul>
            <li>12, Garden Street, Anna Nagar</li><li>Chennai, Tamil Nadu 600040</li>
            <li><a href="tel:+919876543210">+91 98765 43210</a></li><li>hello@cafecrave.example</li></ul></div>
          <div><h4>Follow</h4><ul>
            <li><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://x.com/" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
            <li><a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube</a></li></ul></div>
        </div>
        <p class="footer-bottom">© ${new Date().getFullYear()} Cafe Crave. Demo site: orders, bookings and messages are not sent anywhere.</p>
      </div>`;
  }

  /* ---------- Scroll reveal ---------- */
  function reveal() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visible')); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  /* ---------- Broken image fallback ---------- */
  document.addEventListener('error', e => {
    const t = e.target;
    if (t.tagName === 'IMG' && t.src !== FALLBACK_IMG) t.src = FALLBACK_IMG;
  }, true);

  /* ---------- Cart page ---------- */
  function renderCart() {
    const list = document.getElementById('cart-items');
    if (!list) return;
    const cart = getCart();
    document.getElementById('cart-empty').hidden = cart.length > 0;
    document.getElementById('cart-summary').hidden = cart.length === 0;
    list.innerHTML = cart.map(i => {
      const id = esc(i.id), name = esc(i.name), qty = Number(i.qty), price = Number(i.price);
      return `<li class="cart-item">
        <img src="${esc(i.img)}" alt="${name}">
        <div><h3>${name}</h3><span class="price">${money(price)}</span></div>
        <div class="qty" role="group" aria-label="Quantity for ${name}">
          <button data-action="dec" data-id="${id}" aria-label="Decrease quantity of ${name}">−</button>
          <span>${qty}</span>
          <button data-action="inc" data-id="${id}" aria-label="Increase quantity of ${name}">+</button></div>
        <strong class="ci-total">${money(price * qty)}</strong>
        <button class="ci-remove" data-action="remove" data-id="${id}" aria-label="Remove ${name}">✕</button></li>`;
    }).join('');
    const t = totals(cart);
    document.getElementById('subtotal').textContent = money(t.subtotal);
    document.getElementById('gst').textContent = money(t.gst);
    document.getElementById('total').textContent = money(t.total);
  }

  function initCartPage() {
    const list = document.getElementById('cart-items');
    if (!list) return;
    renderCart();
    list.addEventListener('click', e => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const { action, id } = btn.dataset;
      if (action === 'inc') changeQty(id, 1);
      if (action === 'dec') changeQty(id, -1);
      if (action === 'remove') removeItem(id);
      renderCart();
    });
    document.getElementById('clear-cart').addEventListener('click', () => { saveCart([]); renderCart(); });

    // Demo checkout modal
    const modal = document.getElementById('checkout-modal');
    const summary = document.getElementById('order-summary');
    const confirmBtn = document.getElementById('confirm-demo');
    const closeModal = () => { modal.hidden = true; };
    document.getElementById('checkout-btn').addEventListener('click', () => {
      const cart = getCart(), t = totals(cart);
      summary.innerHTML = '<ul>' + cart.map(i => `<li><span>${esc(i.name)} × ${Number(i.qty)}</span><span>${money(i.price * i.qty)}</span></li>`).join('') +
        `<li><span>GST (5%)</span><span>${money(t.gst)}</span></li><li><strong>Total</strong><strong>${money(t.total)}</strong></li></ul>`;
      confirmBtn.hidden = false;
      modal.hidden = false;
    });
    confirmBtn.addEventListener('click', () => {
      const ref = 'CC-DEMO-' + Math.floor(1000 + Math.random() * 9000);
      summary.innerHTML = `<p class="success-msg">Demo order ${ref} recorded. No real order was placed and no payment was taken.</p>`;
      confirmBtn.hidden = true;
      saveCart([]); renderCart();
    });
    document.getElementById('close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    updateCount();
    initCartPage();
    reveal();
    document.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalWidth === 0) img.src = FALLBACK_IMG;
    });
  });

  // Shared API for menu.js / other scripts
  window.CafeCrave = { addToCart, money, reveal, toast };
})();
