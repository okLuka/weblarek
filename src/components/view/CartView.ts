import { IEvents } from "../base/Events";

export class CartView {
  private readonly events: IEvents;
  private readonly el: HTMLElement;
  private readonly listEl: HTMLElement;
  private readonly sumEl: HTMLElement;
  private readonly checkoutBtn: HTMLButtonElement;
  private readonly emptyBox: HTMLElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.events = events;
    this.el = (template.content.firstElementChild as HTMLElement).cloneNode(
      true
    ) as HTMLElement;
    this.listEl = this.el.querySelector(".basket__list") as HTMLElement;
    this.sumEl = this.el.querySelector(".basket__price") as HTMLElement;
    this.checkoutBtn = this.el.querySelector(
      ".basket__button"
    ) as HTMLButtonElement;
    this.emptyBox = document.createElement("div");
    this.emptyBox.className = "basket__empty-box";
    this.emptyBox.setAttribute("role", "status");
    this.emptyBox.textContent = "Корзина пуста";
    this.emptyBox.hidden = true;

    this.el.insertBefore(this.emptyBox, this.listEl);

    this.checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("checkout:open", {});
    });
  }

  render(): HTMLElement {
    return this.el;
  }
  clear(): void {
    this.listEl.innerHTML = "";
  }
  mountItem(itemEl: HTMLElement): void {
    this.listEl.appendChild(itemEl);
  }
  setTotal(total: number): void {
    this.sumEl.textContent = `${total} синапсов`;
  }
  setCheckoutDisabled(disabled: boolean): void {
    this.checkoutBtn.disabled = disabled;
  }
  setEmpty(isEmpty: boolean, text = "Корзина пуста"): void {
    this.emptyBox.textContent = text;
    this.emptyBox.hidden = !isEmpty;
    this.listEl.hidden = isEmpty;
  }
}
