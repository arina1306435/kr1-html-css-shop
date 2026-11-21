document.addEventListener('DOMContentLoaded', () => {
  // Кнопка наверх
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

  // Меню
  const dropdownItems = document.querySelectorAll('.site-nav__item--dropdown');
  dropdownItems.forEach((item) => {
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

  // Слайдер
  const track = document.getElementById('slider-track');
  const dotsContainer = document.getElementById('slider-dots');
  if (track && dotsContainer) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let slidesPerView = 3;
    const updateSlidesPerView = () => {
      if (window.innerWidth <= 576) slidesPerView = 1;
      else if (window.innerWidth <= 992) slidesPerView = 2;
      else slidesPerView = 3;
    };
    const maxIndex = () => Math.max(0, slides.length - slidesPerView);
    const renderDots = () => {
      dotsContainer.innerHTML = '';
      for (let i = 0; i <= maxIndex(); i++) {
        const dot = document.createElement('button');
        dot.className = 'slider__dot' + (i === currentIndex ? ' is-active' : '');
        dot.type = 'button';
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    };
    const goTo = (index) => {
      currentIndex = Math.max(0, Math.min(index, maxIndex()));
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseInt(getComputedStyle(track).gap) || 0;
      track.style.transform = `translateX(-${(slideWidth + gap) * currentIndex}px)`;
      renderDots();
    };
    const next = () => goTo(currentIndex >= maxIndex() ? 0 : currentIndex + 1);
    const prev = () => goTo(currentIndex <= 0 ? maxIndex() : currentIndex - 1);
    document.querySelector('.slider__arrow--next')?.addEventListener('click', next);
    document.querySelector('.slider__arrow--prev')?.addEventListener('click', prev);
    let autoTimer = setInterval(next, 5000);
    const sliderEl = document.getElementById('popular-slider');
    sliderEl?.addEventListener('mouseenter', () => clearInterval(autoTimer));
    sliderEl?.addEventListener('mouseleave', () => { autoTimer = setInterval(next, 5000); });
    window.addEventListener('resize', () => { updateSlidesPerView(); goTo(0); });
    updateSlidesPerView();
    renderDots();
  }

  // --- МОДАЛЬНЫЕ ОКНА ---
  const productDialog = document.getElementById('product-dialog');
  const orderDialog = document.getElementById('order-dialog');
  const successDialog = document.getElementById('success-dialog');
  
  let currentProductName = "Общая заявка";

  // 1. Открытие окна товара (в каталоге)
  document.querySelectorAll('.products-grid .product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('product-card__button')) return;

      const title = card.getAttribute('data-title') || 'Растение';
      const price = card.getAttribute('data-price') || 'Уточняйте';
      const img = card.getAttribute('data-img') || '';
      const desc = card.getAttribute('data-desc') || 'Описание временно недоступно.';
      const sku = card.getAttribute('data-sku') || '---';

      const pdTitle = document.getElementById('pd-title');
      const pdPrice = document.getElementById('pd-price');
      const pdImg = document.getElementById('pd-img');
      const pdDesc = document.getElementById('pd-desc');
      const pdSku = document.getElementById('pd-sku');

      if (pdTitle) pdTitle.textContent = title;
      if (pdPrice) pdPrice.textContent = price;
      if (pdImg) pdImg.src = img;
      if (pdDesc) pdDesc.textContent = desc;
      if (pdSku) pdSku.textContent = 'Артикул: ' + sku;
      
      currentProductName = title;
      
      if (productDialog) productDialog.showModal();
    });
  });

  // 2. Кнопки "Заказать" в слайдере на главной
  document.querySelectorAll('.slider .product-card__button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentProductName = btn.getAttribute('data-product') || "Растение";
      
      const hiddenInput = document.getElementById('order-product');
      if (hiddenInput) hiddenInput.value = currentProductName;
      
      const select = document.getElementById('order-interest');
      if (select) {
        let found = false;
        for (let option of select.options) {
          if (option.value === currentProductName || option.text === currentProductName) {
            select.value = option.value;
            found = true;
            break;
          }
        }
        if (!found) select.value = "Другое растение";
      }
      if (orderDialog) orderDialog.showModal();
    });
  });

  // Закрытие окон
  document.getElementById('close-product-dialog')?.addEventListener('click', () => productDialog.close());
  document.getElementById('close-order-dialog')?.addEventListener('click', () => orderDialog.close());
  document.getElementById('close-success-dialog')?.addEventListener('click', () => successDialog.close());
  document.getElementById('close-success-btn')?.addEventListener('click', () => successDialog.close());

  // Кнопка "Оформить заявку" внутри окна товара
  document.getElementById('pd-order-btn')?.addEventListener('click', () => {
    if (productDialog) productDialog.close();
    
    const hiddenInput = document.getElementById('order-product');
    if (hiddenInput) hiddenInput.value = currentProductName;
    
    const select = document.getElementById('order-interest');
    if (select) {
      for (let option of select.options) {
        if (option.value === currentProductName || option.text === currentProductName) {
          select.value = option.value;
          break;
        }
      }
    }
    if (orderDialog) orderDialog.showModal();
  });

  // Валидация и отправка (для модалки на главной/каталоге)
  const form = document.getElementById('order-form');
  if (form) {
    const nameInput = document.getElementById('order-name');
    const phoneInput = document.getElementById('order-phone');
    const consentInput = document.getElementById('order-consent');

    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let digits = e.target.value.replace(/\D/g, '');
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (!digits.startsWith('7')) digits = '7' + digits;
        let formatted = '+7';
        if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
        if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
        if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
        if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);
        e.target.value = formatted;
        e.target.removeAttribute('aria-invalid');
      });
    }
    
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;
      if (nameInput && nameInput.value.trim().length < 2) { nameInput.setAttribute('aria-invalid', 'true'); isValid = false; }
      if (phoneInput && phoneInput.value.replace(/\D/g, '').length < 11) { phoneInput.setAttribute('aria-invalid', 'true'); isValid = false; }
      if (consentInput && !consentInput.checked) { consentInput.closest('.order-form__checkbox')?.setAttribute('aria-invalid', 'true'); isValid = false; }
      if (!isValid) return;

      if (orderDialog) orderDialog.close();
      form.reset();
      if (successDialog) successDialog.showModal();
    });
  }

  // === ВИДЖЕТ ЧАТА (УМНЫЙ ДИАЛОГ) ===
  const toggleChatBtn = document.getElementById('toggle-chat');
  const closeChatBtn = document.getElementById('close-chat');
  const chatWindow = document.getElementById('chat-window');
  const chatForm = document.getElementById('chat-form');
  const chatMessages = document.getElementById('chat-messages');
  const chatChips = document.getElementById('chat-chips');

  if (toggleChatBtn && chatWindow) {
    toggleChatBtn.addEventListener('click', () => chatWindow.classList.toggle('is-active'));
  }
  if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => chatWindow.classList.remove('is-active'));
  }

  const addMessage = (text, sender = 'bot') => {
    const msg = document.createElement('div');
    msg.className = `chat-widget__message ${sender}-message`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const chatScript = {
    start: [
      { text: "Как оформить заказ?", next: "order" },
      { text: "Доставка", next: "delivery" },
      { text: "Возврат", next: "return" },
      { text: "Контакты", next: "contacts" }
    ],
    order: [
      { text: "Сколько ждать доставку?", next: "delivery" },
      { text: "Способы оплаты", next: "payment" },
      { text: "В начало", next: "start" }
    ],
    delivery: [
      { text: "Сколько стоит?", next: "delivery_price" },
      { text: "Есть ли самовывоз?", next: "pickup" },
      { text: "В начало", next: "start" }
    ],
    return: [
      { text: "Условия возврата", next: "return_rules" },
      { text: "В начало", next: "start" }
    ],
    contacts: [
      { text: "Адрес оранжереи", next: "address" },
      { text: "Написать в Telegram", action: "link", url: "https://t.me/zelenydom" },
      { text: "В начало", next: "start" }
    ],
    payment: [
      { text: "Оплата картой", next: "pay_card" },
      { text: "Оплата при получении", next: "pay_cash" },
      { text: "В начало", next: "start" }
    ],
    delivery_price: [
      { text: "По Москве", next: "price_msk" },
      { text: "По России", next: "price_ru" },
      { text: "В начало", next: "start" }
    ]
  };

  const botAnswers = {
    order: "Выберите растение в каталоге, нажмите «Заказать» и оставьте свои контакты. Мы позвоним для подтверждения.",
    delivery: "Мы доставляем по Москве курьером за 1–2 дня, по России — СДЭК или Почтой.",
    return: "Гарантия приживаемости — 14 дней. Если растение погибло, заменим бесплатно.",
    contacts: "Наш адрес: Москва, ул. Ботаническая, 10. Телефон: +7 (495) 123-45-67.",
    payment: "Принимаем карты (Visa/Mastercard/МИР), СБП, наличные курьеру или оплату по счёту.",
    delivery_price: "По Москве (МКАД) — 390 ₽. При заказе от 5000 ₽ — бесплатно. По России — от 450 ₽.",
    pickup: "Да, можно забрать самостоятельно по адресу: ул. Ботаническая, 10. Ежедневно с 10:00 до 21:00.",
    return_rules: "Растение должно быть в оригинальном горшке. Пришлите фото, и мы оформим замену.",
    address: "📍 г. Москва, ул. Ботаническая, д. 10. Ждем вас ежедневно с 10:00 до 21:00!",
    pay_card: "Оплата онлайн на сайте или курьеру при получении (терминал).",
    pay_cash: "Наличными курьеру или в оранжерее при самовывозе.",
    price_msk: "По Москве (в пределах МКАД) — 390 ₽. За МКАД — от 590 ₽.",
    price_ru: "Отправляем СДЭК и Почтой России. Стоимость рассчитывается индивидуально от 450 ₽."
  };

  const renderChips = (step) => {
    if (!chatChips) return;
    chatChips.innerHTML = ''; 
    const options = chatScript[step] || chatScript.start;

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-chip';
      btn.textContent = opt.text;
      
      btn.addEventListener('click', () => {
        chatChips.innerHTML = ''; 
        addMessage(opt.text, 'user');

        if (opt.action === 'link') {
          setTimeout(() => {
            addMessage("Переходим по ссылке...", 'bot');
            window.open(opt.url, '_blank');
            renderChips('contacts'); 
          }, 600);
          return;
        }

        setTimeout(() => {
          const answer = botAnswers[opt.next];
          if (answer) addMessage(answer, 'bot');
          if (chatScript[opt.next]) renderChips(opt.next);
          else renderChips('start');
        }, 800);
      });

      chatChips.appendChild(btn);
    });
  };

  // Запускаем чат
  if (chatMessages && chatChips) {
    chatMessages.innerHTML = '<div class="chat-widget__message">Привет! Я Анна, флорист. Чем могу помочь?</div>';
    renderChips('start');
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = chatForm.querySelector('.chat-widget__input');
      const text = input.value.trim();
      if (!text) return;

      addMessage(text, 'user');
      input.value = '';
      chatChips.innerHTML = '';

      setTimeout(() => {
        addMessage('Спасибо за сообщение! Я передам его нашему флористу. А пока вы можете выбрать один из частых вопросов ниже.', 'bot');
        renderChips('start'); 
      }, 1000);
    });
  }
    // === АНИМАЦИЯ ЦИФР ===
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 секунды
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      counter.textContent = current + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = target + suffix; // Финальное значение
      }
    };

    window.requestAnimationFrame(step);
  };

  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Анимируем только один раз
        }
      });
    }, { threshold: 0.5 }); // Начинаем, когда элемент виден на 50%

    counters.forEach(counter => observer.observe(counter));
  }
});