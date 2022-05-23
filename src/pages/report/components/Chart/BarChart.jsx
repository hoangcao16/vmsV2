import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { connect } from 'dva';
import { useIntl } from 'umi';

import { TimeoutChart } from '../../style';

const BarChart = (props) => {
  const [data, setData] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    console.log('props?.data', props?.data);
    setData(props?.data);
  }, [props?.data]);

  const config = {
    data,
    isGroup: true,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    legend: {
      position: 'bottom',
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
