document.addEventListener('DOMContentLoaded', () => {
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* === ВЫПАДАЮЩЕЕ МЕНЮ КАТАЛОГА === */
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

    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* === СЛАЙДЕР === */
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
        dot.setAttribute('aria-label', `Слайд ${i + 1}`);
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

    window.addEventListener('resize', () => {
      updateSlidesPerView();
      goTo(0);
    });

    updateSlidesPerView();
    renderDots();
  }

  /* === МОДАЛЬНОЕ ОКНО ЗАЯВКИ === */
  const dialog = document.getElementById('order-dialog');
  const orderButtons = document.querySelectorAll('.product-card__button');
  const closeButton = document.getElementById('close-order-dialog');
  const selectedProductInput = document.getElementById('selected-product');
  const form = document.getElementById('order-form');
  const successDialog = document.getElementById('success-dialog');
  const closeSuccessBtn = document.getElementById('close-success-dialog');

  if (dialog && orderButtons.length > 0) {
    orderButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product;
        if (selectedProductInput) selectedProductInput.value = productName;

        if (form) {
          form.reset();
          form.hidden = false;
          form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
        }

        dialog.showModal();
      });
    });

    if (closeButton) {
      closeButton.addEventListener('click', () => dialog.close());
    }

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                          rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) dialog.close();
    });
  }

  /* === УЛУЧШЕННАЯ ВАЛИДАЦИЯ ФОРМЫ === */
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

    if (nameInput) {
      nameInput.addEventListener('input', () => nameInput.removeAttribute('aria-invalid'));
    }

    if (consentInput) {
      consentInput.addEventListener('change', () => {
        consentInput.closest('.order-form__checkbox')?.removeAttribute('aria-invalid');
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      let isValid = true;

      if (nameInput && nameInput.value.trim().length < 2) {
        nameInput.setAttribute('aria-invalid', 'true');
        isValid = false;
      }

      if (phoneInput) {
        const digits = phoneInput.value.replace(/\D/g, '');
        if (digits.length < 11) {
          phoneInput.setAttribute('aria-invalid', 'true');
          isValid = false;
        }
      }

      if (consentInput && !consentInput.checked) {
        consentInput.closest('.order-form__checkbox')?.setAttribute('aria-invalid', 'true');
        isValid = false;
      }

      if (!isValid) return;

      if (dialog) dialog.close();
      form.reset();
      form.hidden = false;

      if (successDialog) {
        successDialog.showModal();
      }
    });
  }

  if (closeSuccessBtn && successDialog) {
    closeSuccessBtn.addEventListener('click', () => successDialog.close());
  }
});