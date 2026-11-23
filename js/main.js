document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // ПРАКТИКА 15: Функции и расчеты
  // ==========================================

  function formatPrice(amount) {
    return amount.toLocaleString('ru-RU') + ' ₽';
  }

  function calculateDiscount(price, discountPercent) {
    const discount = (price * discountPercent) / 100;
    return {
      original: formatPrice(price),
      discount: formatPrice(discount),
      final: formatPrice(price - discount)
    };
  }

  function getProductStatus(inStock, stockCount) {
    if (inStock && stockCount > 3) return "В наличии (много)";
    if (inStock && stockCount > 0) return "В наличии (мало)";
    if (!inStock || stockCount === 0) return "Нет в наличии";
    return "Уточняйте у менеджера";
  }

  function getShortDescription(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  console.log("--- СТАРТ ПРАКТИКИ 15 ---");
  if (typeof shopName !== 'undefined' && typeof product !== 'undefined') {
    console.log(`Магазин: ${shopName}`);
    console.log("Данные товара:", product);

    if (isHolidaySale) {
      const discountInfo = calculateDiscount(product.price, product.discountPercent);
      console.log(`Скидка: ${discountInfo.discount}, Итоговая цена: ${discountInfo.final}`);
    }

    console.log(`Статус: ${getProductStatus(product.isAvailable, product.stockCount)}`);
    console.log(`Краткое описание: ${getShortDescription(product.description, 40)}`);
  }
  console.log("--- КОНЕЦ ПРАКТИКИ 15 ---");

  const messageElement = document.getElementById('js-message');
  if (messageElement && typeof shopName !== 'undefined' && typeof product !== 'undefined') {
    messageElement.textContent = `В магазине "${shopName}" доступно ${product.stockCount} шт. товара "${product.title}".`;
  }

  // ==========================================
  // МАСКА ТЕЛЕФОНА (#order-phone и все .phone-input)
  // На странице контактов маску вешает validation.js на #contact-phone
  // ==========================================

  function attachPhoneMask(input) {
    if (!input) return;
    input.addEventListener('input', () => {
      let digits = input.value.replace(/\D/g, '');
      if (!digits) { input.value = ''; return; }
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (!digits.startsWith('7')) digits = '7' + digits;
      digits = digits.slice(0, 11);

      let res = '+7';
      if (digits.length > 1) res += ' (' + digits.slice(1, 4);
      if (digits.length >= 5) res += ') ' + digits.slice(4, 7);
      if (digits.length >= 8) res += '-' + digits.slice(7, 9);
      if (digits.length >= 10) res += '-' + digits.slice(9, 11);
      input.value = res;
    });
  }

  document.querySelectorAll('.phone-input').forEach(attachPhoneMask);
  attachPhoneMask(document.getElementById('order-phone'));

  // ==========================================
  // КНОПКА НАВЕРХ
  // ==========================================

  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) scrollTopBtn.classList.add('show');
      else scrollTopBtn.classList.remove('show');
    });
    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // ВЫПАДАЮЩЕЕ МЕНЮ (мобильная версия)
  // ==========================================

  document.querySelectorAll('.site-nav__item--dropdown').forEach((item) => {
    const trigger = item.querySelector('.site-nav__link--dropdown');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isOpen = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

  // ==========================================
  // СЛАЙДЕР ПОПУЛЯРНЫХ РАСТЕНИЙ
  // ==========================================

  const track = document.getElementById('slider-track');
  const dotsContainer = document.getElementById('slider-dots');
  if (track && dotsContainer) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoplayTimer = null;

    // Стрелки из разметки index.html
    const prevBtn = document.querySelector('.slider__arrow--prev');
    const nextBtn = document.querySelector('.slider__arrow--next');

    const updateSlidesPerView = () => {
      if (window.innerWidth <= 576) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    };

    const maxIndex = () => Math.max(0, slides.length - updateSlidesPerView());

    const renderDots = () => {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const dot = document.createElement('button');
        dot.className = 'slider__dot' + (i === currentIndex ? ' is-active' : '');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    };

    const goTo = (index) => {
      currentIndex = Math.max(0, Math.min(index, maxIndex()));
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseInt(getComputedStyle(track).gap) || 0;
      track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
      dotsContainer.querySelectorAll('.slider__dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    };

    const next = () => goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
    const prev = () => goTo(currentIndex <= 0 ? maxIndex() : currentIndex - 1);

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

    const startAutoplay = () => {
      autoplayTimer = setInterval(next, 4000);
    };
    const stopAutoplay = () => clearInterval(autoplayTimer);
    const restartAutoplay = () => { stopAutoplay(); startAutoplay(); };

    const sliderRoot = track.closest('.slider') || track;
    sliderRoot.addEventListener('mouseenter', stopAutoplay);
    sliderRoot.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', () => goTo(currentIndex));

    renderDots();
    goTo(0);
    startAutoplay();
  }

  // ==========================================
  // СЧЁТЧИКИ НА СТРАНИЦЕ «О НАС»
  // Селектор .counter — как в about.html,
  // суффикс (+ / %) берётся из data-suffix.
  // ==========================================

  const stats = document.querySelectorAll('.counter[data-target]');
  if (stats.length > 0) {
    const animateStat = (el) => {
      const target = Number(el.dataset.target);
      if (Number.isNaN(target)) return;
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
  }

  // ==========================================
  // ЗАКАЗ ТОВАРА СО СЛАЙДЕРА НА ГЛАВНОЙ
  // ==========================================

  document.querySelectorAll('.slider__slide .btn, .slider__slide button').forEach((btn) => {
    if (btn.dataset.sliderBound) return;
    btn.dataset.sliderBound = '1';
    btn.addEventListener('click', () => {
      const slide = btn.closest('.slider__slide');
      const title = slide ? slide.querySelector('h3') : null;
      const productName = title ? title.textContent.trim() : '';

      const orderDialog = document.getElementById('order-dialog');
      const orderProductInput = document.getElementById('order-product');
      const orderInterestSelect = document.getElementById('order-interest');

      if (orderProductInput) orderProductInput.value = productName;
      if (orderInterestSelect && productName) {
        for (const option of orderInterestSelect.options) {
          if (option.value === productName || option.text === productName) {
            orderInterestSelect.value = option.value;
            break;
          }
        }
      }
      if (orderDialog) orderDialog.showModal();
    });
  });

  // ==========================================
  // ОФОРМЛЕНИЕ ЗАЯВКИ (модальные формы)
  // ==========================================

  const orderDialog = document.getElementById('order-dialog');
  const successDialog = document.getElementById('success-dialog');

  if (orderDialog) {
    const orderForm = orderDialog.querySelector('form');
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = orderForm.querySelector('input[type="text"]');
        const phoneInput = orderForm.querySelector('input[type="tel"]');
        const consentInput = orderForm.querySelector('input[type="checkbox"]');

        let valid = true;

        if (!nameInput || nameInput.value.trim().length < 2) {
          if (nameInput) nameInput.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          nameInput.removeAttribute('aria-invalid');
        }

        if (!phoneInput || phoneInput.value.replace(/\D/g, '').length !== 11) {
          if (phoneInput) phoneInput.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          phoneInput.removeAttribute('aria-invalid');
        }

        if (consentInput && !consentInput.checked) {
          consentInput.setAttribute('aria-invalid', 'true');
          valid = false;
        } else if (consentInput) {
          consentInput.removeAttribute('aria-invalid');
        }

        if (!valid) return;

        orderDialog.close();
        if (successDialog) successDialog.showModal();
        orderForm.reset();
      });
    }
  }

  // Закрытие диалогов: крестики .modal-close, как в HTML
  document.querySelectorAll('dialog .modal-close, dialog [data-close-dialog], .dialog__close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dialog = btn.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  // Кнопка «Отлично!» в окне успеха
  const closeSuccessBtn = document.getElementById('close-success-btn');
  if (closeSuccessBtn && successDialog) {
    closeSuccessBtn.addEventListener('click', () => successDialog.close());
  }

  // ==========================================
  // ЧАТ-ВИДЖЕТ «АННА, ФЛОРИСТ»
  // ==========================================

  const chat = document.querySelector('.chat-widget');
  if (chat) {
    const toggleBtn = chat.querySelector('.chat-widget__toggle, .chat-widget__button');
    const win = chat.querySelector('.chat-widget__window');
    const closeBtn = chat.querySelector('.chat-widget__close');
    const messages = chat.querySelector('.chat-widget__messages');
    // Сам инпут имеет класс .chat-widget__input
    const input = chat.querySelector('.chat-widget__input');
    const sendBtn = chat.querySelector('.chat-widget__send');
    const chips = chat.querySelectorAll('.chat-chip, .chat-widget__chip');

    const botAnswers = [
      { keys: ['доставк', 'курьер'], text: 'Доставляем по Москве в день заказа или на следующий. По России — СДЭК или Почта, 3–7 дней. При заказе от 5000 ₽ доставка по Москве бесплатная!' },
      { keys: ['оплат', 'карт', 'сбп', 'налич'], text: 'Принимаем карты (Visa, Mastercard, МИР), СБП по QR-коду и наличные. Для юрлиц — оплата по счёту.' },
      { keys: ['корзин'], text: 'Корзина открывается по иконке в шапке. Товары в ней сохранятся, даже если вы закроете сайт.' },
      { keys: ['уход', 'полив', 'как ухажива'], text: 'Проверьте верхний слой почвы: если сухой на 2–3 см — пора поливать. Лучше недолить, чем перелить!' },
      { keys: ['свет', 'куда постав', 'освещен'], text: 'Большинству растений нужен яркий рассеянный свет. Прямое солнце в полдень может обжечь листья.' },
      { keys: ['питом', 'кот', 'собак', 'живот'], text: 'Не все растения безопасны для питомцев! В каталоге ищите значок 🐾 Pet-Friendly.' },
      { keys: ['заказ', 'оформ'], text: 'Нажмите «В корзину» у понравившегося растения, откройте корзину и оформите заказ — мы свяжемся с вами.' },
      { keys: ['гарант', 'вернут'], text: 'Если растение не приживется за 14 дней — заменим бесплатно.' }
    ];

    const getBotReply = (text) => {
      const lower = text.toLowerCase();
      const found = botAnswers.find(a => a.keys.some(k => lower.includes(k)));
      if (found) return found.text;

      if (typeof products !== 'undefined') {
        const p = products.find(pr => lower.includes(pr.title.toLowerCase().split(' ')[0]));
        if (p) {
          const status = p.isAvailable ? 'есть в наличии' : 'сейчас нет в наличии';
          return `${p.title} — ${p.price.toLocaleString('ru-RU')} ₽, ${status}. ${p.desc}`;
        }
      }
      return 'Спасибо за вопрос! Уточню детали у флориста — напишите нам на hello@zelenydom.ru или позвоните +7 (495) 123-45-67.';
    };

    const addMessage = (text, isUser) => {
      if (!messages) return;
      const msg = document.createElement('div');
      msg.className = isUser ? 'chat-message chat-message--user' : 'chat-message';
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    };

    const sendMessage = () => {
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, true);
      input.value = '';
      setTimeout(() => addMessage(getBotReply(text), false), 500);
    };

    const openChat = () => {
      if (win) win.classList.add('is-active');
    };
    const closeChat = () => {
      if (win) win.classList.remove('is-active');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openChat);
    if (closeBtn) closeBtn.addEventListener('click', closeChat);

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); sendMessage(); }
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim();
        addMessage(text, true);
        setTimeout(() => addMessage(getBotReply(text), false), 500);
      });
    });
  }

  // ==========================================
  // КНОПКА «ЗАДАТЬ ВОПРОС» В ФУТЕРЕ
  // Оживёт, если заменить в футере <a> на
  // <button type="button" id="footer-question-btn" class="btn btn--white">
  // ==========================================

  const footerQuestionBtn = document.getElementById('footer-question-btn');
  if (footerQuestionBtn && orderDialog) {
    footerQuestionBtn.addEventListener('click', () => orderDialog.showModal());
  }
});
