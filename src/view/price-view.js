import AbstractView from './abstract-view';
import { sumOffersPrice } from '../utils/common';

const createPriceTemplate = (points) => {
  const price = points.reduce((total, point) => total + point.basePrice + sumOffersPrice(point.offers), 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
    </p>`
  );
};

class PriceView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createPriceTemplate([...this.#points]);
  }
}

export default PriceView;
