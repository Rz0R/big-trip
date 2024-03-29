import dayjs from 'dayjs';
import { FilterType } from '../const';

export const isPointFuture = (date) => dayjs(date).isAfter(dayjs(), 'minute');

export const isPointPast = (date) => dayjs(date).isBefore(dayjs(), 'minute');

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateFrom))
};
