// 1. Находим элементы страницы по их id

// Модальное окно с формой
const dialog = document.getElementById('order-dialog');

// Все кнопки "Заказать" в карточках товаров
const orderButtons = document.querySelectorAll('.product-card__button');

// Кнопка "Закрыть" внутри модального окна
const closeButton = document.getElementById('close-order-dialog');

// Скрытое поле, куда запишем название товара
const selectedProductInput = document.getElementById('selected-product');


// 2. Открытие модального окна

// Перебираем все кнопки "Заказать"
orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Из кнопки читаем, какой это товар
    const productName = button.dataset.product;

    // Записываем название в скрытое поле формы
    selectedProductInput.value = productName;

    // Открываем модальное окно
    dialog.showModal();
  });
});


// 3. Закрытие модального окна

closeButton.addEventListener('click', () => {
  dialog.close();
});


// 4. Отправка формы

// Находим форму и сообщение об успехе
const form = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', (event) => {
  // Отменяем стандартную отправку (перезагрузку страницы)
  event.preventDefault();

  // Проверяем, все ли поля заполнены правильно
  if (!form.checkValidity()) {
    // Если нет — браузер сам покажет подсказки
    form.reportValidity();
    return;
  }

  // Если всё ок:
  // 1) показываем сообщение
  successMessage.hidden = false;

  // 2) очищаем форму
  form.reset();

  // 3) закрываем модальное окно
  dialog.close();
});