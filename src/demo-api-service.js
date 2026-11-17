const STORAGE_KEY = 'big-trip.demo.points.v1';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const copy = (value) => JSON.parse(JSON.stringify(value));

const isPoint = (point) => point && typeof point.id === 'string'
  && typeof point.type === 'string' && Number.isFinite(point.base_price)
  && Number.isFinite(Date.parse(point.date_from)) && Number.isFinite(Date.parse(point.date_to))
  && typeof point.destination?.name === 'string' && Array.isArray(point.destination.pictures)
  && Array.isArray(point.offers);

class DemoApiService {
  #endPoint = null;
  #storage = null;
  #points = null;
  #loadPromise = null;

  constructor(endPoint = '/data', storage) {
    this.#endPoint = endPoint;
    try {
      this.#storage = storage === undefined ? window.localStorage : storage;
    } catch {
      // Browsers that disable storage can still use the demo for this session.
      this.#storage = null;
    }
  }

  get points() {
    return this.#ensurePoints().then(() => copy(this.#points));
  }

  get destinations() {
    return this.#load('destinations');
  }

  get offers() {
    return this.#load('offers');
  }

  addPoint = async (point) => {
    await this.#ensurePoints();
    const created = this.#adaptToServer({ ...point, id: crypto.randomUUID() });
    this.#save([created, ...this.#points]);
    return copy(created);
  }

  updatePoint = async (point) => {
    await this.#ensurePoints();
    const index = this.#findPoint(point.id);
    const updated = this.#adaptToServer(point);
    const points = [...this.#points];
    points[index] = updated;
    this.#save(points);
    return copy(updated);
  }

  deletePoint = async (point) => {
    await this.#ensurePoints();
    this.#findPoint(point.id);
    this.#save(this.#points.filter((item) => item.id !== point.id));
  }

  #load = async (resource) => {
    const response = await fetch(`${this.#endPoint}/${resource}.json`, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
      throw new Error(`Cannot load ${resource}: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error(`Invalid ${resource} data`);
    }
    return data;
  }

  #ensurePoints = async () => {
    if (!this.#loadPromise) {
      this.#loadPromise = this.#restorePoints().catch((error) => {
        this.#loadPromise = null;
        throw error;
      });
    }
    await this.#loadPromise;
  }

  #restorePoints = async () => {
    try {
      const stored = this.#storage?.getItem(STORAGE_KEY);
      if (stored !== null && stored !== undefined) {
        const storedPoints = JSON.parse(stored);
        if (Array.isArray(storedPoints) && storedPoints.every(isPoint)) {
          this.#points = storedPoints;
          return;
        }
      }
    } catch {
      // Ignore corrupt or inaccessible browser storage and load the demo data.
    }
    const points = await this.#load('points');
    if (!points.length || !points.every(isPoint)) {
      throw new Error('Invalid demo points');
    }
    // Keep both past and upcoming events in a fresh demo, regardless of visit date.
    const firstDate = Math.min(...points.map((point) => Date.parse(point.date_from)));
    const shift = Math.floor(Date.now() / DAY_IN_MS) * DAY_IN_MS - DAY_IN_MS
      - Math.floor(firstDate / DAY_IN_MS) * DAY_IN_MS;
    this.#points = points.map((point) => ({
      ...point,
      'date_from': new Date(Date.parse(point.date_from) + shift).toISOString(),
      'date_to': new Date(Date.parse(point.date_to) + shift).toISOString()
    }));
  }

  #save = (points) => {
    if (!points.every(isPoint)) {
      throw new Error('Invalid point');
    }
    const saved = copy(points);
    this.#storage?.setItem(STORAGE_KEY, JSON.stringify(saved));
    this.#points = saved;
  }

  #findPoint = (id) => {
    const index = this.#points.findIndex((point) => point.id === id);
    if (index === -1) {
      throw new Error('Point not found');
    }
    return index;
  }

  #adaptToServer = (point) => ({
    id: point.id,
    type: point.type,
    destination: copy(point.destination),
    offers: copy(point.offers),
    'base_price': point.basePrice,
    'date_from': point.dateFrom,
    'date_to': point.dateTo,
    'is_favorite': point.isFavorite
  });
}

export default DemoApiService;
