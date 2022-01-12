import FiltersView from '../view/filter-view';
import { remove, render, replace } from '../utils/render';
import { filter } from '../utils/fiter';

import { FilterType, RenderPosition } from '../const';

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
        count: filter[FilterType.EVERYTHING](points)
      },
      {
        name: FilterType.FUTURE,
        count: filter[FilterType.FUTURE](points)
      },
      {
        name: FilterType.PAST,
        count: filter[FilterType.PAST](points)
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, this.#filterModel.filter);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }
}

export default FilterPresenter;

