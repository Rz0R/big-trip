class AbstractObservable {
  #observers = new Set();

  addOservers = (observer) => {
    this.#observers.add(observer);
  }

  removeObservers = (observer) => {
    this.#observers.delete(observer);
  }

  _notify = (evt, payload) => {
    this.#observers.forEach((observer) => observer(evt, payload));
  }
}

export default AbstractObservable;
