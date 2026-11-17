import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { afterEach, mock, test } from 'node:test';
import DemoApiService from '../src/demo-api-service.js';

const data = {};
for (const resource of ['points', 'destinations', 'offers']) {
  data[resource] = JSON.parse(await readFile(new URL(`../public/data/${resource}.json`, import.meta.url)));
}

const storage = () => {
  const items = new Map();
  return {
    getItem: (key) => items.has(key) ? items.get(key) : null,
    setItem: (key, value) => items.set(key, value)
  };
};

const serveData = () => mock.method(globalThis, 'fetch', async (url) => {
  assert.match(url, /^\/data\/(points|destinations|offers)\.json$/);
  return { ok: true, json: async () => structuredClone(data[url.split('/').pop().split('.')[0]]) };
});

const toClient = (point) => ({
  ...point,
  basePrice: point.base_price,
  dateFrom: point.date_from,
  dateTo: point.date_to,
  isFavorite: point.is_favorite
});

afterEach(() => mock.restoreAll());

test('demo loads same-origin JSON, with usable offers, destinations and local photographs', async () => {
  const fetchMock = serveData();
  const api = new DemoApiService('/data', null);
  const [points, destinations, offers] = await Promise.all([api.points, api.destinations, api.offers]);
  assert.equal(fetchMock.mock.callCount(), 3);
  assert.ok(points.length > 0);
  assert.ok(Date.parse(points[0].date_from) < Date.now());
  assert.ok(points.some((point) => Date.parse(point.date_from) > Date.now()));
  for (const point of points) {
    assert.ok(destinations.some((item) => item.name === point.destination.name));
    assert.ok(offers.some((item) => item.type === point.type));
  }
  for (const destination of destinations) {
    for (const picture of destination.pictures) {
      assert.match(picture.src, /^\/img\/photos\/[1-5]\.jpg$/);
      const bytes = await readFile(new URL(`../public${picture.src}`, import.meta.url));
      assert.ok(bytes.length > 1000);
      assert.equal(bytes[0], 0xff);
      assert.equal(bytes[1], 0xd8);
    }
  }
});

test('create, edit, favourite and delete survive a fresh service instance without network writes', async () => {
  const fetchMock = serveData();
  const saved = storage();
  let api = new DemoApiService('/data', saved);
  const initial = await api.points;
  const created = await api.addPoint(toClient(initial[0]));
  assert.ok(created.id);
  assert.notEqual(created.id, initial[0].id);
  api = new DemoApiService('/data', saved);
  assert.equal((await api.points).length, initial.length + 1);
  const updated = await api.updatePoint({ ...toClient(created), basePrice: 1234, isFavorite: true });
  assert.equal(updated.base_price, 1234);
  assert.equal(updated.is_favorite, true);
  api = new DemoApiService('/data', saved);
  assert.equal((await api.points).find((point) => point.id === created.id).base_price, 1234);
  await api.deletePoint(created);
  api = new DemoApiService('/data', saved);
  assert.ok(!(await api.points).some((point) => point.id === created.id));
  assert.equal(fetchMock.mock.callCount(), 1);
});

test('deleting every event preserves the empty trip rather than restoring samples', async () => {
  serveData();
  const saved = storage();
  const api = new DemoApiService('/data', saved);
  for (const point of await api.points) {
    await api.deletePoint(point);
  }
  assert.deepEqual(await new DemoApiService('/data', saved).points, []);
});

test('corrupt browser storage falls back to sample data', async () => {
  serveData();
  const saved = { getItem: () => '{broken JSON', setItem: () => {} };
  assert.equal((await new DemoApiService('/data', saved).points).length, data.points.length);
});

test('failed or invalid JSON requests reject and a later request can retry', async () => {
  const response = { ok: false, status: 503, json: async () => ({}) };
  mock.method(globalThis, 'fetch', async () => response);
  const api = new DemoApiService('/data', null);
  await assert.rejects(api.points, /503/);
  response.ok = true;
  await assert.rejects(api.points, /Invalid points/);
  response.json = async () => structuredClone(data.points);
  assert.equal((await api.points).length, data.points.length);
});

test('failed persistence leaves previously saved points unchanged', async () => {
  serveData();
  const saved = storage();
  const api = new DemoApiService('/data', saved);
  const points = await api.points;
  saved.setItem = () => { throw new Error('Storage is full'); };
  await assert.rejects(api.updatePoint({ ...toClient(points[0]), basePrice: 9999 }), /Storage is full/);
  assert.equal((await api.points)[0].base_price, points[0].base_price);
});
