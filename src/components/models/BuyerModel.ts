import { IBuyer, IBuyerValidationResult, TPayment } from '../../types';

export class BuyerModel {
  protected _payment: TPayment = '' as TPayment;
  protected _address = '';
  protected _phone = '';
  protected _email = '';

  //  Начальные данные покупателя
  constructor(initial?: Partial<IBuyer>) {
    if (initial) this.setData(initial);
  }

  // Сохранить часть данных 
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.address !== undefined) this._address = data.address;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.email !== undefined) this._email = data.email;
  }

  // Точечные сеттеры
  setPayment(payment: TPayment): void { this._payment = payment; }
  setAddress(address: string): void { this._address = address; }
  setPhone(phone: string): void { this._phone = phone; }
  setEmail(email: string): void { this._email = email; }

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
  }

  // Форма 1: оплата и адрес
  validatePayment(): IBuyerValidationResult {
    const errors: IBuyerValidationResult['errors'] = {};
    if (this._payment !== 'card' && this._payment !== 'cash') {
      errors.payment = 'Выберите способ оплаты';
    }
    if (!this._address || this._address.trim() === '') {
      errors.address = 'Укажите адрес доставки';
    }
    return { valid: Object.keys(errors).length === 0, errors };
  }

  // Форма 2: email и телефон
  validateUser(): IBuyerValidationResult {
    const errors: IBuyerValidationResult['errors'] = {};
    if (!this._email || this._email.trim() === '') {
      errors.email = 'Укажите email';
    }
    if (!this._phone || this._phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }
    return { valid: Object.keys(errors).length === 0, errors };
  }
}
