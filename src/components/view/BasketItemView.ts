import { BaseCardView } from "./BaseCardView";
import { IEvents } from "../base/Events";


export class BasketItemView extends BaseCardView {
  private indexEl?: HTMLElement | null;
  private removeBtn?: HTMLButtonElement | null;
  private id: string | null = null;


  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.indexEl = this.el.querySelector(".basket__item-index");
    this.removeBtn = this.el.querySelector<HTMLButtonElement>(".basket__item-delete");


    this.on(this.removeBtn, "click", (e) => {
    e.preventDefault();
    if (this.id) this.events.emit("cart:remove", { id: this.id });
    });
  }


  setId(id: string): void { this.id = id; }
  setIndex(i: number): void { this.setText(this.indexEl, String(i)); }
  setTitle(title: string): void { this.setText(this.titleEl, title); }
  setPriceValue(price: number | null): void { this.setPrice(price); }
}