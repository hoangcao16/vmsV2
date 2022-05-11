import React, { Suspense } from 'react';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import './index.less';

export default function Chart() {
  return (
    <>
      <div className="chart-background">
        <Suspense fallback={null}>
          <LineChart />
        </Suspense>
      </div>
      <div className="chart-background">
        <Suspense fallback={null}>
          <PieChart />
        </Suspense>
      </div>
      <div className="chart-background">
        <Suspense fallback={null}>
          <BarChart />
        </Suspense>
      </div>
    </>
  );
}
