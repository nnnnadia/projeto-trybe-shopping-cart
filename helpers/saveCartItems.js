/*
  saveCartItems salva no localStorage o que recebeu como parâmetro na chave cartItems.
 */
const saveCartItems = (cartItems) => {
  localStorage.setItem('cartItems', cartItems);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
