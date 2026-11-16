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

  const dialog = document.getElementById('order-dialog');
  const orderButtons = document.querySelectorAll('.product-card__button');
  const closeButton = document.getElementById('close-order-dialog');
  const selectedProductInput = document.getElementById('selected-product');
  const form = document.getElementById('order-form');
  const successMessage = document.getElementById('success-message');

  if (dialog && orderButtons.length > 0) {
    

    orderButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const productName = button.dataset.product;
        if (selectedProductInput) selectedProductInput.value = productName;
        
        if (successMessage) successMessage.hidden = true;
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

    if (form) {
      const inputs = form.querySelectorAll('input[required]');

      inputs.forEach(input => {
        input.addEventListener('input', () => {
          input.removeAttribute('aria-invalid');
        });
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        let isValid = true;

        inputs.forEach(input => {
          if (!input.value.trim()) {
            input.setAttribute('aria-invalid', 'true');
            isValid = false;
          }
        });

        if (!isValid) return;

        if (successMessage && form) {
          form.hidden = true;
          successMessage.hidden = false;
          
          setTimeout(() => {
            dialog.close();
            form.reset();
            form.hidden = false;
            successMessage.hidden = true;
          }, 3000);
        }
      });
    }
  }
});