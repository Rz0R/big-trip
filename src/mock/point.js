import dayjs from 'dayjs';
import { getRandomInteger } from '../utils';

const generateRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

const generateType = () => {
  const types = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
  const randomIndex = getRandomInteger(0, types.length - 1);
  return types[randomIndex];
};

const generateCity = () => {
  const cities = ['Moscow', 'Amsterdam', 'Chamonix', 'Geneva', 'Helsinki', 'Kopenhagen', 'Rome'];
  const randomIndex = getRandomInteger(0, cities.length - 1);
  return cities[randomIndex];
};

const generateOffers = () => {
  const offers = [
    {
      title: 'Order Uber',
      price: '20'
    },
    {
      title: 'Add breakfast',
      price: '50'
    },
    {
      title: 'Upgrade to a business class',
      price: '190'
    },
    {
      title: 'Choose the radio station',
      price: '30'
    },
    {
      title: 'Drive slowly',
      price: '110'
    }
  ];

  const res = new Set();

  for (let i = 0; i < offers.length; i++) {
    const randomIndex = getRandomInteger(0, offers.length - 1);
    res.add(offers[randomIndex]);
  }

  return [...res];
};

export const generatePoint = () => {

  const dateFrom = generateRandomDate(new Date(), dayjs().add(5, 'day').toDate());
  const dateTo = generateRandomDate(dayjs(dateFrom).toDate(), dayjs(dateFrom).add(5, 'day').toDate());

  const type = generateType();
  const city = generateCity();

  const offers = generateOffers();

  const isFavorite = Boolean(Math.random() > 0.5);
  const basePrice = getRandomInteger(1, 10) * 10;

  return {
    type,
    city,
    offers,
    dateFrom,
    dateTo,
    isFavorite,
    basePrice
  };
};
