import { render } from "../render";
import ListView from "../view/list-view";
import SortView from "../view/sort-view";
import PointPresenter from "./point-presenter";

import dayjs from "dayjs";
import { getDuration } from "../utils";
import { RenderPosition, SortType } from "../const";

class TripPresenter {

  #boardContainter = null;
  #points = null;

  #sortComponent = new SortView();
  #currentSortType = SortType.DAY;

  #listComponent = new ListView();

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
    const pointPresenter = new PointPresenter(this.#listComponent);
    pointPresenter.init(point);
  }

  _renderPoints = () => {
    this.#points.forEach((point) => this._renderPoint(point));
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
    this.#listComponent.element.innerHTML = '';
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

}

export default TripPresenter;
