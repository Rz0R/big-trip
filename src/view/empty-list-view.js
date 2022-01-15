import AbstractView from './abstract-view';
import { FilterType } from '../const';

const EmptyListText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future points now',
  [FilterType.PAST]: 'There are no past points now',
};

const createEmptyListTemplate = (filterType) => {
  const emptyListText = EmptyListText[filterType];

  return (
    `<p class="trip-events__msg">
      ${emptyListText}
    </p>`
  );
};

class EmptyListView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}

export default EmptyListView;
