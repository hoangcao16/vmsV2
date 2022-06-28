import { Line } from '@ant-design/plots';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { TimeoutChart } from '../../style';
import ChartHeader from './ChartHeader';

const LineChart = (props) => {
  const [data, setData] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    if (!isEmpty(props.data)) {
      props.data.forEach((item) => {
        item.value = parseInt(item.value);
      });
      setData(props.data);
    }
  }, [props.data]);

  const config = {
    data: data,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    yAxis: {
      label: {
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: {
      position: 'bottom',
      itemName: {
        style: {
          fill: '#dfdfdf',
        },
      },
      marker: {
        symbol: (x, y, r) => {
          return [
            ['M', x - r * 2, y],
            ['L', x + r * 2, y],
          ];
        },
        style: (oldStyle) => {
          return {
            ...oldStyle,
            r: 4,
            lineWidth: 2,
            stroke: oldStyle.stroke || oldStyle.fill,
          };
        },
      },
    },
    smooth: true,
  };

  return (
    <>
      <ChartHeader
        title={intl.formatMessage({
          id: `pages.report.chart.lineTitle`,
        })}
        typeChart={'line'}
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
        <Line {...config} />
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
    data: chart?.list,
    timeout: home?.timeoutDataLineChart,
    timeoutFieldData: state?.chartControl?.timeoutFieldData,
    timeoutEventData: state?.chartControl?.timeoutEventData,
  };
}

export default connect(mapStateToProps)(LineChart);
