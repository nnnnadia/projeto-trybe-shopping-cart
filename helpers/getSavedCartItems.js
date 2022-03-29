const getSavedCartItems = () => {
  const savedCartItems = localStorage.getItem('cartItems');
  if (savedCartItems === null || savedCartItems === '') {
    localStorage.setItem('cartItems', []);
    return;
  }
  getCartItems().innerHTML = savedCartItems;
  getEachCartItem().forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
