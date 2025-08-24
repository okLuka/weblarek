import { IProduct, ProductId } from '../../types';

export class ProductCatalogModel {
  // Массив всех товаров каталога 
  protected _items: IProduct[] = [];

  //  Товар, выбранный для подробного отображения 
  protected _selected: IProduct | null = null;

 // Начальные товары
  constructor(items?: IProduct[]) {
    if (items) this.saveProducts(items);
  }

  // Сохранить массив товаров (полная замена)
  saveProducts(items: IProduct[]): void {
    this._items = [...items];
  }

  // Получить все товары
  getProducts(): IProduct[] {
    return [...this._items];
  }

  // Найти товар по id
  getProductById(id: ProductId): IProduct | undefined {
    return this._items.find((p) => p.id === id);
  }

  //  Сохранить товар для подробного отображения
  setSelectedProduct(product: IProduct | null): void {
    this._selected = product;
  }

  // Получить выбранный товар
  getSelectedProduct(): IProduct | null {
    return this._selected ? { ...this._selected } : null;
  }
}
