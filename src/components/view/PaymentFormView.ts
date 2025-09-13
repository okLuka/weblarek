import { BaseFormView } from "./BaseFormView";
import { IEvents } from "../base/Events";

export class PaymentFormView extends BaseFormView {
  private readonly addressInput: HTMLInputElement;
  private readonly cardBtn: HTMLButtonElement;
  private readonly cashBtn: HTMLButtonElement;
  private currentPayment: "card" | "cash" | "" = "";

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.cardBtn = this.el.querySelector<HTMLButtonElement>(
      'button[name="card"]'
    )!;
    this.cashBtn = this.el.querySelector<HTMLButtonElement>(
      'button[name="cash"]'
    )!;
    this.addressInput = this.el.querySelector<HTMLInputElement>(
      'input[name="address"]'
    )!;

    this.cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("form:change", {
        payment: "card",
        address: this.addressInput.value,
      });
    });
    this.cashBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("form:change", {
        payment: "cash",
        address: this.addressInput.value,
      });
    });
  }

  protected collectValues() {
    return { payment: this.currentPayment, address: this.addressInput.value };
  }

  setPaymentSelection(value: "card" | "cash" | ""): void {
    this.currentPayment = value;
    this.cardBtn.classList.toggle("button_alt-active", value === "card");
    this.cashBtn.classList.toggle("button_alt-active", value === "cash");
  }

  setAddress(value: string): void {
    this.addressInput.value = value;
  }
}
