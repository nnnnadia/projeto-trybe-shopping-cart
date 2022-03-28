require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fecthProducts', () => {
  it('É uma função', () => {
    expect.assertions(1);
    expect(typeof fetchProducts).toBe('function');
  });
  it('Chama a função fetch corretamente', async () => {
    expect.assertions(2);
    await fetchProducts('computador');
    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  });
  it('Retorna a busca correta quanto é chamada com \'computador\'', async () => {
    expect.assertions(1);
    await expect(fetchProducts('computador')).resolves.toEqual(computadorSearch);
  });
  it('Retorna uma mensagem de erro \'You must provide an url\' quando chamada vazia', () => {
    expect.assertions(1);
    await expect(fetchProducts()).resolves.toEqual(new Error('You must provide an url'));
  });
});
