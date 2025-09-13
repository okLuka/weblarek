import { IEvents } from "../base/Events";
import { ProductCardBaseView } from "./ProductCardBaseView";

export class CatalogCardView extends ProductCardBaseView {
  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);

    this.on(this.container, "click", (e) => {
      const target = e.target as Element;
      if (target.closest(".card__button")) return;
      e.preventDefault();
      if (this.id) this.events.emit("product:open", { id: this.id });
    });
  }
}
