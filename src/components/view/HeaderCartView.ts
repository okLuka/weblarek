import { IEvents } from "../base/Events";

export class HeaderCartView {
  private readonly events: IEvents;
  private readonly btn: HTMLElement;
  private readonly counter: HTMLElement;

  constructor(btn: HTMLElement, counter: HTMLElement, events: IEvents) {
    this.events = events;
    this.btn = btn; // .header__basket
    this.counter = counter; // .header__basket-counter

    this.btn.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit("cart:open", {});
    });
  }

  render(): HTMLElement {
    return this.btn;
  }
  updateCount(count: number): void {
    this.counter.textContent = String(count);
  }
}
