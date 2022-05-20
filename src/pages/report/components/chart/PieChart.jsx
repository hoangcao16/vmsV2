import React, { useState, useEffect } from 'react';
import { Pie, G2 } from '@ant-design/plots';
import ChartHeader from './ChartHeader';
import { Divider } from 'antd';
import { connect } from 'dva';
import { useIntl } from 'umi';
import { isEmpty } from 'lodash';

const TimeoutChart = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
  padding: 128px 32px;
  background-color: #1f1f1f;
`;

const PieChart = (props) => {
  const intl = useIntl();
  const [data, setData] = useState([]);
  const G = G2.getEngine('canvas');

  useEffect(() => {
    if (!isEmpty(props.data)) {
      props.data.forEach((item) => {
        if (parseFloat(item.percent) <= 100) {
          item.percent = parseFloat(item.percent) * 100;
        }
      });
      setData(props.data);
    }
  }, [props.data]);

  const config = {
    appendPadding: 10,
    data,
    angleField: 'percent',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 40,
      formatter: (data, mappingData) => {
        const group = new G.Group({});
        group.addShape({
          type: 'circle',
          attrs: {
            x: 0,
            y: 0,
            width: 40,
            height: 50,
            r: 5,
            fill: mappingData.color,
          },
        });
        group.addShape({
          type: 'text',
          attrs: {
            x: 10,
            y: 8,
            text: `${data.type}`,
            fill: mappingData.color,
          },
        });
        group.addShape({
          type: 'text',
          attrs: {
            x: 0,
            y: 25,
            text: `${data.total} | ${data.percent * 100}%`,
            fill: mappingData.color,
            fontWeight: 700,
          },
        });
        return group;
      },
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
      <Divider />
      <Pie {...config} />
    </>
  );
};

function mapStateToProps(state) {
  const { chart } = state;
  return { data: chart?.listPieChart, timeout: home?.timeoutDataPieChart };
}

export default connect(mapStateToProps)(PieChart);
