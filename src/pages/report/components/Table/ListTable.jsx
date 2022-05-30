import { SpanCode } from '@/pages/category/camera/components/GroupCameraDrawer/style';
import ProTable from '@ant-design/pro-table';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const ListTable = ({ dataWebSocketAiEventList, dispatch, loading }) => {
  const intl = useIntl();
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // websocket custom to test
    // const ws = new WebSocket('ws://192.168.50.145:8883/integration-ai-events');

    // websocket from Edso
    const ws = new WebSocket('ws://cctv-uat.edsolabs.com:8441/ai-events');

    const apiCall = {
      event: 'bts:subscribe',
      data: {},
    };

    ws.onopen = (event) => {
      ws.send(JSON.stringify(apiCall));
    };

    ws.onmessage = function (event) {
      const json = JSON.parse(event.data);
      try {
        if ((json.event = 'data')) {
          console.log('json', json);
          dispatch({ type: 'dataWebSocketReport/pushData', payload: json });
        }
      } catch (error) {
        console.log(error);
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  const onPaginationChange = (page, size) => {
    setPage(page);
    setSize(size);
  };

  const dateForm = (date) => {
    return moment(date).format('DD/MM/YYYY | hh:mm:ss');
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'pages.report.chart.timeRecord' }),
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text) => {
        return <SpanCode>{dateForm(text)}</SpanCode>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.recordCamera' }),
      key: 'cameraName',
      dataIndex: 'cameraName',
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.violationType' }),
      key: 'eventName',
      dataIndex: 'eventName',
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.address' }),
      key: 'address',
      dataIndex: 'address',
    },
  ];

  return (
    <Row gutter={24}>
      <Col span={24}>
        <ProTable
          headerTitle={intl.formatMessage({
            id: 'pages.report.chart.detailReport',
          })}
          loading={loading}
          rowKey="uuid"
          search={false}
          dataSource={[...dataWebSocketAiEventList]}
          columns={columns}
          options={false}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) =>
              `${intl.formatMessage({
                id: 'view.camera.total',
              })} ${total} ${intl.formatMessage({
                id: 'pages.report.chart.event',
              })}`,
            total: dataWebSocketAiEventList?.length,
            onChange: onPaginationChange,
            pageSize: size,
            current: page,
          }}
        />
      </Col>
    </Row>
  );
};

function mapStateToProps(state) {
  const { dataWebSocketAiEventList } = state.dataWebSocketReport;
  return { dataWebSocketAiEventList, loading: state.loading.models.dataWebSocketReport };
}

export default connect(mapStateToProps)(ListTable);
