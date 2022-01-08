import TripInfoHeaderView from './view/trip-info-header-view';
import TripInfoView from './view/trip-info-view';
import PriceView from './view/price-view';
import MenuView from './view/menu-view';
import FilterView from './view/filter-view';
import { render } from './utils/render';
import { RenderPosition } from './const';
import { generatePoint } from './mock/point';

import TripPresenter from './presenter/trip-presenter';

const POINT_COUNT = 1;
const points = Array.from({ length: POINT_COUNT }, generatePoint);

const renderHeader = () => {
  const siteTripMainElement = document.querySelector('.trip-main');
  const tripInfoHeaderComponent = new TripInfoHeaderView();
  render(siteTripMainElement, tripInfoHeaderComponent.element, RenderPosition.AFTERBEGIN);

  const siteTripInfoHeaderElement = siteTripMainElement.querySelector('.trip-info');
  const tripInfoComponent = new TripInfoView();
  render(siteTripInfoHeaderElement, tripInfoComponent.element);

  const priceComponent = new PriceView();
  render(siteTripInfoHeaderElement, priceComponent.element);

  const siteTripMenuElement = siteTripMainElement.querySelector('.trip-controls__navigation');
  const menuComponent = new MenuView();
  render(siteTripMenuElement, menuComponent.element);

  const siteTripFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');
  const filterComponent = new FilterView();
  render(siteTripFiltersElement, filterComponent.element);
};

renderHeader();

const siteTripEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter(siteTripEventsElement);

tripPresenter.init(points);


