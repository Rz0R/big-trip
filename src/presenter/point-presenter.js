import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { remove, render, replace } from '../utils/render';
import { UpdateType, UserAction, State } from '../const';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

class PointPresenter {

  #pointListContainer = null;

  #pointComponent = null;
  #editComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #changeData = null;
  #changeMode = null;

  #cities = null;
  #offers = null;

  constructor(pointListContainer, changeData, changeMode, cities, offers) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#cities = cities;
    this.#offers = offers;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#editComponent;

    this.#pointComponent = new PointView(this.#point);
    this.#editComponent = new EditPointView(this.#point, this.#cities, this.#offers);

    this.#pointComponent.setPointEditClickHandler(this.#replaceEventToForm);
    this.#editComponent.setFormSubmitHandler(this.#hadleFormSubmit);
    this.#editComponent.setFormDeleteHandler(this.#handleFormDelete);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editComponent.setFormCancelClickHadler(this.setDefaultView);

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#pointListContainer, this.#pointComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditComponent);
      this.#mode = Mode.DEFAULT;
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
      this.#editComponent.reset(this.#point);
      this.#replaceFormToEvent();
    }
  }

  setViewState = (state) => {
    if (this.#mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this.#editComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#editComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this.#editComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#pointComponent.shake(resetFormState);
        this.#editComponent.shake(resetFormState);
        break;
    }
  }


  #escKeyDownHadler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editComponent.reset(this.#point);
      this.#replaceFormToEvent();
    }
  }

  #hadleFormSubmit = (updatedPoint) => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.MAJOR, updatedPoint);
  }

  #handleFormDelete = (point) => {
    this.#changeData(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  }

  #replaceFormToEvent = () => {
    replace(this.#pointComponent, this.#editComponent);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHadler);
  }

  #replaceEventToForm = () => {
    replace(this.#editComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHadler);
  }

  #handleFavoriteClick = () => {
    this.#changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, { ...this.#point, isFavorite: !this.#point.isFavorite });
  }
}

export default PointPresenter;
