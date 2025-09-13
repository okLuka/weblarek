import type { IEvents } from "../base/Events";
import { BaseCardView } from "./BaseCardView";
import { CDN_URL, categoryMap } from "../../utils/constants";

export abstract class ProductCardBaseView extends BaseCardView {
  protected id: string | null = null;
  protected readonly buyBtn: HTMLButtonElement | null;

  constructor(
    template: HTMLTemplateElement,
    protected readonly events: IEvents
  ) {
    super(template, events);
    this.buyBtn =
      this.container.querySelector<HTMLButtonElement>(".card__button") ?? null;

    if (this.buyBtn) {
      this.on(this.buyBtn, "click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.buyBtn.disabled) return;
        if (this.id) this.events.emit("product:toggle", { id: this.id });
      });
    }
  }

  setId(id: string): void {
    this.id = id;
  }
  setTitle(title: string): void {
    this.setText(this.titleEl, title);
  }
  setPriceValue(price: number | null): void {
    this.setPrice(price);
  }

  setImageSrc(path: string, alt?: string): void {
    if (!this.imageEl) return;
    const url = path ? `${CDN_URL}/${path}` : "";
    this.setImage(this.imageEl, url, alt);
  }

  setCategory(name: string): void {
    if (!this.categoryEl) return;
    this.categoryEl.textContent = name;
    const cls = this.categoryEl.classList;
    Object.values(categoryMap).forEach((m) => cls.remove(m));
    const mod = categoryMap[name as keyof typeof categoryMap];
    if (mod) cls.add(mod);
  }

  setBuyAvailable(available: boolean): void {
    if (!this.buyBtn) return;
    this.buyBtn.disabled = !available;
    this.buyBtn.textContent = available ? "В корзину" : "Недоступно";
  }

  setInCart(inCart: boolean): void {
    if (!this.buyBtn || this.buyBtn.disabled) return;
    this.buyBtn.textContent = inCart ? "Удалить из корзины" : "В корзину";
  }
}
