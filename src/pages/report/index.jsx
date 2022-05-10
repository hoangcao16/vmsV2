import React, { Suspense } from 'react';
import PageLoading from '../dashboard/analysis/components/PageLoading';
import CameraStatistics from './components/cameraStatistics';
import Chart from './components/chart';
import LineChart from './components/chart/LineChart';

export default function Report() {
  return (
    <>
      <Suspense fallback={<PageLoading />}>
        <CameraStatistics />
      </Suspense>
      <Chart />
    </>
  );
}
