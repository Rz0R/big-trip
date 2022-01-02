import { createElement } from '../render';
import AbstractView from './abstract-view';

const createTripInfoHeaderTemplate = () => (
  `<section class="trip-main__trip-info  trip-info">
  </section>`
);

class TripInfoHeaderView extends AbstractView {

  get template() {
    return createTripInfoHeaderTemplate();
  }
}

export default TripInfoHeaderView;
