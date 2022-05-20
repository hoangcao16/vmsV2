import React from 'react';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import { connect } from 'dva';
import { useIntl } from 'umi';
import styled from 'styled-components';

const timeoutScreen = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
  padding: 256px 32px;
  background-color: '#1f1f1f';
`;

const Chart = ({ timeoutData }) => {
  const intl = useIntl();
  return (
    <div className="chart">
      {timeoutData ? (
        <span>
          {intl.formatMessage({
            id: `pages.report.chart.dateRangeError`,
          })}
        </span>
      ) : (
        <>
          <div className="chart-background">
            <LineChart />
          </div>
          <div className="chart-background">
            <PieChart />
          </div>
          <div className="chart-background">
            <BarChart />
          </div>
        </>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return { timeoutData: state?.chart?.timeoutData };
}

export default connect(mapStateToProps)(Chart);
