import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';
import ChartHeader from './ChartHeader';
import { Divider } from 'antd';
import { useIntl } from 'umi';

const PieChart = () => {
  const intl = useIntl();
  const data = [
    {
      type: 'AAAAAAAAAAAAA AAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAA',
      value: 27,
    },
    {
      type: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB BBBBBBBBBBBBBB',
      value: 25,
    },
    {
      type: 'CCCCCCCCCCCCC CCCCCCCCCCCCCCCCCCCCCCCCCCC CCCCC',
      value: 18,
    },
    {
      type: 'DDDDDDDDDDDDDDDDDDDDDD DDDDDDDDDDDDDDDDDDDDDDDDDDD',
      value: 15,
    },
    {
      type: 'EEEEEEEEEEE EEEEEEE EEEEEEEEEEE EEEEEEEEE EEEEE',
      value: 10,
    },
    {
      type: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
      value: 5,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{value}',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <>
      <ChartHeader
        title={intl.formatMessage({
          id: `pages.report.chart.pieTitle`,
          defaultMessage: 'name',
        })}
      />
      <Divider />
      <Pie {...config} />
    </>
  );
};

export default PieChart;
