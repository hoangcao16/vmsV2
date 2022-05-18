import React, { Suspense, useEffect, useState } from 'react';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import './index.less';
import { useHistory } from 'react-router-dom';

export default function Chart() {
  const [currentPathIsReport, setCurrentPathIsReport] = useState(false);
  let url = useHistory();

  useEffect(() => {
    if (url.location.pathname == '/report') {
      setCurrentPathIsReport(true);
    }
  });
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
      {currentPathIsReport ? (
        <div className="chart-background">
          <Suspense fallback={null}>
            <BarChart />
          </Suspense>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
