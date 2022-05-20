import React from 'react';
import CameraStatistics from './components/CameraStatistics';
import Chart from './components/Chart';
import { Row, Col } from 'antd';
import ChartControl from './components/ChartControl';

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
    <div className="report">
      <Row gutter={24}>
        {/* <Col {...chartCol}>
          <CameraStatistics />
          <Chart />
        </Col>
        <Col {...controlCol}>
          <div className="chartControl">
            <ChartControl />
          </div>
        </Col> */}
      </Row>
    </div>
  );
}
