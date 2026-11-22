document.addEventListener('DOMContentLoaded', () => {
  // === 1. СОСТОЯНИЕ КОРЗИНЫ ===
  let cart = JSON.parse(localStorage.getItem('zelenydom_cart')) || [];

  const cartCountEl = document.getElementById('cart-count');
  const cartContainer = document.getElementById('cart-items-container');
  const cartTotalEl = document.getElementById('cart-total-price');
  
  const openBtn = document.getElementById('open-cart');
  const closeBtn = document.getElementById('close-cart');
  const overlay = document.getElementById('cart-overlay');
  const sidebar = document.getElementById('cart-sidebar');

  // === 2. ОТКРЫТИЕ/ЗАКРЫТИЕ ===
  function toggleCart() {
    sidebar.classList.toggle('is-active');
    overlay.classList.toggle('is-active');
  }

  if (openBtn) openBtn.addEventListener('click', toggleCart);
  if (closeBtn) closeBtn.addEventListener('click', toggleCart);
  if (overlay) overlay.addEventListener('click', toggleCart);

  // === 3. СОХРАНЕНИЕ И ОТРИСОВКА ===
  function saveCart() {
    localStorage.setItem('zelenydom_cart', JSON.stringify(cart));
    renderCart();
  }

  function updateCount() {
    if (cartCountEl) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountEl.textContent = totalItems;
    }
  }

  function renderCart() {
    if (!cartContainer) return;
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p style="text-align:center; color:#888;">Ваша корзина пуста</p>';
      if (cartTotalEl) cartTotalEl.textContent = '0 ₽';
      updateCount();
      return;
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
      totalPrice += item.price * item.quantity;

      const div = document.createElement('div');
      div.className = 'cart-item';
      
      div.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item__img">
        <div class="cart-item__info">
          <h4 class="cart-item__title">${item.title}</h4>
          <p class="cart-item__price">${item.price.toLocaleString('ru-RU')} ₽</p>
          <div class="cart-item__controls">
            <button class="minus-btn" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="plus-btn" data-index="${index}">+</button>
            <button class="cart-item__remove" data-index="${index}">Удалить</button>
          </div>
        </div>
      `;
      cartContainer.appendChild(div);
    });

    if (cartTotalEl) cartTotalEl.textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    updateCount();

    // Обработчики для кнопок + и -
    document.querySelectorAll('.plus-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        cart[idx].quantity += 1;
        saveCart();
      });
    });

    document.querySelectorAll('.minus-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        if (cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        saveCart();
      });
    });

    document.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.getAttribute('data-index');
        cart.splice(idx, 1);
        saveCart();
      });
    });
  }

  // === 4. ДОБАВЛЕНИЕ В КОРЗИНУ ===
  // Экспортируем функцию глобально, чтобы catalog.js мог её вызвать
  window.addToCart = function(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    saveCart();
    toggleCart(); // Автоматически открываем корзину при добавлении
  };

  // Оформление заказа
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length > 0) {
        alert("Заказ оформлен!"); // В будущем здесь будет переход на страницу order.html
        cart = [];
        saveCart();
        toggleCart();
      }
    });
  }

  // Инициализация
  renderCart();
});