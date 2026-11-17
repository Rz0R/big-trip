import AbstractView from './abstract-view';

class LoadingErrorView extends AbstractView {
  get template() {
    return `<p class="trip-events__msg" role="alert">
      Unable to load trip data. Please <a href="/">reload the page</a> to try again.
    </p>`;
  }
}

export default LoadingErrorView;
