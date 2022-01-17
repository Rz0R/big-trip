import TripInfoHeaderView from '../view/trip-info-header-view';
import TripInfoView from '../view/trip-info-view';
import PriceView from '../view/price-view';

import { render, remove, replace } from '../utils/render';
import { RenderPosition } from '../const';

class HeaderPresenter {

  #headerContainer = null;
  #pointsModel = null;

  #tripInfoHeaderComponent = new TripInfoHeaderView();
  #tripInfoComponent = null;
  #priceComponent = null;

  constructor(headerContainer, pointsModel) {
    this.#headerContainer = headerContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    render(this.#headerContainer, this.#tripInfoHeaderComponent, RenderPosition.AFTERBEGIN);
    this.#renderTripInfo();
    this.#renderPrice();

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    return this.#pointsModel.points;
  }

  #renderTripInfo = () => {
    const preveTripInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView(this.points);

    if (preveTripInfoComponent === null) {
      render(this.#tripInfoHeaderComponent, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, preveTripInfoComponent);
    remove(preveTripInfoComponent);
  }

  #renderPrice = () => {
    const prevPrice = this.#priceComponent;
    this.#priceComponent = new PriceView(this.points);

    if (prevPrice === null) {
      render(this.#tripInfoHeaderComponent, this.#priceComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#priceComponent, prevPrice);
    remove(prevPrice);
  }

  #handleModelEvent = () => {
    this.#renderTripInfo();
    this.#renderPrice();
  }

}

export default HeaderPresenter;
