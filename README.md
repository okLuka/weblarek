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

## Общие принципы

Один класс View ↔ один блок разметки. Никакой бизнес-логики и доступа к моделям — только отрисовка и события UI.

Все карточки имеют общего родителя (базовый класс карточки).

Обе формы имеют общего родителя (базовый класс формы).

Модальное окно — конечный контейнер (не наследуется). Контент модалки — самостоятельные компоненты.

## Базовые классы (родители)
# BaseCardView<T>

Назначение: общий функционал карточек (клонирование <template>, заполнение заголовка, картинки, цены, навешивание обработчиков).

Зависимости конструктора:
new BaseCardView(template: HTMLTemplateElement, events: Events)

## API:

render(data: T): HTMLElement — отрисовка и возврат корня карточки.

update(patch: Partial<T>): void — частичное обновление отображения.

Защищённые утилиты: setText(el, text), setImage(img, src, alt), setPrice(el, price|null), on(el, type, handler).

# BaseFormView<TValues, TErrors>

Назначение: общий функционал форм (сбор/установка значений, показ ошибок, управление кнопкой submit).

Зависимости:
new BaseFormView(template: HTMLTemplateElement, events: Events)

## API:

render(values?: Partial<TValues>): HTMLElement

setValues(values: Partial<TValues>): void

getValues(): TValues

setErrors(errors: Partial<TErrors>): void

clearErrors(): void

setSubmitDisabled(disabled: boolean): void

События (эмитит):
form:change (значения полей), form:submit (значения полей, preventDefault уже сделан).

## ModalView

Назначение: контейнер модального окна. Не наследуется.

Опорные элементы: #modal-container, .modal__content, .modal__close. Контейнер уже есть в DOM. 

# API:

open(content: HTMLElement): void

close(): void

setContent(content: HTMLElement): void

isOpen(): boolean

События: modal:open, modal:close.

## Компоненты карточек (3 шаблона → один родитель BaseCardView)
# CatalogCardView extends BaseCardView<ProductCardVM>

Шаблон: <template id="card-catalog"> (корень — button.gallery__item.card) с узлами: .card__category, .card__title, .card__image, .card__price. 

Ответственность: рендер карточки в каталоге; по клику — открыть превью.

События (эмитит):
product:open { id: string }.

# PreviewCardView extends BaseCardView<ProductPreviewVM>

Шаблон: <template id="card-preview"> (крупная карточка для модалки) с .card__image, .card__category, .card__title, .card__text, .card__button («В корзину»), .card__price. 

Ответственность: детальный просмотр товара; кнопка «В корзину» добавляет товар.

События:
product:add { id: string }.

# BasketItemView extends BaseCardView<CartItemVM>

Шаблон: <template id="card-basket"> (компактная карточка позиции корзины) с .basket__item-index, .card__title, .card__price, .basket__item-delete. 

Ответственность: отображение позиции в корзине; удаление по кнопке.

События:
cart:remove { id: string }.

## Контейнеры списков/секций
# CatalogGridView

Контейнер каталога: <main class="gallery"></main> — места для списка карточек каталога. 
API:

render(list: ProductCardVM[]): HTMLElement — полная перерисовка.

mountCard(el: HTMLElement): void — вставка готовой карточки.

# CartView

Шаблон: <template id="basket"> — корень .basket, список .basket__list, кнопка «Оформить» .basket__button, сумма .basket__price. 

Ответственность: отобразить список BasketItemView, общие итоги и кнопку «Оформить».

API:

render(data: CartSummaryVM): HTMLElement

setDisabledCheckout(disabled: boolean): void

Событие: checkout:open.

# HeaderCartView

Опорные элементы в шапке: .header__basket (кнопка), .header__basket-counter (счётчик). 

index

Ответственность: показать количество товаров, открыть модалку корзины по клику.

API: update(count: number): void

Событие: cart:open.

# Формы (2 шаблона → один родитель BaseFormView)
PaymentFormView extends BaseFormView<{ payment: TPayment; address: string }, { payment?: string; address?: string }>

Шаблон: <template id="order"> — радиокнопки в виде кнопок (button[name="card"], button[name="cash"]), поле ввода адреса input[name="address"], кнопка сабмита .order__button, контейнер ошибок .form__errors. 



Ответственность: выбор оплаты и адреса; управление активностью «Далее».

Поведение:

При выборе card/cash — выставляет payment и визуально активную кнопку.

При вводе адреса — обновляет значения.

Ошибки выводятся через setErrors({ payment?, address? }).

Доступность сабмита — через setSubmitDisabled(boolean) (решает презентер на основе BuyerModel.validate()).

События: наследует form:change, form:submit (payment:submit опционально алиасится на form:submit).

# ContactsFormView extends BaseFormView<{ email: string; phone: string }, { email?: string; phone?: string }>

Шаблон: <template id="contacts"> — поля input[name="email"], input[name="phone"], кнопка «Оплатить», блок для ошибок .form__errors. 
Ответственность: ввод контактов; управление активностью «Оплатить».

Поведение: аналогично PaymentFormView: значения/ошибки/активность управляются через публичный API базового класса, решения принимает презентер.

События: form:change, form:submit.

## Сообщения/сервисные компоненты
# SuccessView

Шаблон: <template id="success"> — .order-success__title, .order-success__description (сумма), .order-success__close. 
Ответственность: показать итоги успешного заказа.

# API:
render({ id, total }: { id: string; total: number }): HTMLElement

Событие: modal:close по кнопке закрытия.

