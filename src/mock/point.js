import dayjs from 'dayjs';
import { getRandomInteger } from '../utils';
import { CITIES } from '../const';
import { TYPES } from '../const';

const generateRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

const generateType = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);
  return TYPES[randomIndex];
};

const generateCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);
  return CITIES[randomIndex];
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

  const maxOffers = getRandomInteger(1, offers.length);

  for (let i = 0; i < maxOffers; i++) {
    const randomIndex = getRandomInteger(0, offers.length - 1);
    res.add(offers[randomIndex]);
  }

  return [...res];
};

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
  ];
  const randomIndex = getRandomInteger(0, descriptions.length - 1);
  return descriptions[randomIndex];
}

const generatePhotos = () => {
  const photoAmount = getRandomInteger(1, 5);
  const photos = [];
  for (let i = 0; i < photoAmount; i++) {
    const url = `http://picsum.photos/248/152?r=${Math.random()}`;
    photos.push(url);
  }
  return photos;
}

export const generatePoint = () => {

  const dateFrom = generateRandomDate(new Date(), dayjs().add(5, 'day').toDate());
  const dateTo = generateRandomDate(dayjs(dateFrom).toDate(), dayjs(dateFrom).add(5, 'day').toDate());

  const type = generateType();
  const city = generateCity();

  const offers = generateOffers();

  const isFavorite = Boolean(Math.random() > 0.5);
  const basePrice = getRandomInteger(1, 10) * 10;

  const description = generateDescription();
  const photos = generatePhotos();

  return {
    type,
    city,
    offers,
    dateFrom,
    dateTo,
    isFavorite,
    basePrice,
    description,
    photos
  };
};
