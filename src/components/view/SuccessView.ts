export class SuccessView {
  private readonly el: HTMLElement;
  private readonly titleEl: HTMLElement;
  private readonly descEl: HTMLElement;
  private readonly closeBtn: HTMLButtonElement;


  constructor(template: HTMLTemplateElement, onClose?: () => void) {
    this.el = (template.content.firstElementChild as HTMLElement).cloneNode(true) as HTMLElement;
    this.titleEl = this.el.querySelector(".order-success__title") as HTMLElement;
    this.descEl = this.el.querySelector(".order-success__description") as HTMLElement;
    this.closeBtn = this.el.querySelector(".order-success__close") as HTMLButtonElement;


    if (onClose) this.closeBtn.addEventListener("click", (e) => { e.preventDefault(); onClose(); });
  }


  render(): HTMLElement { return this.el; }
  setTitle(text: string): void { this.titleEl.textContent = text; }
  setTotal(sum: number): void { this.descEl.textContent = `Списано ${sum}`; }
}