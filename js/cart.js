document.addEventListener('DOMContentLoaded', () => {
  // === 1. СОСТОЯНИЕ КОРЗИНЫ ===
  let cart = JSON.parse(localStorage.getItem('zelenydom_cart')) || [];

  const cartCountEl   = document.getElementById('cart-count');
  const cartContainer = document.getElementById('cart-items-container');
  const cartTotalEl   = document.getElementById('cart-total-price');

  const openBtn  = document.getElementById('open-cart');
  const closeBtn = document.getElementById('close-cart');
  const overlay  = document.getElementById('cart-overlay');
  const sidebar  = document.getElementById('cart-sidebar');

  // === 2. ОТКРЫТИЕ/ЗАКРЫТИЕ (защита от отсутствия разметки) ===
  function toggleCart() {
    if (!sidebar) return;
    sidebar.classList.toggle('is-active');
    if (overlay) overlay.classList.toggle('is-active');
  }

  if (openBtn)  openBtn.addEventListener('click', toggleCart);
  if (closeBtn) closeBtn.addEventListener('click', toggleCart);
  if (overlay)  overlay.addEventListener('click', toggleCart);

  // === 3. СОХРАНЕНИЕ И ОТРИСОВКА ===
  function saveCart() {
    localStorage.setItem('zelenydom_cart', JSON.stringify(cart));
    renderCart();
  }

  function updateCount() {
    if (!cartCountEl) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    // Скрываем бейдж, когда корзина пуста
    cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
  }

  function renderCart() {
    if (!cartContainer) return;
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'cart-empty';
      empty.textContent = 'Ваша корзина пуста';
      cartContainer.appendChild(empty);
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
            <button class="minus-btn" type="button" data-index="${index}" aria-label="Меньше">-</button>
            <span>${item.quantity}</span>
            <button class="plus-btn" type="button" data-index="${index}" aria-label="Больше">+</button>
            <button class="cart-item__remove" type="button" data-index="${index}">Удалить</button>
          </div>
        </div>
      `;
      cartContainer.appendChild(div);
    });

    if (cartTotalEl) cartTotalEl.textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    updateCount();
  }

  // Делегирование: один обработчик на контейнер
  if (cartContainer) {
    cartContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const idx = Number(btn.dataset.index);
      if (Number.isNaN(idx) || !cart[idx]) return;

      if (btn.classList.contains('plus-btn')) {
        cart[idx].quantity += 1;
        saveCart();
      } else if (btn.classList.contains('minus-btn')) {
        if (cart[idx].quantity > 1) {
          cart[idx].quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        saveCart();
      } else if (btn.classList.contains('cart-item__remove')) {
        cart.splice(idx, 1);
        saveCart();
      }
    });
  }

  // === 4. ДОБАВЛЕНИЕ В КОРЗИНУ ===
  // catalog.js вызывает window.addToCart(product)
  window.addToCart = function (product) {
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
    toggleCart(); // открываем корзину, чтобы пользователь видел результат
  };

  // === 5. ОФОРМЛЕНИЕ ЗАКАЗА ===
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;

      const successDialog = document.getElementById('success-dialog');
      if (successDialog) {
        successDialog.showModal();
      } else {
        alert('Заказ оформлен!');
      }

      cart = [];
      saveCart();
      toggleCart();
    });
  }

  renderCart();
});
