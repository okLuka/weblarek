import { IEvents } from "../base/Events";
import { ProductCardBaseView } from "./ProductCardBaseView";

/**
 * PreviewCardView
 * События: product:add { id }
 */
export class PreviewCardView extends ProductCardBaseView {
  private readonly descEl: HTMLElement | null;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.descEl = this.container.querySelector(".card__text");
  }

  setDescription(text: string): void {
    this.setText(this.descEl, text);
  }
}
