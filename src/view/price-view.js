import AbstractView from './abstract-view';

const createPriceTemplate = (price) => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
  </p>`
);

class PriceView extends AbstractView {

  #price = null;

  constructor(price) {
    super();
    this.#price = price;
  }

  get template() {
    return createPriceTemplate(this.#price);
  }
}

export default PriceView;
