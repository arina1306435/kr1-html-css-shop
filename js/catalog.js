document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('products-container');
  if (!container) return; // Если мы не на странице каталога — выходим

  const searchInput = document.getElementById('search-input');
  const filterSelect = document.getElementById('filter-select');
  const sortSelect = document.getElementById('sort-select');
  const countDisplay = document.getElementById('products-count');
  const emptyState = document.getElementById('empty-state');
  
  // Функция форматирования цены
  const formatPrice = (price) => price.toLocaleString('ru-RU') + ' ₽';

  // Главная функция рендера
  function renderProducts(items) {
    container.innerHTML = ''; 
    
    if (items.length === 0) {
      emptyState.hidden = false;
      countDisplay.textContent = 'Найдено товаров: 0';
      return;
    } else {
      emptyState.hidden = true;
    }

    countDisplay.textContent = `Найдено товаров: ${items.length}`;

    items.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';

      const img = document.createElement('img');
      img.src = product.image;
      img.alt = product.title;
      img.className = 'product-card__img';
      
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

      // ... внутри цикла items.forEach(product => { ...

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn--outline add-to-cart-btn'; // Добавили класс
      btn.textContent = product.isAvailable ? 'В корзину' : 'Нет в наличии'; // Поменяли текст
      if (!product.isAvailable) btn.disabled = true;

      // Обработчик добавления в корзину
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Чтобы не открывалась модалка при клике на кнопку
        if (window.addToCart) {
            window.addToCart(product);
        }
      });

      // ... дальше сборка body.append(title, desc, price, btn); ...

      // --- ЛОГИКА ОТКРЫТИЯ МОДАЛКИ ---
      // Добавляем обработчик на всю карточку (или только на кнопку)
      card.addEventListener('click', (e) => {
        // Если кнопка заблокирована, ничего не делаем
        if (!product.isAvailable) return;

        const pdTitle = document.getElementById('pd-title');
        const pdPrice = document.getElementById('pd-price');
        const pdImg = document.getElementById('pd-img');
        const pdDesc = document.getElementById('pd-desc');
        const pdSku = document.getElementById('pd-sku');
        const productDialog = document.getElementById('product-dialog');

        if (pdTitle) pdTitle.textContent = product.title;
        if (pdPrice) pdPrice.textContent = formatPrice(product.price);
        if (pdImg) pdImg.src = product.image;
        if (pdDesc) pdDesc.textContent = product.desc;
        if (pdSku) pdSku.textContent = 'Артикул: PL-' + String(product.id).padStart(3, '0');
        
        // Передаем название в кнопку "Оформить заявку" внутри модалки
        const orderBtn = document.getElementById('pd-order-btn');
        if (orderBtn) {
            // Удаляем старые обработчики, чтобы не дублировались
            const newOrderBtn = orderBtn.cloneNode(true);
            orderBtn.parentNode.replaceChild(newOrderBtn, orderBtn);
            newOrderBtn.addEventListener('click', () => {
                document.getElementById('product-dialog').close();
                
                // Открываем окно заявки и подставляем товар
                const orderDialog = document.getElementById('order-dialog');
                const orderProductInput = document.getElementById('order-product');
                const orderInterestSelect = document.getElementById('order-interest');
                
                if (orderProductInput) orderProductInput.value = product.title;
                if (orderInterestSelect) {
                    for (let option of orderInterestSelect.options) {
                        if (option.value === product.title || option.text === product.title) {
                            orderInterestSelect.value = option.value;
                            break;
                        }
                    }
                }
                if (orderDialog) orderDialog.showModal();
            });
        }

        if (productDialog) productDialog.showModal();
      });

      // Сборка
      body.append(title, desc, price, btn);
      card.append(img, body);
      container.append(card);
    });
  }
  // Фильтрация и сортировка
  function updateCatalog() {
    let filtered = [...products]; // Копия массива!

    // Поиск
    if (searchInput && searchInput.value) {
      const query = searchInput.value.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(query));
    }

    // Фильтр
    if (filterSelect && filterSelect.value !== 'all') {
      filtered = filtered.filter(p => p.category === filterSelect.value);
    }

    // Сортировка
    if (sortSelect) {
      if (sortSelect.value === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortSelect.value === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortSelect.value === 'name') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }
    }

    renderProducts(filtered);
  }

  // Слушатели событий
  if (searchInput) searchInput.addEventListener('input', updateCatalog);
  if (filterSelect) filterSelect.addEventListener('change', updateCatalog);
  if (sortSelect) sortSelect.addEventListener('change', updateCatalog);

  // Первый рендер
  updateCatalog();
});