import AbstractView from './abstract-view';

const createPriceTemplate = () => (
  `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
  </p>`
);

class PriceView extends AbstractView {
  get template() {
    return createPriceTemplate();
  }
}

export default PriceView;
