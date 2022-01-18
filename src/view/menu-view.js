import AbstractView from './abstract-view';
import { MenuItem } from '../const';

const createMenuTemplate = (menuItem) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  ${menuItem === MenuItem.TABLE ? 'trip-tabs__btn--active' : ''}" data-menu-item=${MenuItem.TABLE} href="#">Table</a>
    <a class="trip-tabs__btn ${menuItem === MenuItem.STATS ? 'trip-tabs__btn--active' : ''}" data-menu-item=${MenuItem.STATS} href="#">Stats</a>
  </nav>`
);

class MenuView extends AbstractView {

  #currentMenuItem = MenuItem.TABLE;

  constructor(currentMenuItem) {
    super();
    this.#currentMenuItem = currentMenuItem;
  }

  get template() {
    return createMenuTemplate(this.#currentMenuItem);
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuChangeHandler);
  }

  #menuChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }

    this.#currentMenuItem = evt.target.dataset.menuItem;
    this._callback.menuClick(this.#currentMenuItem);
  }

}

export default MenuView;
