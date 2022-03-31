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

/*
  getEachCartItem seleciona todos os itens do carrinho.
*/
function getEachCartItem() {
  return document.querySelectorAll('.cart__item');
}

/*
  getItemsIdsList transforma o texto cada item do carrinho em uma lista de ids utilizando expressões ragulares.
*/
function getItemsIdsList() {
  const itemsIdsList = [];
  [...getEachCartItem()].forEach((item) => {
    const itemId = /MLB\d+/.exec(item.innerText);
    itemsIdsList.push(...itemId);
  });
  return itemsIdsList;
}

/*
  fetchPrices recebe uma lista ids, para cada id faz uma busca na api por informações que depois apenas o preço é filtrado, retornando assim uma lista de preços.
  Pelas buscas serem assíncronas esta lista de Promises precisa ser resolvida antes dos próximos passos. `Promisse.all` itera por cada promessa até que todas estejam resolvidas.
*/
async function fetchPrices(itemsIdsList) {
  const itemsPromisesList = itemsIdsList.map((id) => fetchItem(id));
  const rawItemsList = await Promise.all(itemsPromisesList);
  const itemsPricesList = rawItemsList.map((item) => item.price);
  return itemsPricesList;
}

/*
  getTotalPrice possui uma tomada pra quando a solução é assíncrona ou não.
  Quando é assíncrona ela gera uma lista de ids para servir de busca para a criação de uma lista de preços e então essa lista é reduzida no valor final que é exibida na página.
  Quando é síncrona (ou seja, o carrinho está vazio) é exibido na página o valor total zerado.
*/
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

/*
  cartItemClickListener remove o item do carrinho que foi clicado, atualiza o conteúdo salvo e atualiza o preço.
*/
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

/*
  addItemToCart pega o id do item clicado e depois busca as informações dele na api, a partir desses dados ele cria este item no carrinho e então salva os itens e atualiza o proço total.
*/
async function addItemToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentElement);
  const { id: sku, title: name, price: salePrice } = await fetchItem(itemId);
  const cartItem = createCartItemElement({ sku, name, salePrice });
  getCartItems().appendChild(cartItem);
  getItemsToSave();
  await getTotalPrice(true);
}

/*
  createButtonsEventListeners pega todos os botões de adicionar ao carrinho da página e adiciona event listeners para cada um.
*/
function createButtonsEventListeners() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', addItemToCart);
  });
}

function showLoading(toggle) {
  if (toggle) {
    const items = document.querySelector('.items');
    items.appendChild(createCustomElement('p', 'loading', 'carregando...'));
  } else {
    const loadingText = document.querySelector('.loading');
    loadingText.remove();
  }
}

/*
  loadProducts consulta uma busca com 'computador' do que é retornado utiliza a chave results que é uma lista de produtos.
  Para cada produto são extraidos e renomeados 3 valores (sku, name, image) para a criação de um nove elemento e inserção na página.
*/
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

window.onload = async () => {
  showLoading(true);
  await loadProducts();
  showLoading(false);
  loadLastCart();
  loadEmptyButton();
};
