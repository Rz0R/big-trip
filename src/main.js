import { createTripInfoHeaderTemplate } from './view/trip-info-header';
import { createTripInfoTemplate } from './view/trip-info';
import { createTripPriceTemplate } from './view/trip-price';
import { createTripMenuTemplate } from './view/trip-menu';
import { createTripFitersTemplate } from './view/trip-filter';
import { createTripSortTemplate } from './view/trip-sort';
import { createListsTemplate } from './view/list';
import { createNewPointTemplate } from './view/new-point';
import { createPointTemplate } from './view/point';
import { render } from './render';
import { generatePoint } from './mock/point';


const POINT_COUNT = 10;

const siteTripMainElement = document.querySelector('.trip-main');

render(siteTripMainElement, createTripInfoHeaderTemplate(), 'afterbegin');

// const siteTripInfoHeaderElement = siteTripMainElement.querySelector('.trip-info');

// render(siteTripInfoHeaderElement, createTripInfoTemplate());
// render(siteTripInfoHeaderElement, createTripPriceTemplate());

// const siteTripMenuElement = siteTripMainElement.querySelector('.trip-controls__navigation');

// render(siteTripMenuElement, createTripMenuTemplate());

// const siteTripFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');

// render(siteTripFiltersElement, createTripFitersTemplate());

// const siteTripEventsElement = document.querySelector('.trip-events');

// render(siteTripEventsElement, createTripSortTemplate());

// render(siteTripEventsElement, createListsTemplate());

// const siteTripeEventsListElement = siteTripEventsElement.querySelector('.trip-events__list');

// render(siteTripeEventsListElement, createNewPointTemplate(generatePoint()));

// for (let i = 0; i < POINT_COUNT; i++) {
//   render(siteTripeEventsListElement, createPointTemplate(generatePoint()));
// }
