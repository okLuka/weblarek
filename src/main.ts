import "./scss/styles.scss";

import { ProductCatalogModel } from "./components/models/ProductCatalogModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { LarekApi } from "./components/base/LarekApi";
import { EventEmitter } from "./components/base/Events";
//  View
import { CatalogGridView } from "./components/view/CatalogGridView";
import { CatalogCardView } from "./components/view/CatalogCardView";
import { PreviewCardView } from "./components/view/PreviewCardView";
import { ModalView } from "./components/view/ModalView";
import { HeaderCartView } from "./components/view/HeaderCartView";
import { CartView } from "./components/view/CartView";
import { BasketItemView } from "./components/view/BasketItemView";
import { PaymentFormView } from "./components/view/PaymentFormView";
import { ContactsFormView } from "./components/view/ContactsFormView";
import { SuccessView } from "./components/view/SuccessView";

// Утилита
function ensureElement<T extends Element>(
  selector: string,
  parent: ParentNode = document
): T {
  const el = parent.querySelector(selector);
  if (!el) throw new Error(`Не найден элемент по селектору: ${selector}`);
  return el as T;
}

function bootstrap() {
  const events = new EventEmitter();

  const http = new Api(API_URL);
  const server = new LarekApi(http);

  const catalog = new ProductCatalogModel();
  const cart = new CartModel();
  const buyer = new BuyerModel();

  catalog.attachEvents(events);
  cart.attachEvents(events);
  buyer.attachEvents(events);

  const tplCatalogCard = ensureElement<HTMLTemplateElement>("#card-catalog");
  const tplPreview = ensureElement<HTMLTemplateElement>("#card-preview");
  const tplBasket = ensureElement<HTMLTemplateElement>("#basket");
  const tplBasketItem = ensureElement<HTMLTemplateElement>("#card-basket");
  const tplOrder = ensureElement<HTMLTemplateElement>("#order"); // форма оплата+адрес
  const tplContacts = ensureElement<HTMLTemplateElement>("#contacts"); // форма email+телефон
  const tplSuccess = ensureElement<HTMLTemplateElement>("#success");

  const galleryRoot = ensureElement<HTMLElement>(".gallery");
  const modalRoot = ensureElement<HTMLElement>("#modal-container");
  const headerBtn = ensureElement<HTMLElement>(".header__basket");
  const headerCounter = ensureElement<HTMLElement>(".header__basket-counter");

  const catalogGrid = new CatalogGridView(galleryRoot, events);
  const modal = new ModalView(modalRoot, events);
  const headerCart = new HeaderCartView(headerBtn, headerCounter, events);

  let paymentForm: PaymentFormView | null = null;
  let contactsForm: ContactsFormView | null = null;
  const catalogCardMap = new Map<string, CatalogCardView>();

  let cartModalActive = false;

  let currentPreview: { view: PreviewCardView; id: string } | null = null;

  // ПРЕЗЕНТЕР: обработчики событий

  // 1) Каталог обновлён → отрисовать список карточек
  events.on("catalog:updated", () => {
    const products = catalog.getProducts();
    catalogGrid.clear();
    catalogCardMap.clear();
    products.forEach((p) => {
      const card = new CatalogCardView(tplCatalogCard, events);
      card.setId(p.id);
      card.setTitle(p.title);
      card.setPriceValue(p.price);
      card.setImageSrc(p.image, p.title);
      card.setCategory(p.category);
      card.setBuyAvailable(p.price !== null);
      card.setInCart(cart.hasItem(p.id));
      catalogGrid.mount(card.render());
      catalogCardMap.set(p.id, card);
    });
  });

  // 2) Клик по карточке каталога → открыть превью в модалке
  events.on<{ id: string }>("product:open", ({ id }) => {
    const p = catalog.getProductById(id);
    if (!p) return;

    const preview = new PreviewCardView(tplPreview, events);
    preview.setId(p.id);
    preview.setTitle(p.title);
    preview.setPriceValue(p.price);
    preview.setImageSrc(p.image, p.title);
    preview.setCategory(p.category);
    preview.setDescription(p.description ?? "");

    const available = p.price !== null;
    preview.setBuyAvailable(available);
    preview.setInCart(cart.hasItem(p.id));

    modal.open(preview.render());
    cartModalActive = false;
    paymentForm = null;
    contactsForm = null;
    currentPreview = { view: preview, id: p.id };
  });

  // 3) Добавить товар из превью → модель корзины обновится и сама эмитит cart:updated
  const onProductToggle = ({ id }: { id: string }) => {
    const p = catalog.getProductById(id);
    if (!p || p.price === null) return;

    if (cart.hasItem(id)) {
      const item = cart.getItems().find((x) => x.id === id);
      if (item) cart.removeItem(item);
    } else {
      cart.addItem(p);
    }

    // мгновенная синхронизация текста на открытых view
    if (currentPreview && currentPreview.id === id) {
      currentPreview.view.setInCart(cart.hasItem(id));
    }
    const card = catalogCardMap.get(id);
    if (card) card.setInCart(cart.hasItem(id));
  };

  events.on<{ id: string }>("product:toggle", onProductToggle);
  events.on<{ id: string }>("product:add", onProductToggle);

  // 4) Клик по иконке корзины в шапке → открыть корзину
  events.on("cart:open", () => openCartModal());

  // 5) Удаление позиции из корзины (кнопка в карточке корзины)
  events.on<{ id: string }>("cart:remove", ({ id }) => {
    const item = cart.getItems().find((x) => x.id === id);
    if (item) cart.removeItem(item);
  });

  // 6) Любое изменение корзины → обновить счётчик;
  events.on("cart:updated", () => {
    headerCart.updateCount(cart.getCount());
    if (cartModalActive) openCartModal();
    for (const [id, card] of catalogCardMap) {
      card.setInCart(cart.hasItem(id));
    }
  });

  // 7) Нажата кнопка «Оформить» в корзине → открыть форму оплаты/адреса
  events.on("checkout:open", () => openPaymentForm());

  // 8) Любое изменение данных покупателя (модель эмитит) → обновить активную форму
  events.on("buyer:updated", () => {
    const v = buyer.validate();
    const data = buyer.getData();

    if (paymentForm) {
      paymentForm.setPaymentSelection(data.payment as "card" | "cash" | "");
      paymentForm.setAddress(data.address);
      paymentForm.setErrors({
        payment: v.errors.payment,
        address: v.errors.address,
      });
      paymentForm.setSubmitDisabled(
        Boolean(v.errors.payment || v.errors.address)
      );
    }
    if (contactsForm) {
      contactsForm.setEmail(data.email);
      contactsForm.setPhone(data.phone);
      contactsForm.setErrors({ email: v.errors.email, phone: v.errors.phone });
      contactsForm.setSubmitDisabled(Boolean(v.errors.email || v.errors.phone));
    }
  });

  // 9) Ввод в формах → обновить модель покупателя
  events.on("form:change", (values: Record<string, unknown>) => {
    if ("payment" in values) {
      const v = values["payment"];
      if (v === "card" || v === "cash" || v === "") buyer.setPayment(v as any);
    }
    if ("address" in values) buyer.setAddress(String(values["address"] ?? ""));
    if ("email" in values) buyer.setEmail(String(values["email"] ?? ""));
    if ("phone" in values) buyer.setPhone(String(values["phone"] ?? ""));
  });

  // 10) Сабмит форм
  events.on("form:submit", () => {
    const v = buyer.validate();
    const data = buyer.getData();

    if (paymentForm) {
      if (!v.errors.payment && !v.errors.address) {
        openContactsForm();
      }
      return;
    }

    if (contactsForm) {
      if (!v.errors.email && !v.errors.phone) {
        const { payment, address, email, phone } = data;
        const items = cart.getItems().map((p) => p.id);
        const total = cart.getTotal();

        server
          .createOrder({ payment, address, email, phone, total, items })
          .then((res) => {
            const success = new SuccessView(tplSuccess, () => modal.close());
            success.setTitle("Заказ оформлен");
            success.setTotal(res.total);
            modal.open(success.render());

            cart.clear();
            buyer.clear();
            paymentForm = null;
            contactsForm = null;
          })
          .catch((e) => {
            if (contactsForm) contactsForm.setErrors({ email: String(e) });
          });
      }
      return;
    }
  });

  // 11) Закрытие модалки → сброс локальных ссылок форм и флагов
  events.on("modal:close", () => {
    cartModalActive = false;
    paymentForm = null;
    contactsForm = null;
  });

  function openCartModal() {
    const view = new CartView(tplBasket, events);
    view.clear();

    cart.getItems().forEach((p, idx) => {
      const item = new BasketItemView(tplBasketItem, events);
      item.setId(p.id);
      item.setIndex(idx + 1);
      item.setTitle(p.title);
      item.setPriceValue(p.price);
      view.mountItem(item.render());
    });

    view.setTotal(cart.getTotal());
    view.setCheckoutDisabled(cart.getCount() === 0);

    view.setEmpty(cart.getCount() === 0);

    modal.open(view.render());
    cartModalActive = true;
    paymentForm = null;
    contactsForm = null;
  }

  function openPaymentForm() {
    const v = buyer.validate();
    const data = buyer.getData();

    paymentForm = new PaymentFormView(tplOrder, events);
    paymentForm.setPaymentSelection(data.payment as "card" | "cash" | "");
    paymentForm.setAddress(data.address);
    paymentForm.setErrors({
      payment: v.errors.payment,
      address: v.errors.address,
    });
    paymentForm.setSubmitDisabled(
      Boolean(v.errors.payment || v.errors.address)
    );

    modal.open(paymentForm.render());
    cartModalActive = false;
    contactsForm = null;
  }

  function openContactsForm() {
    const v = buyer.validate();
    const data = buyer.getData();

    contactsForm = new ContactsFormView(tplContacts, events);
    contactsForm.setEmail(data.email);
    contactsForm.setPhone(data.phone);
    contactsForm.setErrors({ email: v.errors.email, phone: v.errors.phone });
    contactsForm.setSubmitDisabled(Boolean(v.errors.email || v.errors.phone));

    modal.open(contactsForm.render());
    cartModalActive = false;
    paymentForm = null;
  }
  server
    .getProducts()
    .then((items) => catalog.saveProducts(items)) // триггерит catalog:updated
    .catch((err) => console.error("Ошибка загрузки каталога:", err));
}

document.addEventListener("DOMContentLoaded", bootstrap);
