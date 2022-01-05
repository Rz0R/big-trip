import dayjs from 'dayjs';
import { TimeForFormat } from './const';

export const formatDuration = (minutes) => {
  const TWO_DIGITS = 2;

  const result = [];

  let dd = Math.floor(minutes / (TimeForFormat.DAY));
  if (dd) {
    dd = dd.length < TWO_DIGITS ? `0${dd}` : dd;
    result.push(`${dd}D`);
  }

  let hh = Math.floor((minutes % (TimeForFormat.DAY)) / TimeForFormat.HOUR);
  if (hh) {
    hh = `0${hh}`.slice(-TWO_DIGITS);
    result.push(`${hh}H`);
  }

  let mm = minutes % TimeForFormat.HOUR;
  mm = `0${mm}`.slice(-TWO_DIGITS);
  result.push(`${mm}M`);

  return result.join(' ');
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getDuration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
