import TripInfoHeaderView from './view/trip-info-header-view';
import TripInfoView from './view/trip-info-view';
import PriceView from './view/price-view';
import MenuView from './view/menu-view';
import FilterView from './view/filter-view';
import SortView from './view/sort-view';
import ListView from './view/list-view';
import NewPointView from './view/new-point-view';
import PointView from './view/point-view';
import { render, replace } from './render';
import { RenderPosition } from './const';
import { generatePoint } from './mock/point';


const POINT_COUNT = 10;
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

const renderPoint = (taskListElement, point) => {
  const pointComponent = new PointView(point);
  const newPointComponent = new NewPointView(point);

  const replaceEventToForm = () => {
    replace(newPointComponent.element, pointComponent.element);
  };

  const replaceFormToEvent = () => {
    replace(pointComponent.element, newPointComponent.element);
  };

  const editButton = pointComponent.element.querySelector('.event__rollup-btn');
  editButton.addEventListener('click', replaceEventToForm);

  const saveButton = newPointComponent.element.querySelector('.event__save-btn');
  saveButton.addEventListener('click', replaceFormToEvent);

  render(taskListElement, pointComponent.element);
};

const renderBoard = () => {
  const siteTripEventsElement = document.querySelector('.trip-events');
  const sortComponent = new SortView();
  render(siteTripEventsElement, sortComponent.element);

  const listComponent = new ListView();
  render(siteTripEventsElement, listComponent.element);

  const siteTripeEventsListElement = siteTripEventsElement.querySelector('.trip-events__list');

  points.forEach((point) => renderPoint(siteTripeEventsListElement, point));
};

renderBoard();


