const getItemUrl = (item) => `https://api.mercadolibre.com/items/${item}`;

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
