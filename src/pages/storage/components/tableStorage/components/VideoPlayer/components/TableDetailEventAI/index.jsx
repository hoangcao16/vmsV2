import { Table, Empty } from 'antd';
import moment from 'moment';
import React from 'react';
import { useIntl } from 'umi';
import { CellCreateTime } from './style';

function TableDetailEventAI({ tracingList = [] }) {
  const intl = useIntl();

  const columns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.type',
      }),
      dataIndex: 'fileType',
      render: (text) => {
        if (text === 0)
          return intl.formatMessage({
            id: 'view.storage.type_video',
          });
        if (text === 1)
          return intl.formatMessage({
            id: 'view.storage.type_image',
          });
      },
    },
    {
      title: intl.formatMessage(
        {
          id: `view.storage.camera_name`,
        },
        {
          cam: intl.formatMessage({
            id: 'camera',
          }),
        },
      ),
      dataIndex: 'cameraName',
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.address',
      }),
      dataIndex: 'address',
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.event',
      }),
      dataIndex: 'eventName',
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.violation_time',
      }),
      dataIndex: 'createdTime',
      render: (text) => {
        return <CellCreateTime>{moment(text).format('DD/MM/YYYY HH:mm')}</CellCreateTime>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.created_time',
      }),
      dataIndex: 'createdTime',
      render: (text) => {
        return <CellCreateTime>{moment(text).format('DD/MM/YYYY HH:mm')}</CellCreateTime>;
      },
    },
  ];

  return (
    <div>
      <Table
        dataSource={tracingList}
        columns={columns}
        pagination={false}
        rowKey="uuid"
        locale={{
          emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
        }}
      />
    </div>
  );
}

export default TableDetailEventAI;
