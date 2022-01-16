import SmartView from './smart-view';

import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

import dayjs from 'dayjs';
import { getRandomInteger } from '../utils/common';
import { TYPES } from '../const';

const DEFAULT_POINT = {
  type: 'taxi',
  dateFrom: dayjs().add(1, 'hour'),
  dateTo: dayjs().add(2, 'hour'),
  offers: [
    {
      title: 'Order Uber',
      price: '20'
    },
    {
      title: 'Add breakfast',
      price: '50'
    }
  ],
  city: 'Moscow',
  basePrice: 100,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  photos: []
};

const createOfferMarkup = (title, price, ind, isChecked = false) => {

  // Нужно придумать нормальную идентификацию
  const id = getRandomInteger(1, 10000);

  return (
    `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox
      visually-hidden"
      id="event-offer-${id}-${ind}" type="checkbox"
      name="event-offer-${id}"
      ${isChecked ? 'checked' : ''}
    >
    <label class="event__offer-label" for="event-offer-${id}-${ind}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>`);
};

const createTypeItemMarkup = (type) => (
  `<div class="event__type-item">
    <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`
);

const createTypeListMarkup = () => {
  const typeEls = TYPES.map((type) => createTypeItemMarkup(type)).join('\n');

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

const createPhotoMarkup = (url) => (
  `<img class="event__photo" src="${url}" alt="Event photo">`
);

const creatEditPointTemplate = ({ type, dateFrom, dateTo, offers, city, basePrice, description, photos }) => {

  const offerEls = offers.map((offer, ind) => {
    const { title, price } = offer;
    return createOfferMarkup(title, price, ind, Math.random() > 0.5);
  }).join('\n');

  const photoEls = photos.map((url) => createPhotoMarkup(url)).join('\n');

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

            ${createTypeListMarkup()}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YYYY HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YYYY HH:mm')}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offerEls}
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

  constructor(point = DEFAULT_POINT) {
    super();
    this._data = { ...point };
    this.#setInnerHandlers();
  }

  get template() {
    return creatEditPointTemplate(this._data);
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

  #setInnerHandlers = () => {
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#cityChangeHadler);
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
    this._callback.formSubmit({ ...this._data });
  }

  setFormDeleteHandler = (callback) => {
    this._callback.formDelete = callback;
    this.element.querySelector('form').addEventListener('reset', this.#formDeletetHandler);
  }

  #formDeletetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formDelete({ ...this._data });
  }

  #cityChangeHadler = (evt) => {
    evt.preventDefault();
    this.updateData({
      city: evt.target.value
    });
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value
    });
  }

  #setDatepickerFrom = () => {
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

}

export default EditPointView;
