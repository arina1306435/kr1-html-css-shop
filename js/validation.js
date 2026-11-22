document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form'); // Форма на странице контактов
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const emailInput = document.getElementById('contact-email'); // Добавьте это поле в HTML, если его нет
  const errorBox = document.getElementById('form-errors');
  const successBox = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorBox.textContent = '';
    errorBox.hidden = true;
    successBox.hidden = true;
    let errors = [];

    // Валидация имени
    if (nameInput.value.trim().length < 2) {
      errors.push("Имя должно содержать минимум 2 символа.");
    }

    // Валидация телефона
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 11) {
      errors.push("Введите корректный номер телефона (11 цифр).");
    }

    // Валидация email (если поле добавлено)
    if (emailInput && !emailInput.value.includes('@')) {
      errors.push("Введите корректный E-mail.");
    }

    // Вывод результата
    if (errors.length > 0) {
      errorBox.textContent = errors.join(' ');
      errorBox.hidden = false;
    } else {
      successBox.textContent = "Заявка успешно подготовлена! Мы свяжемся с вами.";
      successBox.hidden = false;
      form.reset();
    }
  });
});