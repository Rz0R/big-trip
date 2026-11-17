import DemoApiService from './demo-api-service';

import HeaderPresenter from './presenter/header-presenter';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import MenuPresenter from './presenter/menu-presenter';

import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';

const apiService = new DemoApiService('/data');

const pointsModel = new PointsModel(apiService);

const filterModel = new FilterModel();

const siteTripMainElement = document.querySelector('.trip-main');
const headerPresenter = new HeaderPresenter(siteTripMainElement, pointsModel);

headerPresenter.init();

const siteTripFiltersElement = siteTripMainElement.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter(siteTripFiltersElement, pointsModel, filterModel);

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
disableCreateButton(true);

const siteTripMenuElement = siteTripMainElement.querySelector('.trip-controls__navigation');
const menuPresenter = new MenuPresenter(siteTripMenuElement, siteTripEventsElement, tripPresenter, filterPresenter, disableCreateButton, pointsModel);

pointsModel.init().finally(() => {
  filterPresenter.init();
  menuPresenter.init();
  disableCreateButton(Boolean(pointsModel.error));
});


