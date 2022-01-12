import { FilterType } from '../const';
import AbstractObservable from './abstract-observable';

class FilterModel extends AbstractObservable {

  #activeFilter = FilterType.EVERYTHING;

  get filter() {
    return this.#activeFilter;
  }

  set filter(filter) {
    this.#activeFilter = filter;
    this._notify(filter);
  }
}

export default FilterModel;
