import { IBuyer, IBuyerValidationResult, TPayment } from '../../types';
import type { IEvents } from '../base/Events';

export class BuyerModel {
  protected _payment: TPayment = '' as TPayment;
  protected _address = '';
  protected _phone = '';
  protected _email = '';
  private events?: IEvents;

  //  Начальные данные покупателя
  constructor(initial?: Partial<IBuyer>) {
    if (initial) this.setData(initial);
  }

  attachEvents(events: IEvents): void { this.events = events; }
  private emit(name: string, data?: unknown): void { this.events?.emit(name, data as object); }

  // Сохранить часть данных 
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email;
    this.emit('buyer:updated', this.getData());
  }

  // Точечные сеттеры
  setPayment(v: TPayment): void { this._payment = v; this.emit('buyer:updated', this.getData()); }
  setAddress(v: string): void { this._address = v; this.emit('buyer:updated', this.getData()); }
  setPhone(v: string): void { this._phone = v; this.emit('buyer:updated', this.getData()); }
  setEmail(v: string): void { this._email = v; this.emit('buyer:updated', this.getData()); }

  // Получить все данные покупателя
  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      phone: this._phone,
      email: this._email,
    };
  }

  //  Очистить данные покупателя
  clear(): void {
    this._payment = '' as TPayment;
    this._address = '';
    this._phone = '';
    this._email = '';
    this.emit('buyer:cleared', this.getData());
  }

  // валидация всех данных модели.
  validate(): IBuyerValidationResult {
    const errors: IBuyerValidationResult['errors'] = {};

    if (this._payment !== 'card' && this._payment !== 'cash') {
      errors.payment = 'Выберите способ оплаты';
    }
    if (!this._address || this._address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }
    if (!this._email || this._email.trim() === '') {
      errors.email = 'Укажите email';
    }
    if (!this._phone || this._phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

}
