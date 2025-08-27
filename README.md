# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.


## Типы данных (types/index.ts)
Дополнительно к стартовому набору
// Товар
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;  
  category: string;
  price: number | null; 
}

// Данные покупателя
export interface IBuyer {
  payment: string;  
  address: string;
  phone: string;
  email: string;
}

// Объект, отправляемый на сервер при оформлении заказа (POST /order)
export interface IOrderRequest {
  payment: IBuyer['payment'];
  email: IBuyer['email'];
  phone: IBuyer['phone'];
  address: IBuyer['address'];
  total: number;
  items: Array<IProduct['id']>; 
}


## Файлы с описанием классов (components)
### Модель каталога — components/models/ProductCatalogModel.ts

Назначение: хранение полного списка товаров и «выбранного» товара для детального просмотра.
Поля:

_items: IProduct[]

_selected: IProduct | null

# Методы:

saveProducts(items: IProduct[]): void — сохраняет массив товаров.

getProducts(): IProduct[] — возвращает копию массива.

getProductById(id: string): IProduct | undefined — поиск по id.

setSelectedProduct(product: IProduct | null): void — сохранить выбранный товар.

getSelectedProduct(): IProduct | null — получить выбранный товар.

# Модель корзины — components/models/CartModel.ts

Назначение: хранение выбранных пользователем товаров.
Поля:

_items: IProduct[] — каждая позиция соответствует одному экземпляру в корзине.

# Методы:

getItems(): IProduct[] — вернуть копию массива позиций.

addItem(product: IProduct): void — добавить позицию.

removeItem(product: IProduct): void — удалить одну позицию с тем же id.

clear(): void — очистить корзину.

getTotal(): number — сумма по всем позициям (null трактуется как 0).

getCount(): number — количество позиций.

hasItem(id: string): boolean — проверить наличие товара по id.

# Модель покупателя — components/models/BuyerModel.ts

Назначение: хранение и валидация вводимых пользователем данных.
Поля:

_payment: string

_address: string

_phone: string

_email: string

# Методы:

setData(partial: Partial<IBuyer>): void (и/или точечные сеттеры) — сохранить данные.

getData(): IBuyer — получить все данные.

clear(): void — очистить данные.

validate(): IBuyerValidationResult — валидация полей (минимальные проверки).

# Связь с сервером — components/models/LarekApi.ts

Назначение: коммуникационный слой на базе Api (композиция).
Конструктор: new LarekApi(api: IApi) — получает экземпляр HTTP-клиента.

# Методы:

getProducts(): Promise<IProduct[]> → GET /product/ — вернуть массив товаров (нормализует серверный ответ к IProduct[]).

getProductById(id: string): Promise<IProduct> → GET /product/{id}.

createOrder(payload: IOrderRequest): Promise<{ id: string; total: number }> → POST /order.

Важно: в вызовы api.get/post передавать относительные URI (/product/, /order).



# Тестирование методов моделей (через консоль)

## 1) Загрузка каталога и сохранение в модель
  const products = await server.getProducts();
  catalog.saveProducts(products);

## 2) Каталог: получить массив, найти по id, выбрать товар
  console.log('Каталог (из модели):', catalog.getProducts());
  const firstId = products[0]?.id;
  if (firstId) {
    console.log('Товар по id:', catalog.getProductById(firstId));
    catalog.setSelectedProduct(catalog.getProductById(firstId) ?? null);
    console.log('Выбранный товар:', catalog.getSelectedProduct());
  }

## 3) Корзина: добавить/проверить/удалить/очистить
  if (products[0]) {
    cart.addItem(products[0]);
    console.log('Корзина после добавления:', cart.getItems());
    console.log('Есть товар?', cart.hasItem(products[0].id));
    console.log('Сумма/кол-во:', cart.getTotal(), cart.getCount());
    cart.removeItem(products[0]);
    console.log('Корзина после удаления:', cart.getItems());
    cart.clear();
    console.log('Корзина после очистки:', cart.getItems());
  }

## 4) Покупатель: запись/чтение/валидация/очистка
  buyer.setData({
    payment: 'online',
    address: 'Адрес',
    phone: '79990000000',
    email: 'user@example.com',
  });
  console.log('Данные покупателя:', buyer.getData());
  console.log('Результат валидации:', buyer.validate());
  buyer.clear();
  console.log('После очистки:', buyer.getData());
})();

# Запрос каталога и вывод массива

server.getProducts() выполняет запрос к серверу, далее catalog.saveProducts(products) сохраняет массив в модель, а console.log(catalog.getProducts()) выводит его, используя методы класса.