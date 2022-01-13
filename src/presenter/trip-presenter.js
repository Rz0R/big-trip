import { render } from '../utils/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter';

import dayjs from 'dayjs';
import { getDuration } from '../utils/common';
import { filter } from '../utils/fiter';
import { RenderPosition, SortType} from '../const';

class TripPresenter {

  #boardContainter = null;
  #pointsModel = null;
  #filterModel = null;

  #sortComponent = new SortView();
  #currentSortType = SortType.DAY;
  #filterType = null;

  #listComponent = new ListView();

  #pointPresenters = new Map();

  constructor(boardContainter, pointsModel, filerModel) {
    this.#boardContainter = boardContainter;
    this.#pointsModel = pointsModel;
    this.#filterModel = filerModel;
  }

  get points() {

    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        filteredPoints.sort((a, b) => dayjs(a.dateFrom).toDate() - dayjs(b.dateFrom).toDate());
        break;
      case SortType.TIME:
        filteredPoints.sort((a, b) => getDuration(a.dateFrom, a.dateTo) - getDuration(b.dateFrom, b.dateTo));
        break;
      case SortType.PRICE:
        filteredPoints.sort((a, b) => a.basePrice - b.basePrice);
        break;
    }

    return filteredPoints;
  }

  init = () => {
    this.#renderSort();
    render(this.#boardContainter, this.#listComponent);
    this.#renderPoints();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent, this.#onDataChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #onDataChange = (updatedPoint) => {
    this.#pointsModel.updatePoint(updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  #renderSort = () => {
    render(this.#boardContainter, this.#sortComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  }

  #clearPointList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.setDefaultView());
  }

}

export default TripPresenter;
