import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import CameraStatistics from '../report/components/CameraStatistics';
import LineChart from '../report/components/Chart/LineChart';
import PieChart from '../report/components/Chart/PieChart';
import ListTable from '../report/components/Table/ListTable';
import { ChartBackground } from '../report/style';
import Notification from './Notification';

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

const NotiWrapper = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 70px;
  margin-bottom: 24px;
`;

export default function index() {
  return (
    <div className="home">
      <Row gutter={24}>
        <Col {...reportCol}>
          <CameraStatistics />
          <div>
            <ChartBackground>
              <LineChart />
            </ChartBackground>
            <ChartBackground>
              <PieChart />
            </ChartBackground>
            <ChartBackground>
              <ListTable />
            </ChartBackground>
          </div>
        </Col>
        <Col {...notiCol}>
          <NotiWrapper>
            <Notification />
          </NotiWrapper>
        </Col>
      </Row>
    </div>
  );
}
