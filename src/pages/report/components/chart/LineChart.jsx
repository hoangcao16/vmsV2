import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/plots';
import ChartHeader from './ChartHeader';
import { Divider } from 'antd';
import moment from 'moment';
import reportApi from '@/services/report/ReportApi';
import { connect } from 'dva';
import { useIntl } from 'umi';

const LineChart = (props) => {
  const [data, setData] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    if (props.data) {
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
    },
    color: ['#1979C9', '#D62A0D', '#FAA219'],
  };

  return (
    <>
      <ChartHeader
        title={intl.formatMessage({
          id: `pages.report.chart.lineTitle`,
          defaultMessage: 'name',
        })}
      />
      <Divider />
      <Line {...config} />
    </>
  );
};

function mapStateToProps(state) {
  const { chart } = state;
  console.log('chart', chart);
  return { data: chart?.list?.events };
}

export default connect(mapStateToProps)(LineChart);
