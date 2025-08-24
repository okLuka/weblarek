import { IProduct, ProductId } from '../../types';

export class CartModel {
  //  Текущие позиции корзины 
  protected _items: IProduct[] = [];

  constructor() {}


   //  Получить текущие товары в корзине
  getItems(): IProduct[] {
    return [...this._items];
  }

  //  Добавить товар в корзину
  addItem(product: IProduct): void {
    this._items.push(product);
  }

  // Удалить одну позицию товара из корзины (по id)
  removeItem(product: IProduct): void {
    const idx = this._items.findIndex((p) => p.id === product.id);
    if (idx >= 0) this._items.splice(idx, 1);
  }

  //  Очистить корзину
  clear(): void {
    this._items = [];
  }

  // Общая стоимость 
  getTotal(): number {
    return this._items.reduce((sum, p) => sum + (typeof p.price === 'number' ? p.price : 0), 0);
  }


  // Количество позиций
  getCount(): number {
    return this._items.length;
  }

  // Проверка наличия товара по id
  hasItem(id: ProductId): boolean {
    return this._items.some((p) => p.id === id);
  }
}
