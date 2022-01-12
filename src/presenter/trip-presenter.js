import { render } from '../utils/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter';

import dayjs from 'dayjs';
import { getDuration, updateItem } from '../utils/common';
import { RenderPosition, SortType } from '../const';

class TripPresenter {

  #boardContainter = null;
  #pointsModel = null;

  #sortComponent = new SortView();
  #currentSortType = SortType.DAY;

  #listComponent = new ListView();

  #pointPresenters = new Map();

  constructor(boardContainter, pointsModel) {
    this.#boardContainter = boardContainter;
    this.#pointsModel = pointsModel;
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return this.#pointsModel.points.sort((a, b) => dayjs(a.dateFrom).toDate() - dayjs(b.dateFrom).toDate());
      case SortType.TIME:
        return this.#pointsModel.points.sort((a, b) => getDuration(a.dateFrom, a.dateTo) - getDuration(b.dateFrom, b.dateTo));
      case SortType.PRICE:
        return this.#pointsModel.points.sort((a, b) => a.basePrice - b.basePrice);
    }

    return this.#pointsModel.points;
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
    this.#pointsModel.points = updateItem(this.points, updatedPoint);
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
