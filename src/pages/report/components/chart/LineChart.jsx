import React from 'react';
import { Line } from '@ant-design/plots';

const LineChart = () => {
  const data = [
    { date: 2020, value: 100, type: 'A' },
    { date: 2020, value: 200, type: 'B' },
    { date: 2020, value: 300, type: 'C' },
    { date: 2021, value: 200, type: 'A' },
    { date: 2021, value: 400, type: 'B' },
    { date: 2021, value: 600, type: 'C' },
    { date: 2022, value: 200, type: 'A' },
    { date: 2022, value: 400, type: 'B' },
    { date: 2022, value: 600, type: 'C' },
    { date: 2023, value: 200, type: 'A' },
    { date: 2023, value: 400, type: 'B' },
    { date: 2023, value: 600, type: 'C' },
    { date: 2024, value: 200, type: 'A' },
    { date: 2024, value: 400, type: 'B' },
    { date: 2024, value: 600, type: 'C' },
    { date: 2025, value: 200, type: 'A' },
    { date: 2025, value: 400, type: 'B' },
    { date: 2025, value: 600, type: 'C' },
  ];
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      label: {
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: {
      position: 'bottom',
    },
    smooth: true,
    color: ['#1979C9', '#D62A0D', '#FAA219'],
  };

  return <Line {...config} />;
};

export default LineChart;
