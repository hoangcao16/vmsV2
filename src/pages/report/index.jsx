import React from 'react';
import CameraStatistics from './components/cameraStatistics';
import Chart from './components/chart';
import { Row, Col } from 'antd';

const chartCol = {
  xs: 19,
  sm: 19,
  md: 19,
  lg: 19,
  xl: 19,
  style: {
    marginBottom: 24,
  },
};

const controlCol = {
  xs: 5,
  sm: 5,
  md: 5,
  lg: 5,
  xl: 5,
  style: {
    marginBottom: 24,
  },
};

export default function Report() {
  return (
    <>
      <Row gutter={24}>
        <Col {...chartCol}>
          <CameraStatistics />
          <Chart />
        </Col>
        <Col {...controlCol}>
          <div className="chartControl">Chart Control</div>
        </Col>
      </Row>
    </>
  );
}
