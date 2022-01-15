import { nanoid } from 'nanoid';
import { RenderPosition, UpdateType, UserAction } from '../const';
import { remove, render } from '../utils/render';
import EditPointView from '../view/edit-point-view';

class NewPointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #editComponent = null;
  #destroyCallback = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editComponent !== null) {
      return;
    }

    this.#editComponent = new EditPointView();
    this.#editComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editComponent.setFormResetHandler (this.#handleDeleteClick);

    render(this.#pointListContainer, this.#editComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#editComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#editComponent);
    this.#editComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {
        id: nanoid(),
        ...point
      }
    );
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

}

export default NewPointPresenter;
