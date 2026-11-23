// ============================================================
// catalog.js — логика каталога: рендер, поиск, фильтр, сортировка,
// пустое состояние, модальное окно товара, переход к заявке
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('products-container');
  if (!grid || typeof products === 'undefined') return; // каталог есть не на всех страницах

  const searchInput = document.getElementById('search-input');
  const filterSelect = document.getElementById('filter-select');
  const sortSelect = document.getElementById('sort-select');
  const countEl = document.getElementById('products-count');
  const emptyState = document.getElementById('empty-state');
  const resetBtn = document.getElementById('reset-filters');

  // --- Элементы модального окна товара ---
  const productDialog = document.getElementById('product-dialog');
  const closeProductDialog = document.getElementById('close-product-dialog');
  const pdImg = document.getElementById('pd-img');
  const pdTitle = document.getElementById('pd-title');
  const pdSku = document.getElementById('pd-sku');
  const pdPrice = document.getElementById('pd-price');
  const pdDesc = document.getElementById('pd-desc');
  const pdOrderBtn = document.getElementById('pd-order-btn');

  // --- Элементы модального окна заявки ---
  const orderDialog = document.getElementById('order-dialog');
  const closeOrderDialog = document.getElementById('close-order-dialog');
  const orderProductInput = document.getElementById('order-product');

  let currentProduct = null;

  // ============================================================
  // 1. ФОРМАТИРОВАНИЕ ЦЕНЫ
  // ============================================================

  function formatPrice(value) {
    return new Intl.NumberFormat('ru-RU').format(value) + ' руб.';
  }

  // ============================================================
  // 2. РЕНДЕР КАРТОЧКИ ТОВАРА
  // ============================================================

  function createCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.alt || product.title; // описательный alt из data.js
    img.className = 'product-card__img';
    img.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'product-card__body';

    const title = document.createElement('h3');
    title.className = 'product-card__title';
    title.textContent = product.title;

    const desc = document.createElement('p');
    desc.className = 'product-card__desc';
    desc.textContent = product.desc;

    const price = document.createElement('p');
    price.className = 'product-card__price';
    price.textContent = formatPrice(product.price);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--outline product-card__button';
    btn.textContent = 'Заказать';
    btn.setAttribute('aria-label', 'Заказать ' + product.title);
    btn.addEventListener('click', () => openProductDialog(product));

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(price);
    body.appendChild(btn);

    card.appendChild(img);
    card.appendChild(body);

    // Клик по всей карточке тоже открывает модалку товара
    card.addEventListener('click', (e) => {
      if (e.target === btn) return;
      openProductDialog(product);
    });

    return card;
  }

  // ============================================================
  // 3. ФИЛЬТРАЦИЯ, ПОИСК И СОРТИРОВКА
  // ============================================================

  function getFilteredProducts() {
    let list = products.slice();

    // Фильтр по категории (select)
    const category = filterSelect ? filterSelect.value : 'all';
    if (category && category !== 'all') {
      list = list.filter(p => p.category === category);
    }

    // Поиск по названию и описанию
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (query) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(query) ||
        (p.desc || '').toLowerCase().includes(query)
      );
    }

    // Сортировка
    const sort = sortSelect ? sortSelect.value : 'default';
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'name') list.sort((a, b) => a.title.localeCompare(b.title, 'ru'));

    return list;
  }

  function render() {
    const list = getFilteredProducts();

    grid.innerHTML = '';
    list.forEach(product => grid.appendChild(createCard(product)));

    if (countEl) {
      countEl.textContent = 'Найдено товаров: ' + list.length;
    }

    if (emptyState) {
      emptyState.hidden = list.length > 0;
    }
  }

  // ============================================================
  // 4. МОДАЛЬНОЕ ОКНО ТОВАРА
  // ============================================================

  function openProductDialog(product) {
    currentProduct = product;

    if (pdImg) {
      pdImg.src = product.image;
      pdImg.alt = product.alt || product.title;
    }
    if (pdTitle) pdTitle.textContent = product.title;
    if (pdSku) pdSku.textContent = 'Артикул: ' + (product.sku || 'PL-' + String(product.id).padStart(3, '0'));
    if (pdPrice) pdPrice.textContent = formatPrice(product.price);
    if (pdDesc) pdDesc.textContent = product.desc;

    if (productDialog && typeof productDialog.showModal === 'function') {
      productDialog.showModal();
    }
  }

  if (closeProductDialog) {
    closeProductDialog.addEventListener('click', () => {
      if (productDialog) productDialog.close();
    });
  }

  // Кнопка «Оформить заявку» в модалке товара:
  // подставляем название товара в заявку и открываем форму
  if (pdOrderBtn) {
    pdOrderBtn.addEventListener('click', () => {
      if (orderProductInput && currentProduct) {
        orderProductInput.value = currentProduct.title;
        const interest = document.getElementById('order-interest');
        if (interest) interest.value = currentProduct.title;
      }
      if (productDialog) productDialog.close();
      if (orderDialog && typeof orderDialog.showModal === 'function') {
        orderDialog.showModal();
      }
    });
  }

  if (closeOrderDialog) {
    closeOrderDialog.addEventListener('click', () => {
      if (orderDialog) orderDialog.close();
    });
  }

  // ============================================================
  // 5. СОБЫТИЯ ФИЛЬТРОВ
  // ============================================================

  if (searchInput) searchInput.addEventListener('input', render);
  if (filterSelect) filterSelect.addEventListener('change', render);
  if (sortSelect) sortSelect.addEventListener('change', render);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (filterSelect) filterSelect.value = 'all';
      if (sortSelect) sortSelect.value = 'default';
      render();
      if (searchInput) searchInput.focus();
    });
  }

  // Фильтрация по ссылке из боковой панели (#flowers, #succulents, #palms)
  function applyHashFilter() {
    if (!filterSelect) return;
    const hash = window.location.hash.replace('#', '');
    const valid = ['flowers', 'succulents', 'palms'];
    if (valid.includes(hash)) {
      filterSelect.value = hash;
    }
  }

  window.addEventListener('hashchange', () => {
    applyHashFilter();
    render();
  });

  // ============================================================
  // 6. СТАРТ
  // ============================================================

  applyHashFilter();
  render();
});
