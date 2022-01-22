import ApiService from './api-service';

import HeaderPresenter from './presenter/header-presenter';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import MenuPresenter from './presenter/menu-presenter';

import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

const AUTHORIZATION = 'Basic hS2hfS45wCk1sa2k';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel(apiService);
pointsModel.init();

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


