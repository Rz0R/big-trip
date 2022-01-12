import AbstractView from './abstract-view';


const createFiterItemMarkup = (filter, activeFilter) => {
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
        ${name === activeFilter ? 'checked' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${name}">${name}(${count})</label>
    </div>`);
};

const createFitersTemplate = (filterItems, activeFilter) => {

  const fiterItemsMarkup = filterItems
    .map((filter) => createFiterItemMarkup(filter, activeFilter))
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
  #activeFilter = null;

  constructor(fiters, activeFilter) {
    super();
    this.#filters = fiters;
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createFitersTemplate(this.#filters, this.#activeFilter);
  }

}

export default FitersView;
