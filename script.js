function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getItemsToSave() {
  const cartItems = document.querySelector('.cart__items').innerHTML;
  saveCartItems(cartItems);
}

function cartItemClickListener(event) {
  event.target.remove();
  getItemsToSave();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentElement);
  const { id: sku, title: name, price: salePrice } = await fetchItem(itemId);
  const cartItem = createCartItemElement({ sku, name, salePrice });
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(cartItem);
  getItemsToSave();
}

function createButtonsEventListeners() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', addItemToCart);
  });
}

async function loadProducts() {
  const { results } = await fetchProducts('computador');
  const items = document.querySelector('.items');
  results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const newItem = createProductItemElement({ sku, name, image });
    items.appendChild(newItem);
  });
  createButtonsEventListeners();
}

function loadCartItems() {
  const savedCartItems = localStorage.getItem('cartItems')
  if (savedCartItems === null) {
    localStorage.setItem('cartItems', JSON.stringify([]));
    return;
  }
  document.querySelector('.cart__items').innerHTML = savedCartItems;
  document.querySelectorAll('.cart__item').forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

window.onload = () => {
  loadProducts();
  loadCartItems();
};
