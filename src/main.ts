import './scss/styles.scss';


import { ProductCatalogModel } from './components/models/ProductCatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { LarekApi } from './components/models/LarekApi';

const http = new Api(API_URL);

// Каталог
const catalog = new ProductCatalogModel();
catalog.saveProducts(apiProducts.items);
console.log('Каталог — все товары:', catalog.getProducts());

const firstId = apiProducts.items[0]?.id;
console.log('Каталог — товар по id:', firstId, catalog.getProductById(firstId));
catalog.setSelectedProduct(catalog.getProductById(firstId) ?? null);
console.log('Каталог — выбранный товар:', catalog.getSelectedProduct());

// Корзина
const cart = new CartModel();
console.log('Корзина — изначально:', cart.getItems(), 'count=', cart.getCount(), 'total=', cart.getTotal());

if (apiProducts.items[0]) cart.addItem(apiProducts.items[0]);
if (apiProducts.items[1]) cart.addItem(apiProducts.items[1]);
console.log('Корзина — после добавления:', cart.getItems());
console.log('Корзина — has(firstId):', firstId, cart.hasItem(firstId));
console.log('Корзина — count=', cart.getCount(), 'total=', cart.getTotal());

if (apiProducts.items[0]) cart.removeItem(apiProducts.items[0]);
console.log('Корзина — после удаления первой позиции:', cart.getItems(), 'count=', cart.getCount(), 'total=', cart.getTotal());

cart.clear();
console.log('Корзина — после очистки:', cart.getItems(), 'count=', cart.getCount(), 'total=', cart.getTotal());

// Покупатель
const buyer = new BuyerModel();
buyer.setData({
  payment: 'card',            
  address: 'г. Москва, ул. Пушкина, д. 1',
  phone: '+7 (999) 123-45-67',
  email: 'user@example.com',
});
console.log('Покупатель — данные:', buyer.getData());
console.log('Покупатель — валидация:', buyer.validate());

buyer.clear();
console.log('Покупатель — после очистки:', buyer.getData(), 'валидность:', buyer.validate());

const server = new LarekApi(http);

const catalogModel = new ProductCatalogModel();

server.getProducts()
  .then((products) => {
    catalogModel.saveProducts(products);
    console.log('Каталог (с сервера):', catalogModel.getProducts());
  })
  .catch((e) => console.error('Ошибка загрузки каталога:', e));