import { IEvents } from "../base/Events";

// BaseFormView: общий функционал форм (значения/ошибки/submit).

export abstract class BaseFormView {
  protected readonly events: IEvents;
  protected readonly el: HTMLFormElement;
  protected readonly submitBtn?: HTMLButtonElement | null;
  protected readonly errorsBox?: HTMLElement | null;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.events = events;
    this.el = (template.content.firstElementChild as HTMLFormElement).cloneNode(
      true
    ) as HTMLFormElement;
    this.submitBtn = this.el.querySelector(
      'button[type="submit"], .button[type="submit"], .form__submit'
    );
    this.errorsBox = this.el.querySelector(".form__errors");

    this.el.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("form:submit", this.collectValues());
    });

    this.el.addEventListener("input", () =>
      this.events.emit("form:change", this.collectValues())
    );
    this.el.addEventListener("change", () =>
      this.events.emit("form:change", this.collectValues())
    );
  }

  render(): HTMLElement {
    return this.el;
  }
  protected abstract collectValues(): Record<string, unknown>;

  setSubmitDisabled(disabled: boolean): void {
    if (this.submitBtn) this.submitBtn.disabled = disabled;
  }

  setErrors(errors: Record<string, string | undefined>): void {
    if (!this.errorsBox) return;
    const msgs = Object.values(errors).filter(Boolean) as string[];
    this.errorsBox.textContent = msgs.join(". ");
  }

  clearErrors(): void {
    if (this.errorsBox) this.errorsBox.textContent = "";
  }
}