Поток событий (контракты View ↔ Presenter)

HeaderCartView → cart:open

CatalogCardView → product:open { id }

PreviewCardView → product:add { id }

BasketItemView → cart:remove { id }

CartView → checkout:open

PaymentFormView → form:change { payment, address }, form:submit

ContactsFormView → form:change { email, phone }, form:submit

ModalView → modal:open, modal:close

## Соответствие вёрстке

Секция каталога: .gallery — контейнер для списка карточек. 
Шапка: .header__basket, .header__basket-counter — индикатор и кнопка корзины. 
Модалка: #modal-container, .modal__content, .modal__close — контейнер, контент, кнопка закрытия. 

Шаблоны:
card-catalog, #card-preview, #card-basket — карточки. 
basket — содержимое корзины. 
order — форма оплаты и адреса. 
contacts — форма email и телефона. 
success — сообщение успеха. 

## События приложения
# События от слоя Представления (View)
# product:open

Эмитит: CatalogCardView (клик по карточке, но не по кнопке покупки).

Когда: пользователь нажал на карточку товара в каталоге.

Payload: { id: string }.

Действие презентера: получает товар по id, собирает PreviewCardView, открывает модалку.

# product:toggle

Эмитит: CatalogCardView и PreviewCardView (клик по «В корзину» / «Удалить из корзины»).

Когда: пользователь нажал кнопку покупки на карточке или в превью.

Payload: { id: string }.

Действие презентера: если товар уже в корзине — удалить; иначе — добавить. Дополнительно сразу синхронизирует текст кнопок в открытых вью (каталог/превью).

# product:add (поддержка для совместимости)

Эмитит: устаревшая версия PreviewCardView (если осталась где-то в коде).

Когда: кнопка «В корзину» в превью.

Payload: { id: string }.

Действие презентера: обрабатывается тем же обработчиком, что и product:toggle.

# cart:open

Эмитит: HeaderCartView (клик по иконке корзины в шапке).

Когда: пользователь открыл корзину.

Payload: {}.

Действие презентера: собирает CartView и открывает модалку корзины.

# cart:remove

Эмитит: BasketItemView (клик по кнопке удаления позиции).

Когда: пользователь удаляет товар из корзины внутри модалки корзины.

Payload: { id: string }.

Действие презентера: находит позицию в CartModel и удаляет её.

# checkout:open

Эмитит: CartView (кнопка «Оформить»).

Когда: пользователь переходит к оформлению.

Payload: {}.

Действие презентера: открывает форму оплаты и адреса (PaymentFormView).

# form:change

Эмитит: BaseFormView (делегированный input/change — общий для форм).

Когда: пользователь меняет значения в форме.

Payload: зависит от формы:

для PaymentFormView: { payment: 'card' | 'cash' | '' , address: string }

для ContactsFormView: { email: string, phone: string }

Действие презентера: обновляет поля BuyerModel (setPayment/setAddress/setEmail/setPhone). Модель сама эмитит buyer:updated; презентер по нему обновляет ошибки/кнопку submit.

# form:submit

Эмитит: BaseFormView при отправке формы.

Когда: пользователь нажал submit на форме.

Payload: текущие значения полей формы (тот же формат, что у form:change).

Действие презентера:

если открыта PaymentFormView и ошибок нет — открыть ContactsFormView;

если открыта ContactsFormView и ошибок нет — собрать заказ и вызвать Api.post /order, при успехе открыть SuccessView, очистить корзину и данные покупателя.

# modal:open

Эмитит: ModalView при показе модального окна.

Когда: модалка открыта.

Payload: {}.

Действие презентера: служебное; может использоваться для сбросов локальных ссылок/флагов.

# modal:close

Эмитит: ModalView при закрытии модального окна.

Когда: модалка закрыта.

Payload: {}.

Действие презентера: сбрасывает ссылки на активные формы/превью, снимает флаги.

## События от слоя Моделей (Model)
# catalog:updated

Эмитит: ProductCatalogModel.saveProducts(...).

Когда: каталог товаров сохранён/обновлён.

Payload: { items: IProduct[] } (может передаваться только для информации; презентер обычно читает через getProducts()).

Действие презентера: перерисовывает список каталога (CatalogGridView + CatalogCardView для каждого товара).

# catalog:selected

Эмитит: ProductCatalogModel.setSelectedProduct(...).

Когда: сохранён товар для детального просмотра.

Payload: { product: IProduct | null }.

Действие презентера: опционально — может открыть превью или синхронизировать состояние (в текущей логике предварительный просмотр открывается напрямую по product:open).

# cart:updated

Эмитит: CartModel.addItem/removeItem/clear.

Когда: содержимое корзины изменилось.

Payload: { items: IProduct[], count: number, total: number }.

Действие презентера: обновляет счётчик в шапке, при открытой корзине — перерисовывает модалку корзины; синхронизирует текст кнопок «В корзину»/«Удалить из корзины» в каталоге и превью.

# buyer:updated

Эмитит: BuyerModel.setData/setPayment/setAddress/setEmail/setPhone.

Когда: изменились данные покупателя.

Payload: IBuyer.

Действие презентера: выставляет значения/ошибки на активной форме, включает/выключает кнопку submit.

# buyer:cleared

Эмитит: BuyerModel.clear().

Когда: данные покупателя очищены (после успешного заказа).

Payload: IBuyer (пустое состояние).

Действие презентера: никаких дополнительных действий не требуется; формы при следующем открытии получат пустые значения.