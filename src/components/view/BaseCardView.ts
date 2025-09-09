import { IEvents } from "../base/Events";
import { setElementData } from "../../utils/utils";

export abstract class BaseCardView {
  protected events: IEvents;
  protected template: HTMLTemplateElement;
  protected el: HTMLElement;

  protected titleEL?: HTMLElement | null;
  protected titleEl?: HTMLElement | null;
  protected imageEl?: HTMLImageElement | null;
  protected priceEl?: HTMLElement | null;
  protected categoryEl?: HTMLElement | null;


  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.events = events;
    this.template = template;
    this.el = (this.template.content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;


    // Поиск опорных узлов 
    this.titleEl = this.el.querySelector(".card__title");
    this.imageEl = this.el.querySelector<HTMLImageElement>(".card__image");
    this.priceEl = this.el.querySelector(".card__price");
    this.categoryEl = this.el.querySelector(".card__category");


    // Слушатели 
    this.bindBase();
  }

  protected bindBase(): void {}


    // Вернуть корневой элемент карточки 
  render(): HTMLElement {
    return this.el;
  }


  protected setText(el: Element | null | undefined, value: string): void {
    if (el) el.textContent = value;
  }


  protected setPrice(value: number | null | undefined): void {
    if (!this.priceEl) return;
    this.priceEl.textContent = value == null ? "Бесценно" : String(value);
  }


  protected setImage(src?: string, alt?: string): void {
    if (!this.imageEl) return;
    if (src) this.imageEl.src = src;
    if (alt) this.imageEl.alt = alt;
  }

  protected on<K extends keyof HTMLElementEventMap>(el: Element | null | undefined, type: K, handler: (e: HTMLElementEventMap[K]) => void): void {
    if (el) el.addEventListener(type, handler as EventListener);
  }

}