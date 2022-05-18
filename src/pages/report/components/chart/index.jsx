import React from 'react';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import './index.less';

export default function Chart() {
  return (
    <>
      <div className="chart-background">
        <LineChart />
      </div>
      <div className="chart-background">
        <PieChart />
      </div>
      <div className="chart-background">
        <BarChart />
      </div>
    </>
  );
}
