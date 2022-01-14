import { FilterType } from '../const';
import AbstractObservable from './abstract-observable';

class FilterModel extends AbstractObservable {

  #activeFilter = FilterType.EVERYTHING;

  get filter() {
    return this.#activeFilter;
  }

  setFilter(UpdateType, filterType) {
    this.#activeFilter = filterType;
    this._notify(UpdateType, filterType);
  }
}

export default FilterModel;
