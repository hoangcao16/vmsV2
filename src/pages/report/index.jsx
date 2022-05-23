import React from 'react';
import CameraStatistics from './components/CameraStatistics';
import Chart from './components/Chart';
import { Row, Col } from 'antd';
import ChartControl from './components/ChartControl';
import { connect } from 'dva';
import { useIntl } from 'umi';
import { TimeoutChart } from './style';

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

const Report = ({ timeoutFieldData, timeoutEventData }) => {
  const intl = useIntl();
  return (
    <div className="report">
      <Row gutter={24}>
        <Col {...chartCol}>
          <CameraStatistics />
          {timeoutFieldData ? (
            <TimeoutChart>
              {intl.formatMessage({
                id: `pages.report.chart.emptyField`,
              })}
            </TimeoutChart>
          ) : timeoutEventData ? (
            <TimeoutChart>
              {intl.formatMessage({
                id: `pages.report.chart.emptyEvent`,
              })}
            </TimeoutChart>
          ) : (
            <Chart />
          )}
        </Col>
        <Col {...controlCol}>
          <div className="chartControl">
            <ChartControl />
          </div>
        </Col>
      </Row>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    timeoutFieldData: state?.chartControl?.timeoutFieldData,
    timeoutEventData: state?.chartControl?.timeoutEventData,
  };
}

export default connect(mapStateToProps)(Report);
