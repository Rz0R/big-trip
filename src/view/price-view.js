import AbstractView from './abstract-view';

const createPriceTemplate = (points) => {
  const price = points.reduce((total, point) => total + point.basePrice, 0);

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
