import SmartView from './smart-view';

import { cloneDeep } from '../utils/common';

import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

import dayjs from 'dayjs';

const createOfferMarkup = (title, price, id, isChecked, isDisabled) => (
  `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox
      visually-hidden"
      id="event-offer-${id}" type="checkbox"
      name="event-offer-${id}"
      data-id="${id}"
      ${isChecked ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="event__offer-label" for="event-offer-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`);

const createTypeItemMarkup = (type, isDisabled) => (
  `<div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input
      visually-hidden" type="radio"
      name="event-type"
      value="${type}"
      ${isDisabled ? 'disabled' : ''}
    >
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`
);

const createCityOptionMarup = (city) => (
  `<option value="${city}"></option>`
);

const createTypeListMarkup = (types, isDisabled) => {
  const typeEls = types.map((type) => createTypeItemMarkup(type, isDisabled)).join('\n');

  return (
    `<div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${typeEls}
        </fieldset>
      </div>
    </div>`
  );
};

const createPhotoMarkup = ({ src, description }) => (
  `<img class="event__photo" src="${src}" alt="${description}">`
);

const creatEditPointTemplate = (data, destinations, allOffers) => {

  const { type, dateFrom, dateTo, offers, destination: { name: city, description, pictures }, basePrice, isDisabled, isSaving, isDeleting } = data;

  const offerElsMarkup = allOffers.find((item) => item.type === type)
    .offers
    .map(({ title, price, id }) => {
      const checked = offers.some((offer) => offer.id === id);
      return createOfferMarkup(title, price, id, checked, isDisabled);
    })
    .join('\n');

  const photoEls = pictures.map((picture) => createPhotoMarkup(picture)).join('\n');

  const allTypes = allOffers.map((item) => item.type);
  const typeListMarkup = createTypeListMarkup(allTypes, isDisabled);

  const allCities = destinations.map((item) => item.name);
  const cityOptionsMarkup = allCities.map((name) => createCityOptionMarup(name)).join('\n');

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            ${typeListMarkup}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input
              class="event__input
              event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${city}"
              list="destination-list-1"
              ${isDisabled ? 'disabled' : ''}
            >
            <datalist id="destination-list-1">
              ${cityOptionsMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input
              event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dayjs(dateFrom).format('DD/MM/YYYY HH:mm')}"
              ${isDisabled ? 'disabled' : ''}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input
              event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${dayjs(dateTo).format('DD/MM/YYYY HH:mm')}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-1"
              type="number"
              min="0"
              step="100"
              name="event-price"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offerElsMarkup}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photoEls}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
};

class EditPointView extends SmartView {

  #datepickerFrom = null;
  #datepickerTo = null;

  #destinations = null;
  #allOffers = null;

  constructor(point, destinations, allOffers) {
    super();
    this._data = EditPointView.parsePointToData(point);
    this.#destinations = destinations;
    this.#allOffers = allOffers;

    this.#setInnerHandlers();
  }

  get template() {
    return creatEditPointTemplate(this._data, this.#destinations, this.#allOffers);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom || this.#datepickerTo) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset = (point) => {
    this.updateData(EditPointView.parsePointToData(point));
  }

  #setInnerHandlers = () => {
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#cityChangeHadler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('form').addEventListener('reset', this.#formDeletetHandler);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseDataToPoint(this._data));
  }

  setFormDeleteHandler = (callback) => {
    this._callback.formDelete = callback;
    this.element.querySelector('form').addEventListener('reset', this.#formDeletetHandler);
  }

  #formDeletetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formDelete(EditPointView.parseDataToPoint(this._data));
  }

  #cityChangeHadler = (evt) => {
    evt.preventDefault();
    const city = evt.target.value;
    const destination = this.#destinations.find((item) => item.name === city);
    if (city && destination) {
      this.updateData({
        destination
      });
    } else {
      evt.target.setCustomValidity('There is no such city in the list');
    }
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: []
    });
  }

  #setDatepickerFrom = () => {
    this.#validateDate();
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        allowInput: true,
        defaultDate: dayjs(this._data.dateFrom).format('DD/MM/YYYY HH:mm'),
        onClose: this.#updateFromDate
      },
    );
  }

  #updateFromDate = ([userDate]) => {
    this.updateData({
      dateFrom: userDate.toISOString()
    });
  }

  #setDatepickerTo = () => {
    this.#validateDate();
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        allowInput: true,
        defaultDate: dayjs(this._data.dateTo).format('DD/MM/YYYY HH:mm'),
        onClose: this.#updateToDate
      },
    );
  }

  #updateToDate = ([userDate]) => {
    this.updateData({
      dateTo: userDate.toISOString()
    });
  }

  #validateDate = () => {
    if (dayjs(this._data.dateTo).diff(dayjs(this._data.dateFrom)) <= 0) {
      this.element.querySelector('#event-start-time-1').setCustomValidity('Change the time. The start of the trip cannot be later than the end!');
    } else {
      this.element.querySelector('#event-start-time-1').setCustomValidity('');
    }
  }

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = Number(evt.target.dataset.id);
    if (evt.target.checked) {
      const newOffer = this.#allOffers
        .find((item) => item.type === this._data.type)
        .offers
        .find((item) => item.id === offerId);
      this.updateData({
        offers: [
          ...this._data.offers,
          newOffer
        ]
      });
    } else {
      const updatedOffers = this._data.offers.filter((item) => item.id !== offerId);
      this.updateData({
        offers: updatedOffers
      });
    }
  }

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      basePrice: Number(evt.target.value)
    });
  }

  static parsePointToData = (point) => {
    const data = cloneDeep(point);

    data.isDisabled = false;
    data.isSaving = false;
    data.isDeleting = false;

    return data;
  }

  static parseDataToPoint = (data) => {
    const point = cloneDeep(data);

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

}

export default EditPointView;
