import AbstractObservable from './abstract-observable';
import { cloneDeep } from '../utils/common';
import { cities } from '../mock/cities';
import { offers } from '../mock/offers';

class PointsModel extends AbstractObservable {

  #points = [];
  #cities = cities;
  #offers = offers;

  set points(points) {
    this.#points = cloneDeep(points);
  }

  get points() {
    return cloneDeep(this.#points);
  }

  get cities() {
    return cloneDeep(this.#cities);
  }

  get offers() {
    return cloneDeep(this.#offers);
  }

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  // #adaptToClient = (point) => {
  //   const adaptedPoint = {
  //     ...point,
  //     basePrice: point.base_price,
  //     dateFrom: point.date_from,
  //     isFavorite: point.is_favorite,
  //   };
  // }

}

export default PointsModel;
