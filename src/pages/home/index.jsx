import React from 'react';
import { Row, Col } from 'antd';
import Notification from './Notification';
import './Home.less';
import LineChart from '../report/components/Chart/LineChart';
import PieChart from '../report/components/Chart/PieChart';
import CameraStatistics from '../report/components/CameraStatistics';

const reportCol = {
  xs: 24,
  sm: 19,
  md: 19,
  lg: 19,
  xl: 19,
  style: {
    marginBottom: 24,
  },
};

const notiCol = {
  xs: 0,
  sm: 5,
  md: 5,
  lg: 5,
  xl: 5,
  style: {
    marginBottom: 24,
  },
};

export default function index() {
  return (
    <div className="home">
      <Row gutter={24}>
        <Col {...reportCol}>
          <CameraStatistics />
          <div>
            <div className="chart-background">
              <LineChart />
            </div>
            <div className="chart-background">
              <PieChart />
            </div>
          </div>
        </Col>
        <Col {...notiCol}>
          <div className="noti">
            <Notification />
          </div>
        </Col>
      </Row>
    </div>
  );
}
