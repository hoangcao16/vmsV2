import ProTable from '@ant-design/pro-table';
import React, { useEffect } from 'react';
import { connect, useIntl } from 'umi';
import moment from 'moment';
import { CellCreateTime } from './style';

function TableDailyArchive({ dispatch, list, metadata }) {
  const intl = useIntl();

  const onPaginationChange = (page, size) => {
    dispatch({
      type: 'dailyArchive/fetchAllDailyArchive',
      payload: {
        page,
        size,
      },
    });
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.created_time',
      }),
      dataIndex: 'createdTime',
      render: (text) => {
        return <CellCreateTime>{moment(text * 1000).format('DD/MM/YYYY HH:mm')}</CellCreateTime>;
      },
    },
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
        if (text === 1) return 'view.storage.type_image';
      },
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.file_name',
      }),
      dataIndex: 'name',
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
  ];

  return (
    <div>
      <ProTable
        rowKey={'id'}
        search={false}
        options={false}
        dataSource={list}
        columns={columns}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: onPaginationChange,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'pages.storage.dailyArchive.total',
            })} ${total} ${intl.formatMessage({
              id: 'pages.storage.dailyArchive.camera',
            })}`,
          total: metadata?.total,
          // onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.dailyArchive;
  return {
    list,
    metadata,
    loading: state.loading.models.dailyArchive,
  };
}

export default connect(mapStateToProps)(TableDailyArchive);
