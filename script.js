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

function getCartItems() {
  return document.querySelector('.cart__items');
}

function getItemsToSave() {
  saveCartItems(getCartItems().innerHTML);
}

function getEachCartItem() {
  return document.querySelectorAll('.cart__item');
}

function getItemsIdsList() {
  const itemsIdsList = [];
  [...getEachCartItem()].forEach((item) => {
    const itemId = /MLB\d+/.exec(item.innerText);
    itemsIdsList.push(...itemId);
  });
  return itemsIdsList;
}

async function fetchPrices(itemsIdsList) {
  const itemsPromisesList = itemsIdsList.map((id) => fetchItem(id));
  const rawItemsList = await Promise.all(itemsPromisesList);
  const itemsPricesList = rawItemsList.map((item) => item.price);
  return itemsPricesList;
}

async function getTotalPrice(toggle) {
  const totalPrice = document.querySelector('.total-price');
  if (toggle) {
    const itemsIdsList = getItemsIdsList();
    const itemsPricesList = await fetchPrices(itemsIdsList);
    const totalBill = itemsPricesList.reduce((acc, curr) => acc + curr);
    totalPrice.innerText = `${totalBill}`;
    return;
  }
  totalPrice.innerText = '0,00';
}

async function cartItemClickListener(event) {
  event.target.remove();
  getItemsToSave();
  await getTotalPrice(true);
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
  getCartItems().appendChild(cartItem);
  getItemsToSave();
  await getTotalPrice(true);
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

async function loadLastCart() {
  const savedCartItems = getSavedCartItems();
  getCartItems().innerHTML = savedCartItems;
  getEachCartItem().forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
  await getTotalPrice(true);
}

function emptyCart() {
  getCartItems().innerHTML = '';
  getItemsToSave();
  getTotalPrice(false);
}

function loadEmptyButton() {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', emptyCart);
}

window.onload = () => {
  loadProducts();
  loadLastCart();
  loadEmptyButton();
};
