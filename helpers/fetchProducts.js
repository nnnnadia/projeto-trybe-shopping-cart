/*
  getProductUrl retorna uma url para a busca que foi recebida como parâmetro.
*/
const getProductUrl = (product) => `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;

/*
  fetchItem rebece uma consulta e retorna as informações na api referente a ela.
  A função tem dois momentos assíncronos: quando busca os dados (fetch) e quando converte tais dados (.json()).
*/
const fetchProducts = async (query) => {
  const url = getProductUrl(query);
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
