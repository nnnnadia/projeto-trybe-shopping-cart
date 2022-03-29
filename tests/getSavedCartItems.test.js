const localStorageSimulator = require('../mocks/localStorageSimulator');
const getSavedCartItems = require('../helpers/getSavedCartItems');

localStorageSimulator('getItem');

describe('4 - Teste a função getSavedCartItems', () => {
  it('Chama localStorage.getItem corretamente', () => {
    getSavedCartItems();
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalledWith('cartItems');
  });
});
