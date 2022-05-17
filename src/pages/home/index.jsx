import React from 'react';
import Report from '@/pages/report/index';
import { Row, Col } from 'antd';
import Notification from './Notification';

const reportCol = {
  xs: 20,
  sm: 20,
  md: 20,
  lg: 20,
  xl: 20,
  style: {
    marginBottom: 24,
  },
};

const notiCol = {
  xs: 4,
  sm: 4,
  md: 4,
  lg: 4,
  xl: 4,
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
        <Notification />
      </Col>
    </Row>
  );
}
