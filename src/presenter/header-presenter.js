import TripInfoHeaderView from '../view/trip-info-header-view';
import TripInfoView from '../view/trip-info-view';
import PriceView from '../view/price-view';

import { render, remove, replace } from '../utils/render';
import { RenderPosition } from '../const';

class HeaderPresenter {

  #headerContainer = null;
  #pointsModel = null;

  #tripInfoHeader = new TripInfoHeaderView();
  #tripInfo = new TripInfoView();
  #price = null;

  constructor(headerContainer, pointsModel) {
    this.#headerContainer = headerContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    render(this.#headerContainer, this.#tripInfoHeader, RenderPosition.AFTERBEGIN);
    this.#renderTripInfo();
    this.#renderPrice();

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    return this.#pointsModel.points;
  }

  #renderTripInfo = () => {
    render(this.#tripInfoHeader, this.#tripInfo, RenderPosition.AFTERBEGIN);
  }

  #renderPrice = () => {
    const prevPrice = this.#price;
    this.#price = new PriceView(this.#calculatePrice());

    if (prevPrice === null) {
      render(this.#tripInfoHeader, this.#price, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#price, prevPrice);
    remove(prevPrice);
  }

  #calculatePrice = () => this.points.reduce((price, point) => price + point.basePrice, 0);

  #handleModelEvent = () => {
    this.#renderPrice();
  }

}

export default HeaderPresenter;
