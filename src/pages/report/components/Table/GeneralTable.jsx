import ReportApi from '@/services/report/ReportApi';
import { Table } from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';

const ChartTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  padding: 10px 0;
`;

const GeneralTable = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [parseData, setParseData] = useState([]);
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const intl = useIntl();

  const nextIndex = {
    type: 0,
    location: 0,
  };

  useEffect(() => {
    try {
      if (!isEmpty(props?.params)) {
        ReportApi.getTableData(props?.params).then((result) => {
          setDataSource(result?.payload?.tableEvents);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [props?.params]);

  useEffect(() => {
    setTotal(dataSource.length);
    processParseData();
  }, [dataSource]);

  const processParseData = () => {
    let newData = [];
    const uniqueEvent = Array.from(new Set(dataSource.map((item) => item.eventUuid)));

    uniqueEvent.forEach((eventId) => {
      const listEvents = dataSource.filter((obj) => obj.eventUuid === eventId);
      listEvents.sort((a, b) => (a.nameLocation > b.nameLocation ? -1 : 1));
      newData = [...newData, ...listEvents];
    });

    setParseData(newData);
  };

  const mergeColumn = (row, index) => {
    if (nextIndex.type >= dataSource.length) {
      nextIndex.type = 0;
    }

    const totalRows = dataSource.filter((obj) => obj.eventUuid === row.eventUuid);

    if (index === 0 || index === nextIndex.type) {
      nextIndex.type += totalRows.length;
      return {
        rowSpan: totalRows.length,
      };
    } else {
      return {
        rowSpan: 0,
        colSpan: 0,
      };
    }
  };

  const mergeColumnLocation = (row, index) => {
    if (nextIndex.location >= dataSource.length) {
      nextIndex.location = 0;
    }

    const totalRows = dataSource.filter(
      (obj) => obj.eventUuid === row.eventUuid && obj.nameLocation === row.nameLocation,
    );

    if (index === 0 || index === nextIndex.location) {
      nextIndex.location += totalRows.length;
      return {
        rowSpan: totalRows.length,
      };
    } else {
      return {
        rowSpan: 0,
        colSpan: 0,
      };
    }
  };

  const generateColumn = () => {
    let format = {
      dateStringFormat: 'DDMMYYYY',
      dateFormat: 'DD/MM/YYYY',
      unit: 'd',
      start: '01/01/2022',
      end: '10/01/2022',
    };

    switch (props?.params?.typeTime) {
      case 'WEEK':
        format = {
          dateStringFormat: 'WWYYYY',
          dateFormat: 'WW-YYYY',
          unit: 'w',
          start: '01-2022',
          end: '10-2022',
        };
        break;
      case 'MONTH':
        format = {
          dateStringFormat: 'MMYYYY',
          dateFormat: 'MM/YYYY',
          unit: 'M',
          start: '01/2022',
          end: '02/2022',
        };
        break;
      case 'YEAR':
        format = {
          dateStringFormat: 'YYYY',
          dateFormat: 'YYYY',
          unit: 'y',
          start: '2018',
          end: '2022',
        };
        break;
      default:
        format = {
          dateStringFormat: 'DDMMYYYY',
          dateFormat: 'DD/MM/YYYY',
          unit: 'd',
          start: '01/01',
          end: '10/01',
        };
        break;
    }

    if (!isEmpty(props?.params?.startDate)) {
      format.start = moment(props?.params?.startDate, format.dateStringFormat).format(
        format.dateFormat,
      );
    }

    if (!isEmpty(props?.params?.endDate)) {
      format.end = moment(props?.params?.endDate, format.dateStringFormat).format(
        format.dateFormat,
      );
    }

    const startDate = moment(format.start, format.dateFormat);
    const endDate = moment(format.end, format.dateFormat);

    let diff = moment(endDate).diff(startDate, format.unit);
    if (diff < 0) {
      diff = -1;
    }

    return Array.from(new Array(diff + 1)).map((val, key) => {
      const name = startDate.format(format.dateFormat);
      startDate.add(1, format.unit);
      if (props?.params?.typeTime == 'DAY') {
        return {
          width: 100,
          align: 'center',
          className: 'p-0',
          title: moment(name, 'DD/MM/YYYY').format('DD/MM'),
          dataIndex: name,
          key,
        };
      }
      return {
        width: 100,
        align: 'center',
        className: 'p-0',
        title: name,
        dataIndex: name,
        key,
      };
    });
  };

  var columns = [
    {
      title: intl.formatMessage({
        id: 'pages.report.chart.violationType',
      }),
      dataIndex: 'type',
      key: 'type',
      fixed: 'left',
      width: 120,
      onCell: (_, index) => mergeColumn(_, index),
    },
    {
      title: intl.formatMessage({
        id: 'pages.report.chart.recordCamera',
      }),
      dataIndex: 'nameCamera',
      key: 'nameCamera',
      fixed: 'left',
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'pages.report.chart.address',
      }),
      dataIndex: 'nameLocation',
      key: 'nameLocation',
      fixed: 'left',
      width: 150,
      onCell: (_, index) => mergeColumnLocation(_, index),
    },
    ...generateColumn(),
  ];

  const onPaginationChange = (page, size) => {
    setPage(page);
    setSize(size);
  };

  return (
    <>
      <ChartTitle>{intl.formatMessage({ id: 'pages.report.chart.generalReport' })}</ChartTitle>
      <Table
        dataSource={parseData}
        columns={columns}
        scroll={{ x: 1000, y: 500 }}
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
    </>
  );
};

function mapStateToProps(state) {
  return { params: state?.chart?.payload };
}

export default connect(mapStateToProps)(GeneralTable);
