import React, { useEffect, useState } from 'react';
import CameraStatistics from './components/cameraStatistics';
import Chart from './components/chart';
import { Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';

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
  const [currentPathIsReport, setCurrentPathIsReport] = useState(false);
  let url = useHistory();

  useEffect(() => {
    if (url.location.pathname == '/report') {
      setCurrentPathIsReport(true);
    }
  });
  return (
    <>
      {currentPathIsReport ? (
        <Row gutter={24}>
          <Col {...chartCol}>
            <CameraStatistics />
            <Chart />
          </Col>
          <Col {...controlCol}>
            <div className="chartControl">Chart Control</div>
          </Col>
        </Row>
      ) : (
        <>
          <CameraStatistics />
          <Chart />
        </>
      )}
    </>
  );
}
