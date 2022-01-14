import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { remove, render, replace } from '../utils/render';
import { UpdateType, UserAction } from '../const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

class PointPresenter {

  #taskListContainer = null;

  #pointComponent = null;
  #editComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #changeData = null;
  #changeMode = null;

  constructor(taskListContainer, changeData, changeMode) {
    this.#taskListContainer = taskListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    this.#pointComponent = new PointView(this.#point);
    this.#editComponent = new EditPointView(this.#point);

    this.#pointComponent.setPointEditClickHandler(this.#replaceEventToForm);
    this.#editComponent.setFormSubmitHandler(this.#hadleFormSubmit);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#taskListContainer, this.#pointComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editComponent, prevEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editComponent);
  }

  setDefaultView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this._replaceFormToEvent();
    }
  }

  #hadleFormSubmit = (updatedPoint) => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.MAJOR, updatedPoint);
    this.#replaceFormToEvent();
  }

  #replaceFormToEvent = () => {
    replace(this.#pointComponent, this.#editComponent);
    this.#mode = Mode.DEFAULT;
  }

  #replaceEventToForm = () => {
    replace(this.#editComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #handleFavoriteClick = () => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, { ...this.#point, isFavorite: !this.#point.isFavorite });
  }
}

export default PointPresenter;
