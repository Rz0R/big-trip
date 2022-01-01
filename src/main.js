import { RenderPosition } from './const';
import  TripInfoHeaderView from './view/trip-info-header-view';
import { createTripInfoTemplate } from './view/trip-info-view';
import { createTripPriceTemplate } from './view/price-view';
import { createTripMenuTemplate } from './view/menu-view';
import { createFitersTemplate } from './view/filter-view';
import { createTripSortTemplate } from './view/sort-view';
import { createListsTemplate } from './view/list-view';
import { createNewPointTemplate } from './view/new-point-view';
import { createPointTemplate } from './view/point-view';
import { render } from './render';
import { generatePoint } from './mock/point';


const POINT_COUNT = 10;

const siteTripMainElement = document.querySelector('.trip-main');
const tripInfoHeaderComponent = new TripInfoHeaderView();

render(siteTripMainElement, tripInfoHeaderComponent.element, RenderPosition.AFTERBEGIN);

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
