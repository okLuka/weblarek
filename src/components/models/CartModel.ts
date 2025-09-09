import { IProduct, ProductId } from '../../types';
import type { IEvents } from '../base/Events';

export class CartModel {
  //  Текущие позиции корзины 
  protected _items: IProduct[] = [];
  private events?: IEvents;

  constructor() {}
   //  Получить текущие товары в корзине
  getItems(): IProduct[] {
    return [...this._items];
  }

  attachEvents(events: IEvents): void { this.events = events; }
  private emit(name: string, data?: unknown): void { this.events?.emit(name, data as object); }

  //  Добавить товар в корзину
  addItem(product: IProduct): void {
    this._items.push(product);
    this.emit('cart:updated', { items: this.getItems(), count: this.getCount(), total: this.getTotal() });
  }

  // Удалить одну позицию товара из корзины (по id)
  removeItem(product: IProduct): void {
    const idx = this._items.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      this._items.splice(idx, 1);
      this.emit('cart:updated', { items: this.getItems(), count: this.getCount(), total: this.getTotal() });
    };
  }

  //  Очистить корзину
  clear(): void {
    this._items = [];
    this.emit('cart:updated', { items: this.getItems(), count: this.getCount(), total: this.getTotal() });
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
