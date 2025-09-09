import { IEvents } from "../base/Events";

export class CatalogGridView {
  private readonly events: IEvents;
  private readonly root: HTMLElement;
  private readonly list: HTMLElement;


  constructor(root: HTMLElement, events: IEvents) {
    this.events = events;
    this.root = root; // .gallery
    this.list = root; 
  }

  render(): HTMLElement { return this.root; }
  clear(): void { this.list.innerHTML = ""; }

  mount(cardEl: HTMLElement): void { this.list.appendChild(cardEl); }
}