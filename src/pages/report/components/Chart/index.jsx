import React from 'react';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import { connect } from 'dva';
import { useIntl } from 'umi';
import { TimeoutChart } from '../../style';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Chart = ({ timeoutData, chartDisable }) => {
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
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={intl.formatMessage({
                id: `pages.report.chart.lineChart`,
              })}
              key="1"
            >
              <LineChart />
            </TabPane>
            <TabPane
              tab={intl.formatMessage({
                id: `pages.report.chart.pieChart`,
              })}
              key="2"
              disabled={chartDisable?.pieChartDisable}
            >
              <PieChart />
            </TabPane>
            <TabPane
              tab={intl.formatMessage({
                id: `pages.report.chart.barChart`,
              })}
              key="3"
              disabled={chartDisable?.barChartDisable}
            >
              <BarChart />
            </TabPane>
          </Tabs>
        </>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return { timeoutData: state?.chart?.timeoutData, chartDisable: state?.chartDisable };
}

export default connect(mapStateToProps)(Chart);
