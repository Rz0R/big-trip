import AbstractView from "./abstract-view";

const createListsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class ListView extends AbstractView {

  get template() {
    return createListsTemplate();
  }

}

export default ListView;
