const dialog = document.getElementById('order-dialog');

const orderButtons = document.querySelectorAll('.product-card__button');

const closeButton = document.getElementById('close-order-dialog');

const selectedProductInput = document.getElementById('selected-product');

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productName = button.dataset.product;

    selectedProductInput.value = productName;

    dialog.showModal();
  });
});

closeButton.addEventListener('click', () => {
  dialog.close();
});

const form = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {

    form.reportValidity();
    return;
  }

  successMessage.hidden = false;

  form.reset();

  dialog.close();
});

const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});