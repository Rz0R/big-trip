import { isPointFuture, isPointPast } from '../utils/fiter';

const taskToFilterMap = {
  everything: (points) => points.length,
  future: (points) => points.filter((point) => isPointFuture(point.dateFrom)).length,
  past: (points) => points.filter((point) => isPointPast(point.dateFrom)).length
};

const generateFilter = (points) => Object.entries(taskToFilterMap)
  .map(([filterName, countPoints]) => ({
    name: filterName,
    count: countPoints(points)
  }));

export { generateFilter };
