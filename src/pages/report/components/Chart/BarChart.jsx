import { Column } from '@ant-design/plots';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { TimeoutChart } from '../../style';

const BarChart = (props) => {
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
    data,
    isGroup: true,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    legend: {
      position: 'bottom',
      itemName: {
        style: {
          fill: '#dfdfdf',
        },
      },
    },
    label: {
      position: 'middle',
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  };
  return (
    <>
      {!props.timeout ? (
        <Column {...config} />
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
  return { data: chart?.list, timeout: home?.timeoutDataPieChart };
}

export default connect(mapStateToProps)(BarChart);
