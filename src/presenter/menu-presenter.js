import { MenuItem } from '../const';
import { render, remove } from '../utils/render';
import MenuView from '../view/menu-view';


class MenuPresenter {
  #menuContainer = null;
  #currentMenuItem = MenuItem.TABLE;
  #menuComponent = null;

  constructor(menuContainer) {
    this.#menuContainer = menuContainer;

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

  #handleMenuItemChange = (menuItem) => {
    if (menuItem === this.#currentMenuItem) {
      return;
    }

    this.#currentMenuItem = menuItem;
    this.#removeMenu();
    this.#renderMenu(this.#currentMenuItem);
  }

}

export default MenuPresenter;
