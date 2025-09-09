import { IEvents } from "../base/Events";


export class ModalView {
  private readonly events: IEvents;
  private readonly root: HTMLElement; // .modal
  private readonly content: HTMLElement; // .modal__content
  private readonly closeBtn: HTMLElement; // .modal__close


  constructor(root: HTMLElement, events: IEvents) {
    this.events = events;
    this.root = root;
    this.content = root.querySelector(".modal__content") as HTMLElement;
    this.closeBtn = root.querySelector(".modal__close") as HTMLElement;


    this.root.addEventListener("click", (e) => { if (e.target === this.root) this.close(); });
    this.closeBtn.addEventListener("click", (e) => { e.preventDefault(); this.close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && this.isOpen()) this.close(); });
  }
  render(): HTMLElement { return this.root; }

  open(content: HTMLElement): void {
    this.setContent(content);
    this.root.classList.add("modal_active");
    this.events.emit("modal:open", {});
  }

  close(): void {
    this.root.classList.remove("modal_active");
    this.content.innerHTML = "";
    this.events.emit("modal:close", {});
  }

  setContent(content: HTMLElement): void {
    this.content.innerHTML = "";
    this.content.appendChild(content);
  }

  isOpen(): boolean { return this.root.classList.contains("modal_active"); }
}