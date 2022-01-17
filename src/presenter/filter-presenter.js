import FiltersView from '../view/filter-view';
import { remove, render, replace } from '../utils/render';
import { filter } from '../utils/filter';

import { FilterType, RenderPosition, UpdateType } from '../const';

class FilterPresenter {

  #filterContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #filterComponent = null;

  constructor(filterContainer, pointsModel, filterModel) {
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        name: FilterType.EVERYTHING,
        count: filter[FilterType.EVERYTHING](points).length
      },
      {
        name: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](points).length
      },
      {
        name: FilterType.PAST,
        count: filter[FilterType.PAST](points).length
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, this.#filterModel.filter);
    this.#filterComponent.setFiterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#pointsModel.addObserver(this.#handleModeEvent);
    this.#filterModel.addObserver(this.#handleModeEvent);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#pointsModel.removeObserver(this.#handleModeEvent);
    this.#filterModel.removeObserver(this.#handleModeEvent);

    this.#filterModel.filter = FilterType.EVERYTHING;
  }

  #handleModeEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MINOR, filterType);
  }
}

export default FilterPresenter;

