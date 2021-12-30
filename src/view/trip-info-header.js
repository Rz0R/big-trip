import { createElement } from "../render";

const createTripInfoHeaderTemplate = () => (
  `<section class="trip-main__trip-info  trip-info">
  </section>`
);

class TripInfoHeaderView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTripInfoHeaderTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

export default TripInfoHeaderView;
