import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view';

import { getDuration, formatDuration } from '../utils/common';

const getChartData = (points) => {
  const types = [...new Set(points.map((point) => point.type))];
  const chartData = types.map((type) => {
    const money = points.reduce((sum, point) => point.type === type ? sum + point.basePrice : sum, 0);
    const typeCount = points.reduce((count, point) => point.type === type ? count + 1 : count, 0);
    const time = points.reduce((duration, point) => point.type === type ? duration + getDuration(point.dateFrom, point.dateTo) : duration, 0);
    return {
      type: type.toUpperCase(),
      money,
      typeCount,
      time
    };
  });
  return chartData;
};

const renderMoneyChart = (moneyCtx, chartData) => {
  chartData.sort((a, b) => b.money - a.money);
  const labels = chartData.map((item) => item.type);
  const money = chartData.map((item) => item.money);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: money,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start'
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left'
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });

};

const renderTypeChart = (typeCtx, chartData) => {

  chartData.sort((a, b) => b.typeCount - a.typeCount);
  const labels = chartData.map((item) => item.type);
  const data = chartData.map((item) => item.typeCount);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start'
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left'
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpendChart = (timeSpend, chartData) => {

  chartData.sort((a, b) => b.time - a.time);
  const labels = chartData.map((item) => item.type);
  const data = chartData.map((item) => item.time);

  return new Chart(timeSpend, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start'
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${formatDuration(val)}`
        }
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left'
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};


const createStatsTemplate = () => (
  `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
);

class StatsView extends SmartView {

  constructor(points) {
    super();
    this._data = points;

    this.#setCharts();
  }

  get template() {
    return createStatsTemplate();
  }

  #setCharts = () => {
    const chartData = getChartData(this._data);
    const CHART_LINE_COUNT = chartData.length;

    const moneyCtx = this.element.querySelector('.statistics__chart--money');
    const transportCtx = this.element.querySelector('.statistics__chart--transport');
    const timeSpendCtx = this.element.querySelector('.statistics__chart--time');
    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * CHART_LINE_COUNT;
    transportCtx.height = BAR_HEIGHT * CHART_LINE_COUNT;
    timeSpendCtx.height = BAR_HEIGHT * CHART_LINE_COUNT;

    renderMoneyChart(moneyCtx, [...chartData]);
    renderTypeChart(transportCtx, [...chartData]);
    renderTimeSpendChart(timeSpendCtx, [...chartData]);
  }

}

export default StatsView;
