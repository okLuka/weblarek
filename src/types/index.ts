export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

import { Api } from '../components/base/Api';
import { API_URL } from '../utils/constants';
import { EventEmitter } from '../components/base/Events';
import { ensureElement } from '../utils/utils';

// Коммуникационный слой и модели
import { LarekApi } from '../components/models/LarekApi';
import { ProductCatalogModel } from '../components/models/ProductCatalogModel';
import { CartModel } from '../components/models/CartModel';
import { BuyerModel } from '../components/models/BuyerModel';

// View-компоненты, необходимые на этом шаге
import { CatalogGridView } from '../components/view/CatalogGridView';
import { CatalogCardView } from '../components/view/CatalogCardView';

// Уникальный идентификатор товара
export type ProductId = string;

// Вид оплаты.
export type TPayment = 'card' | 'cash';

/** Товар */
export interface IProduct {
  id: ProductId;         
  description: string;   
  image: string;         
  title: string;         
  category: string;      
  price: number | null;  
}

// Покупатель
export interface IBuyer {
  payment: TPayment; 
  email: string;     
  phone: string;     
  address: string;   
}

// Результат валидации данных покупателя
export interface IBuyerValidationResult {
  valid: boolean;                                   
  errors: Partial<Record<keyof IBuyer, string>>;    
}

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

// Запрос создания заказа 
export interface IOrderRequest {
  payment: string;            
  email: string;
  phone: string;              
  address: string;
  total: number;
  items: Array<IProduct['id']>;
}

// Успешный ответ на создание заказа
export interface IOrderResponse {
  id: string;
  total: number;
}

// Унифицированная ошибка сервера
export interface IErrorResponse {
  error: string;
}

