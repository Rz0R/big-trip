import { render, replace } from "../render";
import ListView from "../view/list-view";
import SortView from "../view/sort-view";

import dayjs from "dayjs";
import { getDuration } from "../utils";

import PointView from "../view/point-view";
import EditPointView from "../view/edit-point-view";
import { RenderPosition, SortType } from "../const";

const renderPoint = (taskListElement, point) => {
  const pointComponent = new PointView(point);
  const editPointComponent = new EditPointView(point);

  const replaceEventToForm = () => {
    replace(editPointComponent.element, pointComponent.element);
  };

  const replaceFormToEvent = () => {
    replace(pointComponent.element, editPointComponent.element);
  };

  pointComponent.setPointEditClickHandler(replaceEventToForm);

  editPointComponent.setFormSubmitHandler(replaceFormToEvent);
  editPointComponent.setFormResetHandler(replaceFormToEvent);

  render(taskListElement, pointComponent.element);
};

class TripPresenter {

  #taskListContainter = null;
  #points = null;

  #sortComponent = new SortView();
  #currentSortType = SortType.DAY;

  #listComponent = new ListView();

  constructor(taskListContainter) {
    this.#taskListContainter = taskListContainter;
  }

  init = (points) => {
    this.#points = [...points];
    this._renderSort();
    render(this.#taskListContainter, this.#listComponent.element);

    this._sortPoints(this.#currentSortType);
    this._renderPoints();
  }

  _renderPoints = () => {
    this.#points.forEach((point) => renderPoint(this.#listComponent.element, point));
  }

  _renderSort = () => {
    render(this.#taskListContainter, this.#sortComponent.element, RenderPosition.AFTERBEGIN);
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
