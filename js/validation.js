document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput  = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const emailInput = document.getElementById('contact-email');
  const consent    = document.getElementById('contact-consent');
  const errorBox   = document.getElementById('form-errors');
  const successBox = document.getElementById('form-success');

  // Маска телефона: поддерживает ввод и с 8, и с 7
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '');
      if (!digits) { phoneInput.value = ''; return; }
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (!digits.startsWith('7')) digits = '7' + digits;
      digits = digits.slice(0, 11);

      let res = '+7';
      if (digits.length > 1) res += ' (' + digits.slice(1, 4);
      if (digits.length >= 5) res += ') ' + digits.slice(4, 7);
      if (digits.length >= 8) res += '-' + digits.slice(7, 9);
      if (digits.length >= 10) res += '-' + digits.slice(9, 11);
      phoneInput.value = res;
    });
  }

  // Сброс aria-invalid при исправлении
  [nameInput, phoneInput, emailInput, consent].forEach((el) => {
    if (!el) return;
    el.addEventListener('input', () => el.removeAttribute('aria-invalid'));
    el.addEventListener('change', () => el.removeAttribute('aria-invalid'));
  });

  const setInvalid = (el, invalid) => {
    if (!el) return;
    if (invalid) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorBox.textContent = '';
    errorBox.hidden = true;
    successBox.hidden = true;

    const errors = [];

    const nameOk = nameInput && nameInput.value.trim().length >= 2;
    if (!nameOk) errors.push('Имя должно содержать минимум 2 символа.');
    setInvalid(nameInput, !nameOk);

    const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    const phoneOk = phoneDigits.length === 11;
    if (!phoneOk) errors.push('Введите корректный номер телефона (11 цифр).');
    setInvalid(phoneInput, !phoneOk);

    const emailOk = !emailInput || !emailInput.value.trim() ||
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailInput.value.trim());
    if (!emailOk) errors.push('Введите корректный E-mail.');
    setInvalid(emailInput, !emailOk);

    const consentOk = consent && consent.checked;
    if (!consentOk) errors.push('Необходимо согласие на обработку персональных данных.');
    setInvalid(consent, !consentOk);

    if (errors.length > 0) {
      const list = document.createElement('ul');
      errors.forEach(err => {
        const li = document.createElement('li');
        li.textContent = err;
        list.appendChild(li);
      });
      errorBox.innerHTML = '';
      errorBox.appendChild(list);
      errorBox.hidden = false;
    } else {
      successBox.textContent = 'Заявка успешно отправлена! Мы свяжемся с вами.';
      successBox.hidden = false;
      form.reset();
    }
  });
});
