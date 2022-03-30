const getSavedCartItems = () => {
  const savedCartItems = localStorage.getItem('cartItems');
  if (savedCartItems === null || savedCartItems === '') {
    localStorage.setItem('cartItems', []);
    return [];
  }
  return savedCartItems;
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
