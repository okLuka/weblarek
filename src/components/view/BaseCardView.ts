import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

export abstract class BaseCardView<T = unknown> extends Component<T> {
  protected readonly events: IEvents;
  protected readonly template: HTMLTemplateElement;
  protected get el(): HTMLElement {
    return this.container;
  }

  // общие узлы карточек
  protected titleEl?: HTMLElement | null;
  protected imageEl?: HTMLImageElement | null;
  protected priceEl?: HTMLElement | null;
  protected categoryEl?: HTMLElement | null;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    const el = (template.content.firstElementChild as HTMLElement).cloneNode(
      true
    ) as HTMLElement;
    super(el);
    this.events = events;
    this.template = template;

    this.titleEl = this.container.querySelector(".card__title");
    this.imageEl =
      this.container.querySelector<HTMLImageElement>(".card__image");
    this.priceEl = this.container.querySelector(".card__price");
    this.categoryEl = this.container.querySelector(".card__category");

    this.bindBase();
  }

  protected bindBase(): void {}

  render(): HTMLElement {
    return this.container;
  }

  protected setText(el: Element | null | undefined, value: string): void {
    if (el) el.textContent = value;
  }

  protected setPrice(value: number | null | undefined): void {
    if (!this.priceEl) return;
    this.priceEl.textContent = value == null ? "Бесценно" : `${value} синапсов`;
  }

  protected on<K extends keyof HTMLElementEventMap>(
    el: Element | null | undefined,
    type: K,
    handler: (e: HTMLElementEventMap[K]) => void
  ): void {
    if (el) el.addEventListener(type, handler as EventListener);
  }
}
