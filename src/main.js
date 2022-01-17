import MenuView from './view/menu-view';
import { render } from './utils/render';

import { generatePoint } from './mock/point';

import HeaderPresenter from './presenter/header-presenter';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';

import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

const POINT_COUNT = 10;
const points = Array.from({ length: POINT_COUNT }, generatePoint);

const pointsModel = new PointsModel();
pointsModel.points = points;

const filterModel = new FilterModel();

const siteTripMainElement = document.querySelector('.trip-main');

const headerPresenter = new HeaderPresenter(siteTripMainElement, pointsModel);
headerPresenter.init();

const renderHeader = () => {
  const siteTripMenuElement = siteTripMainElement.querySelector('.trip-controls__navigation');
  const menuComponent = new MenuView();
  render(siteTripMenuElement, menuComponent.element);

  const siteTripFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');
  const filterPresenter = new FilterPresenter(siteTripFiltersElement, pointsModel, filterModel);
  filterPresenter.init();
};

renderHeader();

const siteTripEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter(siteTripEventsElement, pointsModel, filterModel);

tripPresenter.init();

const newPointBtn = document.querySelector('.trip-main__event-add-btn');

const handleNewPointFormClose = () => {
  newPointBtn.disabled = false;
};

const handleAddNewPointBtnClick = () => {
  newPointBtn.disabled = true;
  tripPresenter.createPoint(handleNewPointFormClose);
};

newPointBtn.addEventListener('click', handleAddNewPointBtnClick);
