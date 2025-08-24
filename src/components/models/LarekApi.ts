import { API_URL } from '../../utils/constants';
import type { IApi, IProduct, IProductListResponse, IOrderRequest, IOrderResponse } from '../../types/index';

export class LarekApi {
  constructor(private readonly api: IApi, private readonly baseUrl: string = API_URL) {}

  // GET /product/ — вернуть массив товаров
  async getProducts(): Promise<IProduct[]> {
    const data = await this.api.get<IProductListResponse>('/product/');
    // ожидается объект с { total, items }
    if (!data || !Array.isArray(data.items)) {
      throw new Error('Неверный формат ответа /product/');
    }
    return data.items;
  }

  // GET /product/{id} — получить товар по id
  async getProductById(id: IProduct['id']): Promise<IProduct> {
    const url = `${this.baseUrl.replace(/\/+$/, '')}/product/${id}`;
    return this.api.get<IProduct>(`/product/${id}`);
  }

  // POST /order — создать заказ
  async createOrder(payload: IOrderRequest): Promise<IOrderResponse> {
    const url = `${this.baseUrl.replace(/\/+$/, '')}/order`;
    return this.api.post<IOrderResponse>('/order', payload);
  }
}
