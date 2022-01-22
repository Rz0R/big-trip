import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import PointPresenter from './point-presenter';
import NewPointPresenter from './new-point-presenter';
import EmptyListView from '../view/empty-list-view';
import LoadingView from '../view/loading-view';

import dayjs from 'dayjs';
import { getDuration } from '../utils/common';
import { render, remove } from '../utils/render';
import { filter } from '../utils/filter';
import { RenderPosition, SortType } from '../const';
import { UserAction, UpdateType } from '../const';

class TripPresenter {

  #boardContainter = null;
  #pointsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = null;
  #isLoading = true;

  #listComponent = new ListView();
  #emptyListComponent = null;
  #loadingComponent = new LoadingView();
  #newPointPresenter = null;

  #pointPresenters = new Map();

  #destinations = null;
  #offers = null;

  constructor(boardContainter, pointsModel, filerModel) {
    this.#boardContainter = boardContainter;
    this.#pointsModel = pointsModel;
    this.#filterModel = filerModel;

    this.#destinations = [];
    this.#offers = [];
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
    render(this.#boardContainter, this.#listComponent);

    this.#renderBoard();

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  createPoint = (callback) => {
    if (this.#isLoading) {
      callback();
      return;
    }
    this.#newPointPresenter = new NewPointPresenter(this.#listComponent, this.#handleViewAction, this.#destinations, this.#offers);
    this.#newPointPresenter.init(callback);
    this.#handleModeChange();
  }

  destroy = () => {
    this.#clearBoard();
    remove(this.#listComponent);

    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listComponent, this.#handleViewAction, this.#handleModeChange, this.#destinations, this.#offers);
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#pointPresenters.get(data.id).init(data);
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#destinations = this.#pointsModel.destinations;
        this.#offers = this.#pointsModel.offers;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#boardContainter, this.#sortComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  }

  #clearPointList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.setDefaultView());
  }

  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterType);
    render(this.#boardContainter, this.#emptyListComponent);
  }

  #renderLoading = () => {
    render(this.#boardContainter, this.#loadingComponent);
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const pointCount = this.points.length;

    if (pointCount === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  #clearBoard = () => {
    remove(this.#sortComponent);
    this.#clearPointList();

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
  }

}

export default TripPresenter;
