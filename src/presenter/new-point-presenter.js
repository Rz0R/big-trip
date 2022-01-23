import EditPointView from '../view/edit-point-view';

import { RenderPosition, UpdateType, UserAction } from '../const';
import { remove, render } from '../utils/render';

import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

const DEFAULT_POINT = {
  'type': 'taxi',
  'dateFrom': dayjs().add(1, 'hour'),
  'dateTo': dayjs().add(2, 'hour'),
  'basePrice': 500,
  'destination': {
    'name': 'Chamonix',
    'description': 'Chamonix, in a middle of Europe, middle-eastern paradise, famous for its crowded street markets with the best street food in Asia.',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.5442767253004888',
        'description': 'Chamonix zoo'
      },
      {
        'src': 'http://picsum.photos/300/200?r=0.9459422561320008',
        'description': 'Chamonix city centre'
      },
      {
        'src': 'http://picsum.photos/300/200?r=0.14330792188576758',
        'description': 'Chamonix park'
      },
      {
        'src': 'http://picsum.photos/300/200?r=0.05754116582269897',
        'description': 'Chamonix central station'
      }
    ]
  },
  'offers': [],
};

class NewPointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #editComponent = null;
  #destroyCallback = null;

  #destinations = null;
  #allOffers = null;

  constructor(pointListContainer, changeData, destinations, allOffers) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#destinations = destinations;
    this.#allOffers = allOffers;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#editComponent !== null) {
      return;
    }

    this.#editComponent = new EditPointView(DEFAULT_POINT, this.#destinations, this.#allOffers);
    this.#editComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editComponent.setFormDeleteHandler(this.#handleDeleteClick);

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
    this.destroy();
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
