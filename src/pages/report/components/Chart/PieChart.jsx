import { G2, Pie } from '@ant-design/plots';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { TimeoutChart } from '../../style';
import ChartHeader from './ChartHeader';

const PieChart = (props) => {
  const intl = useIntl();
  const [data, setData] = useState([]);
  console.log('data', data);
  const G = G2.getEngine('canvas');

  useEffect(() => {
    if (!isEmpty(props.data)) {
      props.data.forEach((item) => {
        item.percent = parseFloat(item.percent);
        item.total = parseInt(item.total);
      });
      setData(props.data);
    }
  }, [props.data]);

  const config = {
    appendPadding: 10,
    data,
    angleField: 'total',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}: {value} | {percentage}',
      style: {
        fill: 'white',
      },
    },
    legend: {
      position: 'bottom',
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <>
      <ChartHeader
        title={intl.formatMessage({
          id: `pages.report.chart.pieTitle`,
        })}
        typeChart={'pie'}
      />
      {props.timeoutFieldData ? (
        <TimeoutChart>
          {intl.formatMessage({
            id: `pages.report.chart.emptyField`,
          })}
        </TimeoutChart>
      ) : props.timeoutEventData ? (
        <TimeoutChart>
          {intl.formatMessage({
            id: `pages.report.chart.emptyEvent`,
          })}
        </TimeoutChart>
      ) : !props.timeout ? (
        <Pie {...config} />
      ) : (
        <TimeoutChart>
          {intl.formatMessage({
            id: `pages.report.chart.dateRangeError`,
          })}
        </TimeoutChart>
      )}
    </>
  );
};

function mapStateToProps(state) {
  const { chart, home } = state;
  return {
    data: chart?.listPieChart,
    timeout: home?.timeoutDataPieChart,
    timeoutFieldData: state?.chartControl?.timeoutFieldData,
    timeoutEventData: state?.chartControl?.timeoutEventData,
  };
}

export default connect(mapStateToProps)(PieChart);
