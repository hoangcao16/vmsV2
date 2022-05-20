import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';

const BarChart = () => {
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
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    legend: {
      position: 'bottom',
    },
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  return <Column {...config} />;
};

export default BarChart;
