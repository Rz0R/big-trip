import { MenuItem, RenderPosition } from '../const';
import { render, remove } from '../utils/render';
import MenuView from '../view/menu-view';
import StatsView from '../view/stats-view';

class MenuPresenter {
  #menuContainer = null;
  #tableContainer = null;

  #currentMenuItem = MenuItem.TABLE;
  #menuComponent = null;
  #statsComponent = null;

  #tripPresenter = null;
  #filterPresenter = null;

  #disableNewPointBtn = {};

  #pointsModel = null;

  constructor(menuContainer, tableContainer, tripPresenter, filterPresenter, disableNewPointBtn, pointsModel) {
    this.#menuContainer = menuContainer;
    this.#tripPresenter = tripPresenter;
    this.#tableContainer = tableContainer;
    this.#filterPresenter = filterPresenter;
    this.#disableNewPointBtn = disableNewPointBtn;
    this.#pointsModel = pointsModel;

    this.#menuComponent = new MenuView(this.#currentMenuItem);
  }

  init = () => {
    this.#renderMenu();
    this.#menuComponent.setMenuClickHandler(this.#handleMenuItemChange);
  }

  #renderMenu = () => {
    render(this.#menuContainer, this.#menuComponent);
    this.#menuComponent.setMenuClickHandler(this.#handleMenuItemChange);
  }

  #removeMenu = () => {
    remove(this.#menuComponent);
  }

  #renderStats = () => {
    this.#statsComponent = new StatsView(this.#pointsModel.points);
    render(this.#tableContainer, this.#statsComponent, RenderPosition.AFTEREND);
  }

  #removeStats = () => {
    remove(this.#statsComponent);
  }

  #handleMenuItemChange = (menuItem) => {
    if (menuItem === this.#currentMenuItem) {
      return;
    }

    this.#currentMenuItem = menuItem;
    this.#removeMenu();
    this.#renderMenu(this.#currentMenuItem);

    switch (menuItem) {
      case MenuItem.TABLE:
        this.#removeStats();
        this.#filterPresenter.disabled = false;
        this.#disableNewPointBtn(false);
        this.#tripPresenter.init();
        break;
      case MenuItem.STATS:
        this.#tripPresenter.destroy();
        this.#filterPresenter.disabled = true;
        this.#disableNewPointBtn(true);
        this.#renderStats();
        break;
    }
  }
}

export default MenuPresenter;
