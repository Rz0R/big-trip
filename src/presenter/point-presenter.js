import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { remove, render, replace } from '../utils/render';

import { generateDescription } from '../mock/point';

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

  constructor(taskListContainer, changeData) {
    this.#taskListContainer = taskListContainer;
    this.#changeData = changeData;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    this.#pointComponent = new PointView(this.#point);
    this.#editComponent = new EditPointView(this.#point);

    this.#pointComponent.setPointEditClickHandler(this._replaceEventToForm);
    this.#editComponent.setFormSubmitHandler(this._replaceFormToEvent);
    this.#pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this.#editComponent.setCityChangeHadler(this._handleCityChange);
    this.#editComponent.setTypeChangeHandler(this._hadleTypeChange);

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

  _replaceFormToEvent = () => {
    replace(this.#pointComponent, this.#editComponent);
    this.#mode = Mode.DEFAULT;
  }

  _replaceEventToForm = () => {
    replace(this.#editComponent, this.#pointComponent);
    this.#mode = Mode.EDITING;
  }

  _handleFavoriteClick = () => {
    this.#changeData({ ...this.#point, isFavorite: !this.#point.isFavorite });
  }

  _handleCityChange = (city) => {
    const description = generateDescription();
    this.#changeData({ ...this.#point, city, description });
  }

  _hadleTypeChange = (type) => {
    this.#changeData({ ...this.#point, type });

  }
}

export default PointPresenter;
