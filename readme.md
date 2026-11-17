# Big Trip

## Description

The travel planning app

## [Demo](https://big-trip-rz0rs-projects.vercel.app/)

## Tech stack:

- JavaScript
- Webpack
- Pattern MVP
- Pattern Observer
- Pattern Adapter
- Fetch API (Method get and post)
- Chart.js (statistics)
- Flatpickr (calendar)
- Dayjs

## Development

Use Node.js 24 LTS (`nvm use`; Node.js 22.15+ is also supported).

```sh
npm ci
npm test
npm run build
npm start
```

The development server serves `public/` on localhost. Run `npm audit` to check
both application and development dependencies against current advisories.

## Demo data

The demo loads JSON from `/data/` and photos from `/img/photos/` on the site's
own domain. It does not depend on the external teaching API or external image
hosts. A fresh demo contains eight sample events dated around the current day.

Adding, editing, favouriting and deleting events are saved in this browser's
localStorage, without a shared server database. Clear the `big-trip.demo.points.v1`
key in browser storage to restore the sample trip. If browser storage is disabled,
changes last for the current session only.
