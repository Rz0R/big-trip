import { render, replace } from "../render";
import ListView from "../view/list-view";
import SortView from "../view/sort-view";

import PointView from "../view/point-view";
import EditPointView from "../view/edit-point-view";

const renderPoint = (taskListElement, point) => {
  const pointComponent = new PointView(point);
  const editPointComponent = new EditPointView(point);

  const replaceEventToForm = () => {
    replace(editPointComponent.element, pointComponent.element);
  };

  const replaceFormToEvent = () => {
    replace(pointComponent.element, editPointComponent.element);
  };

  pointComponent.setPointEditClickHandler(replaceEventToForm);

  editPointComponent.setFormSubmitHandler(replaceFormToEvent);
  editPointComponent.setFormResetHandler(replaceFormToEvent);

  render(taskListElement, pointComponent.element);
};

class TripPresenter {

  #taskListContainter = null;
  #points = null;
  #sortComponent = new SortView();
  #listComponent = new ListView();

  constructor(taskListContainter) {
    this.#taskListContainter = taskListContainter;
  }

  init = (points) => {
    this.#points = [...points];
    render(this.#taskListContainter, this.#sortComponent.element);
    render(this.#taskListContainter, this.#listComponent.element);

    this.#points.forEach((point) => renderPoint(this.#listComponent.element, point));
  }

}

export default TripPresenter;
