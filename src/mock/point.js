import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { getRandomInteger } from '../utils/common';

import { cities } from './cities';
import { offers as allOffers } from './offers';

const allCities = cities.map((item) => item.name);
const allTypes = allOffers.map((item) => item.type);

const generateRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

const generateType = () => {
  const randomIndex = getRandomInteger(0, allTypes.length - 1);
  return allTypes[randomIndex];
};

const generateCity = () => {
  const randomIndex = getRandomInteger(0, allCities.length - 1);
  return allCities[randomIndex];
};

const generateOffers = (type) => allOffers.find((item) => item.type === type).offers;

const generateDestination = (city) => cities.find((destination) => destination.name === city);

export const generatePoint = () => {

  const id = nanoid();

  const dateFrom = generateRandomDate(dayjs().subtract(3, 'day').toDate(), dayjs().add(3, 'day').toDate());
  const dateTo = generateRandomDate(dayjs(dateFrom).toDate(), dayjs(dateFrom).add(5, 'day').toDate());

  const type = generateType();
  const city = generateCity();

  const offers = generateOffers(type);

  const isFavorite = Boolean(Math.random() > 0.5);
  const basePrice = getRandomInteger(1, 10) * 100;

  const destination = generateDestination(city);

  return {
    id,
    type,
    offers,
    dateFrom,
    dateTo,
    isFavorite,
    basePrice,
    destination
  };
};
