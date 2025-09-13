import { BaseFormView } from "./BaseFormView";
import { IEvents } from "../base/Events";

/**
 * ContactsFormView: форма email + телефон
 */
export class ContactsFormView extends BaseFormView {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.emailInput = this.el.querySelector<HTMLInputElement>(
      'input[name="email"]'
    )!;
    this.phoneInput = this.el.querySelector<HTMLInputElement>(
      'input[name="phone"]'
    )!;
  }

  protected collectValues() {
    return { email: this.emailInput.value, phone: this.phoneInput.value };
  }

  setEmail(value: string): void {
    this.emailInput.value = value;
  }
  setPhone(value: string): void {
    this.phoneInput.value = value;
  }
}
