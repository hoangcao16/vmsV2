import { ProTableStyle } from '@/pages/category/administrative-unit/style';
import { SpanCode } from '@/pages/category/camera/components/GroupCameraDrawer/style';
import ReportApi from '@/services/report/ReportApi';
import { Col, Row } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

const DetailTable = (props) => {
  const [data, setData] = useState([]);
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [payload, setPayload] = useState({});
  const intl = useIntl();

  const getData = async () => {
    console.log('payload', payload);
    try {
      if (payload?.typeTime) {
        const result = await ReportApi.getDataDetailChart(payload);
        setTotal(result?.payload?.metadata?.total);
        setData(result?.payload?.events);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const dataParams = props?.filterParams;
    const params = { size: size, page: page };
    setPayload({ ...params, ...dataParams });
  }, [props?.filterParams, page, size]);

  useEffect(() => {
    getData();
  }, [payload]);

  const dateForm = (date) => {
    return moment(date).format('DD/MM/YYYY | hh:mm:ss');
  };

  const onPaginationChange = (page, size) => {
    setPage(page);
    setSize(size);
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
      title: intl.formatMessage({ id: 'pages.report.chart.type' }),
      dataIndex: 'type',
      key: 'type',
      valueEnum: {
        0: 'Video',
        1: {
          text: intl.formatMessage({
            id: 'pages.report.chart.image',
          }),
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.eventType' }),
      key: 'eventName',
      dataIndex: 'eventName',
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.recordCamera' }),
      key: 'cameraName',
      dataIndex: 'cameraName',
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.penaltyTicketId' }),
      key: 'penaltyTicketId',
      dataIndex: 'penaltyTicketId',
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.status' }),
      key: 'status',
      dataIndex: 'status',
      valueEnum: {
        process: {
          text: intl.formatMessage({
            id: 'pages.report.chart.notProcess',
          }),
          status: 'Default',
        },
        processing: {
          text: intl.formatMessage({
            id: 'pages.report.chart.processing',
          }),
          status: 'Processing',
        },
        processed: {
          text: intl.formatMessage({
            id: 'pages.report.chart.processed',
          }),
          status: 'Success',
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.report.chart.note' }),
      key: 'note',
      dataIndex: 'note',
    },
  ];

  return (
    <Row gutter={24}>
      <Col span={24}>
        <ProTableStyle
          headerTitle={intl.formatMessage({
            id: 'pages.report.chart.detailReport',
          })}
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
              })} ${total} ${intl.formatMessage({
                id: 'pages.report.chart.event',
              })}`,
            total: total,
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
  return { filterParams: state?.chart?.payload };
}

export default connect(mapStateToProps)(DetailTable);
