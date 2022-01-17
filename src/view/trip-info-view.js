import AbstractView from './abstract-view';
import dayjs from 'dayjs';

const createTripInfoTemplate = (points) => {
  const cities = points
    .sort((a, b) => dayjs(a.dateFrom).toDate() - dayjs(b.dateFrom).toDate())
    .map((point) => point.city);

  const title = cities.length <= 3
    ? cities.join(' &mdash; ')
    : `${cities[0]} &mdash; ... &mdash; ${cities.slice(-1)}`;

  const dates = points.length > 0
    ? `${dayjs(points[0].dateFrom).format('MMM DD')} &mdash; ${dayjs(points[points.length - 1].dateTo).format('MMM DD')}`
    : '';

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${dates}</p>
    </div>`
  );
};
class TripInfoView extends AbstractView {
  #points;

  constructor(points = []) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripInfoTemplate([...this.#points]);
  }
}

export default TripInfoView;
