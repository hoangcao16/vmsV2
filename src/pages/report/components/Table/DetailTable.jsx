import { ProTableStyle } from '@/pages/category/administrative-unit/style';
import { SpanCode } from '@/pages/category/camera/components/GroupCameraDrawer/style';
import ReportApi from '@/services/report/ReportApi';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const DetailTable = (props) => {
  const [data, setData] = useState([]);
  console.log('data', data);
  const [size, setSize] = useState(10);
  const [page, setpage] = useState(1);
  const intl = useIntl();

  const getData = async () => {
    console.log('props.filterParams', props.filterParams);
    const params = { page: 1, size: 10 };
    const payload = { ...params, ...props.filterParams };
    console.log('payload', payload);
    try {
      const result = await ReportApi.getDataDetailChart(payload);
      console.log('result', result);
      setData(result?.payload?.events);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [props?.filterParams]);

  const formatDate = (date) => {
    let formatted_date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    return formatted_date;
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.report.chart.timeRecord' }),
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text) => {
        return (
          <SpanCode>
            {formatDate(new Date(text))} | {new Date(text).toLocaleTimeString()}
          </SpanCode>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.type' }),
      dataIndex: 'type',
      key: 'type',
    },
  ];

  return (
    <ProTableStyle
      headerTitle={intl.formatMessage(
        {
          id: 'view.camera.camera_list',
        },
        {
          cam: intl.formatMessage({
            id: 'camera',
          }),
        },
      )}
      rowKey="uuid"
      search={false}
      dataSource={data}
      columns={columns}
      options={false}
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total) =>
          `${intl.formatMessage({
            id: 'view.camera.total',
          })} ${total} camera`,
      }}
    />
  );
};

function mapStateToProps(state) {
  return { filterParams: state?.chart?.payload };
}

export default connect(mapStateToProps)(DetailTable);
