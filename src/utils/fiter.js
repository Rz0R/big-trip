import dayjs from 'dayjs';

export const isPointFuture = (date) => dayjs(date).isAfter(dayjs(), 'minute');

export const isPointPast = (date) => dayjs(date).isBefore(dayjs(), 'minute');


