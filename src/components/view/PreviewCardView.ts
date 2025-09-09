import { BaseCardView } from "./BaseCardView";
import { IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";


/**
* PreviewCardView
* События: product:add { id }
*/
export class PreviewCardView extends BaseCardView {
  private addBtn?: HTMLButtonElement | null;
  private descEl?: HTMLElement | null;
  private id: string | null = null;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.addBtn = this.el.querySelector<HTMLButtonElement>(".card__button");
    this.descEl = this.el.querySelector(".card__text");


    this.on(this.addBtn, "click", (e) => {
      e.preventDefault();
      if (this.id) this.events.emit("product:add", { id: this.id });
    });
  }


  setId(id: string): void { this.id = id; }
  setTitle(title: string): void { this.setText(this.titleEl, title); }
  setDescription(text: string): void { this.setText(this.descEl, text); }
  setPriceValue(price: number | null): void { this.setPrice(price); }
  setImageSrc(path: string, alt?: string): void { this.setImage(path ? `${CDN_URL}/${path}` : undefined, alt); }
  setCategory(name: string): void {
    if (!this.categoryEl) return;
    this.categoryEl.textContent = name;
    const cls = this.categoryEl.classList;
    Object.values(categoryMap).forEach((mod) => cls.remove(mod));
    const mod = categoryMap[name as keyof typeof categoryMap];
    if (mod) cls.add(mod);
  }
}