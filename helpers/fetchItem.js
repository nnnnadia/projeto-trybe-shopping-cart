/*
  getItemUrl retorna uma url para o item que foi recebido como parâmetro.
*/
const getItemUrl = (item) => `https://api.mercadolibre.com/items/${item}`;

/*
  fetchItem rebece o id de um produto e retorna as informações na api referente a ele.
  A função tem dois momentos assíncronos: quando busca os dados (fetch) e quando converte tais dados (.json()).
*/
const fetchItem = async (itemId) => {
  const url = getItemUrl(itemId);
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
