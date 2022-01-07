import { render } from '../utils/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter';

import dayjs from 'dayjs';
import { getDuration, updateItem } from '../utils/common';
import { RenderPosition, SortType } from '../const';

class TripPresenter {

  #boardContainter = null;
  #points = null;

  #sortComponent = new SortView();
  #currentSortType = SortType.DAY;

  #listComponent = new ListView();

  #pointPresenters = new Map();

  constructor(boardContainter) {
    this.#boardContainter = boardContainter;
  }

  init = (points) => {
    this.#points = [...points];
    this._renderSort();
    render(this.#boardContainter, this.#listComponent);

    this._sortPoints(this.#currentSortType);
    this._renderPoints();
  }

  _renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent, this._onDataChange);
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  _renderPoints = () => {
    this.#points.forEach((point) => this._renderPoint(point));
  }

  _onDataChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  _renderSort = () => {
    render(this.#boardContainter, this.#sortComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this._sortPoints(sortType);
    this._clearPointList();
    this._renderPoints();
  }

  _sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#points.sort((a, b) => dayjs(a.dateFrom).toDate() - dayjs(b.dateFrom).toDate());
        break;
      case SortType.TIME:
        this.#points.sort((a, b) => getDuration(a.dateFrom, a.dateTo) - getDuration(b.dateFrom, b.dateTo));
        break;
      case SortType.PRICE:
        this.#points.sort((a, b) => a.basePrice - b.basePrice);
        break;
    }
  }

  _clearPointList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

}

export default TripPresenter;
