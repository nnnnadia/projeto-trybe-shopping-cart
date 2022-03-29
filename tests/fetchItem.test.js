require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fecthItem', () => {
  it('É uma função', () => {
    expect(typeof fetchItem).toBe('function');
  });
  it('Chama a função fetch corretamente', async () => {
    expect.assertions(2);
    await fetchItem('MLB1615760527');
    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/items/MLB1615760527');
  });
  it('Retorna a busca correta quanto é chamada com \'MLB1615760527\'', async () => {
    expect.assertions(1);
    await expect(fetchItem('MLB1615760527')).resolves.toEqual(item);
  });
  it('Retorna uma mensagem de erro \'You must provide an url\' quando chamada vazia', async () => {
    expect.assertions(1);
    try {
      await fetchItem()
    } catch (error) {
      expect(error).toEqual(new Error('You must provide an url'));
    }
  });
});
