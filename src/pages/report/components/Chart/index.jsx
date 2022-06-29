import { Divider, Tabs } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import { ChartBackground, TimeoutChart } from '../../style';
import ExportReport from '../Export/ExportReport';
import ExportReportToMail from '../Export/ExportReportToMail';
import DetailTable from '../Table/DetailTable';
import GeneralTable from '../Table/GeneralTable';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';

const { TabPane } = Tabs;

const Header = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const HeaderExport = styled.div`
  font-size: 16px;
  width: 50px;
  display: flex;
  justify-content: space-between;
`;

const ExportCursonPointer = styled.div`
  cursor: pointer;
`;

const Chart = (props) => {
  useEffect(() => {
    if (location.pathname !== '/report' || location.pathname !== '/report/') {
      props.dispatch({ type: 'chartDisable/isDisablePieChart', boolean: false });
      props.dispatch({ type: 'chartDisable/isDisableBarChart', boolean: true });
      props.dispatch({
        type: 'chartDisable/changeCurrentTab',
        payload: '1',
      });
    }
  }, [location.pathname]);

  const intl = useIntl();
  return (
    <div className="chart">
      {props?.timeoutData ? (
        <TimeoutChart paddingY={256}>
          {intl.formatMessage({
            id: `pages.report.chart.dateRangeError`,
          })}
        </TimeoutChart>
      ) : (
        <>
          <ChartBackground>
            <Header>
              <HeaderWrapper>
                <HeaderTitle>
                  {intl.formatMessage({
                    id: `pages.report.chart.trafficViolationsStatistics`,
                  })}
                </HeaderTitle>
                <HeaderExport>
                  <ExportCursonPointer>
                    <ExportReportToMail />
                  </ExportCursonPointer>
                  <ExportCursonPointer>
                    <ExportReport />
                  </ExportCursonPointer>
                </HeaderExport>
              </HeaderWrapper>
              <Divider />
            </Header>
            <Tabs
              defaultActiveKey="1"
              onChange={(activeKey) => {
                props.dispatch({
                  type: 'chartDisable/changeCurrentTab',
                  payload: activeKey,
                });
              }}
              activeKey={props.currentTabKey}
            >
              <TabPane
                tab={intl.formatMessage({
                  id: `pages.report.chart.lineChart`,
                })}
                key="1"
              >
                <ChartBackground>
                  <LineChart />
                </ChartBackground>
              </TabPane>
              <TabPane
                tab={intl.formatMessage({
                  id: `pages.report.chart.pieChart`,
                })}
                key="2"
                disabled={props?.chartDisable?.isDisablePieChart}
              >
                <ChartBackground>
                  <PieChart />
                </ChartBackground>
              </TabPane>
              <TabPane
                tab={intl.formatMessage({
                  id: `pages.report.chart.barChart`,
                })}
                key="3"
                disabled={props?.chartDisable?.isDisableBarChart}
              >
                <ChartBackground>
                  <BarChart />
                </ChartBackground>
              </TabPane>
            </Tabs>
          </ChartBackground>
          <ChartBackground>
            <GeneralTable />
          </ChartBackground>
          <ChartBackground>
            <DetailTable />
          </ChartBackground>
        </>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    timeoutData: state?.chart?.timeoutData,
    chartDisable: state?.chartDisable,
    currentTabKey: state?.chartDisable?.currentTabKey,
  };
}

export default connect(mapStateToProps)(Chart);
