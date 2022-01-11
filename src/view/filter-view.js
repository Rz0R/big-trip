import AbstractView from './abstract-view';


const createFiterItemMarkup = (filter, isChecked) => {
  const { name, count } = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${name}"
        class="trip-filters__filter-input
        visually-hidden"
        type="radio"
        name="trip-filter"
        value="${name}"
        ${isChecked ? 'checked' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${name}">${name} ${count}</label>
    </div>`);
}

const createFitersTemplate = (filterItems) => {

  const fiterItemsMarkup = filterItems
    .map((filter, index) => createFiterItemMarkup(filter, index === 0))
    .join('\n');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${fiterItemsMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};


class FitersView extends AbstractView {

  #filters = null;

  constructor(fiters) {
    super();
    this.#filters = fiters;
  }

  get template() {
    return createFitersTemplate(this.#filters);
  }

}

export default FitersView;
