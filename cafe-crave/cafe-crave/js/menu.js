/* ===== Cafe Crave — Menu data, filters, search, featured dishes ===== */
(function () {
  'use strict';

  const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

  const ITEMS = [
    // Coffee
    { id: 'c1', name: 'Signature Crave Latte', cat: 'Coffee', price: 180, featured: true, tag: 'Bestseller',
      desc: 'Double espresso, steamed milk and a hint of caramel, finished with latte art.', img: U('1572490122747-3968b75cc699') },
    { id: 'c2', name: 'Classic Cappuccino', cat: 'Coffee', price: 170,
      desc: 'Rich espresso topped with a thick cap of velvety milk foam.', img: U('1559056199-641a0ac8b55e') },
    { id: 'c3', name: 'Cold Brew', cat: 'Coffee', price: 210,
      desc: 'Slow-steeped for 18 hours. Smooth, bold and served over ice.', img: U('1517701604599-bb29b565090c') },
    { id: 'c4', name: 'Filter Coffee', cat: 'Coffee', price: 120,
      desc: 'Traditional South Indian decoction with frothy hot milk.', img: U('1495474472287-4d71bcdd2085') },
    // Breakfast
    { id: 'b1', name: 'Avocado Sourdough Toast', cat: 'Breakfast', price: 280, featured: true, tag: 'Vegetarian',
      desc: 'Smashed avocado, cherry tomatoes, feta and chilli flakes on toasted sourdough.', img: U('1482049016688-2d3e1b311543') },
    { id: 'b2', name: 'Fluffy Berry Pancakes', cat: 'Breakfast', price: 260,
      desc: 'Stack of buttermilk pancakes with mixed berries and maple syrup.', img: U('1567620905732-2d1ec7ab7445') },
    { id: 'b3', name: 'Masala Omelette Plate', cat: 'Breakfast', price: 220,
      desc: 'Three-egg omelette with onions, green chilli and coriander, served with toast.', img: U('1525351484163-7529414344d8') },
    // Mains
    { id: 'm1', name: 'Wood-Fired Margherita Pizza', cat: 'Mains', price: 380, featured: true, tag: 'Chef’s Pick',
      desc: 'Hand-stretched base, San Marzano tomato, fresh mozzarella and basil.', img: U('1565299624946-b28f40a0ae38') },
    { id: 'm2', name: 'Grilled Chicken Burger', cat: 'Mains', price: 340,
      desc: 'Juicy grilled chicken, cheddar, lettuce and house sauce in a toasted brioche bun.', img: U('1568901346375-23c9450c58cd') },
    { id: 'm3', name: 'Creamy Pesto Pasta', cat: 'Mains', price: 360, featured: true, tag: 'Vegetarian',
      desc: 'Penne tossed in basil pesto cream sauce with sun-dried tomatoes and parmesan.', img: U('1621996346565-e3dbc646d9a9') },
    { id: 'm4', name: 'Paneer Tikka Wrap', cat: 'Mains', price: 290, tag: 'Vegetarian',
      desc: 'Smoky paneer tikka, mint chutney and crunchy veggies in a warm wrap.', img: U('1626700051175-6818013e1d4f') },
    { id: 'm5', name: 'Rainbow Quinoa Bowl', cat: 'Mains', price: 320, tag: 'Healthy',
      desc: 'Quinoa, roasted veggies, chickpeas and avocado with lemon-tahini dressing.', img: U('1512621776951-a57141f2eefd') },
    // Desserts
    { id: 'd1', name: 'Molten Chocolate Lava Cake', cat: 'Desserts', price: 220, featured: true, tag: 'Sweet Treat',
      desc: 'Warm dark chocolate cake with a gooey centre and vanilla ice cream.', img: U('1578985545062-69928b1d9587') },
    { id: 'd2', name: 'Classic Tiramisu', cat: 'Desserts', price: 250,
      desc: 'Espresso-soaked ladyfingers layered with mascarpone cream and cocoa.', img: U('1571877227200-a0d98ea607e9') },
    { id: 'd3', name: 'New York Cheesecake', cat: 'Desserts', price: 240,
      desc: 'Creamy baked cheesecake on a buttery biscuit base with berry compote.', img: U('1565958011703-44f9829ba187') },
    // Drinks
    { id: 'r1', name: 'Fresh Mint Lemonade', cat: 'Drinks', price: 130,
      desc: 'Zesty lemon, crushed mint and a touch of sugar over ice.', img: U('1556679343-c7306c1976bc') },
    { id: 'r2', name: 'Mango Smoothie', cat: 'Drinks', price: 190, featured: true, tag: 'Seasonal',
      desc: 'Alphonso mango blended with yoghurt and a drizzle of honey.', img: U('1553530666-ba11a7da3888') },
    { id: 'r3', name: 'Iced Peach Tea', cat: 'Drinks', price: 160,
      desc: 'Chilled black tea infused with ripe peach and a slice of lemon.', img: U('1499638673689-79a0b5115d87') }
  ];

  const CATS = ['All', ...new Set(ITEMS.map(i => i.cat))];
  const { addToCart, money, reveal } = window.CafeCrave;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function card(i, animate) {
    return `<article class="dish-card${animate ? ' reveal' : ''}">
      <div class="dish-img"><img src="${esc(i.img)}" alt="${esc(i.name)}" loading="lazy"><span class="tag">${esc(i.tag || i.cat)}</span></div>
      <div class="dish-body"><h3>${esc(i.name)}</h3><p>${esc(i.desc)}</p>
        <div class="dish-foot"><span class="price">${money(i.price)}</span>
          <button class="btn btn-primary btn-sm" data-add="${esc(i.id)}" aria-label="Add ${esc(i.name)} to cart">Add to Cart</button></div></div>
    </article>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Add-to-cart (works for every page that renders dish cards)
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      const item = ITEMS.find(i => i.id === btn.dataset.add);
      if (item) addToCart(item);
    });

    // Featured dishes (home page)
    const featured = document.getElementById('featured-grid');
    if (featured) {
      featured.innerHTML = ITEMS.filter(i => i.featured).slice(0, 6).map(i => card(i, true)).join('');
      reveal();
    }

    // Full menu page
    const grid = document.getElementById('menu-grid');
    if (!grid) return;
    const filters = document.getElementById('menu-filters');
    const search = document.getElementById('menu-search');
    const empty = document.getElementById('no-results');
    let cat = 'All';

    filters.innerHTML = CATS.map(c =>
      `<button type="button" class="chip${c === cat ? ' active' : ''}" data-cat="${c}" aria-pressed="${c === cat}">${c}</button>`).join('');

    function render() {
      const q = search.value.trim().toLowerCase();
      const list = ITEMS.filter(i =>
        (cat === 'All' || i.cat === cat) &&
        (!q || (i.name + ' ' + i.desc + ' ' + i.cat).toLowerCase().includes(q)));
      grid.innerHTML = list.map(i => card(i, false)).join('');
      empty.hidden = list.length > 0;
    }

    filters.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b) return;
      cat = b.dataset.cat;
      filters.querySelectorAll('.chip').forEach(c => {
        const on = c === b;
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', on);
      });
      render();
    });
    search.addEventListener('input', render);
    render();
  });
})();
