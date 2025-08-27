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

  // Валидация payment и address должны быть заполнены
  validateStep1(): IBuyerValidationResult {
    const errors: IBuyerValidationResult['errors'] = {};

    // только факт выбора и корректного значения
    if (this._payment !== 'card' && this._payment !== 'cash') {
      errors.payment = 'Выберите способ оплаты';
    }
    // только непустота адреса
    if (!this._address || this._address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  // Валидация email и phone должны быть заполнены
  validateStep2(): IBuyerValidationResult {
    const errors: IBuyerValidationResult['errors'] = {};

    // без regex — только непустота
    if (!this._email || this._email.trim() === '') {
      errors.email = 'Укажите email';
    }
    if (!this._phone || this._phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  // Общая валидация 
  validate(): IBuyerValidationResult {
    const s1 = this.validateStep1();
    const s2 = this.validateStep2();
    return {
      valid: s1.valid && s2.valid,
      errors: { ...s1.errors, ...s2.errors },
    };
  }

}
