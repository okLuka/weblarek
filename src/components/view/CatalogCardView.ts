import { BaseCardView } from "./BaseCardView";
import { IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants"; 


export class CatalogCardView extends BaseCardView {
  private readonly rootButton: HTMLButtonElement | null;
  private id: string | null = null; 


  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.rootButton = this.el.matches("button") ? (this.el as HTMLButtonElement) : this.el.querySelector("button");


    // Слушатели
    this.on(this.rootButton ?? this.el, "click", (e) => {
      e.preventDefault();
      if (this.id) this.events.emit("product:open", { id: this.id });
    });
  }

    setId(id: string): void { this.id = id; }
    setTitle(title: string): void { this.setText(this.titleEl, title); }
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