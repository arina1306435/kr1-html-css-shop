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

  // 1. Открытие окна товара (в каталоге) при клике на карточку
  document.querySelectorAll('.products-grid .product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Если это кнопка "Заказать" внутри каталога, пропускаем (пусть обрабатывается ниже)
      if (e.target.classList.contains('product-card__button')) return;

      // Берем данные из карточки
      const title = card.getAttribute('data-title') || 'Растение';
      const price = card.getAttribute('data-price') || 'Уточняйте';
      const img = card.getAttribute('data-img') || '';
      const desc = card.getAttribute('data-desc') || 'Описание временно недоступно.';
      const sku = card.getAttribute('data-sku') || '---';

      // Вставляем в окно
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
});