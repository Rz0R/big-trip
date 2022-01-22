import { generatePoint } from './mock/point';

import ApiService from './api-service';

import HeaderPresenter from './presenter/header-presenter';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import MenuPresenter from './presenter/menu-presenter';

import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

const POINT_COUNT = 10;
const points = Array.from({ length: POINT_COUNT }, generatePoint);
console.log(points);

const pointsModel = new PointsModel();
pointsModel.points = points;

const filterModel = new FilterModel();

const siteTripMainElement = document.querySelector('.trip-main');

const headerPresenter = new HeaderPresenter(siteTripMainElement, pointsModel);
headerPresenter.init();

const siteTripFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter(siteTripFiltersElement, pointsModel, filterModel);
filterPresenter.init();

const siteTripEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter(siteTripEventsElement, pointsModel, filterModel);

tripPresenter.init();

const newPointBtn = document.querySelector('.trip-main__event-add-btn');

const disableCreateButton = (isDisabled) => {
  newPointBtn.disabled = isDisabled;
};

const handleNewPointFormClose = () => {
  disableCreateButton(false);
};

const handleAddNewPointBtnClick = () => {
  disableCreateButton(true);
  tripPresenter.createPoint(handleNewPointFormClose);
};

newPointBtn.addEventListener('click', handleAddNewPointBtnClick);

const siteTripMenuElement = siteTripMainElement.querySelector('.trip-controls__navigation');
const menuPresenter = new MenuPresenter(siteTripMenuElement, siteTripEventsElement, tripPresenter, filterPresenter, disableCreateButton, pointsModel);
menuPresenter.init();

const AUTHORIZATION = 'Basic hS2hfS45wCk1sa2k';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

// apiService.points.then((data) => console.log(data));
//console.log(points);
// apiService.offers.then((data) => console.log(data));
// apiService.cities.then((data) => console.log(data));
