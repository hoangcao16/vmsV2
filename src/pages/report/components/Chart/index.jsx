import React from 'react';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import { connect } from 'dva';
import { useIntl } from 'umi';
import { TimeoutChart } from '../../style';

const Chart = ({ timeoutData }) => {
  const intl = useIntl();
  return (
    <div className="chart">
      {timeoutData ? (
        <TimeoutChart paddingY={256}>
          {intl.formatMessage({
            id: `pages.report.chart.dateRangeError`,
          })}
        </TimeoutChart>
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
