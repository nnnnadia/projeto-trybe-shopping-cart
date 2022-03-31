/*
  getSavedCartItems pega os valores salvos no localStorage e retorna o que estiver lá, se não houver nada retorna um array vazio.
*/
const getSavedCartItems = () => {
  const savedCartItems = localStorage.getItem('cartItems');
  return !savedCartItems ? [] : savedCartItems;

  // solução que o Thiago Quadro mostrou:
  // return localStorage.getItem('cartItems') || [];
  
  // solução anterior que não passava no requisito
  // if (savedCartItems !== null || savedCartItems === '') {
  //   localStorage.setItem('cartItems', []);
  //   return [];
  // }
  // return savedCartItems;
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
