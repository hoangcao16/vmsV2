import React from 'react';
import Report from '@/pages/report/index';
import { Row, Col } from 'antd';
import Notification from './Notification';
import './Home.less';

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
    <Row gutter={24}>
      <Col {...reportCol}>
        <Report />
      </Col>
      <Col {...notiCol}>
        <div className="noti">
          <Notification />
        </div>
      </Col>
    </Row>
  );
}
