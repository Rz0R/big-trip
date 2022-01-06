import PointView from "../view/point-view";
import EditPointView from "../view/edit-point-view";
import { render, replace } from "../render";

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
}

class PointPresenter {

  #taskListContainer = null;

  #pointComponent = null;
  #editComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor(taskListContainer) {
    this.#taskListContainer = taskListContainer;
  }

  init = (point) => {
    this.#point = point;

    this.#pointComponent = new PointView(this.#point);
    this.#editComponent = new EditPointView(this.#point);

    this.#pointComponent.setPointEditClickHandler(this._replaceEventToForm);
    this.#editComponent.setFormSubmitHandler(this._replaceFormToEvent);
    this.#pointComponent.setFavoriteClickHandler(() => console.log('click favorite!'));

    render(this.#taskListContainer, this.#pointComponent)
  }

  _replaceFormToEvent = () => {
    replace(this.#pointComponent, this.#editComponent);
  }

  _replaceEventToForm = () => {
    replace(this.#editComponent, this.#pointComponent);
  }

}

export default PointPresenter;
