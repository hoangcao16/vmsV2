import { Form } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, useIntl } from 'umi';
import { EVENT_FILES_NAMESPACE } from '../../constants';
import { CellCreateTime, ProTableStyled } from './eventFilesStyled';

function EventFiles({ dispatch, loading, list, metadata }) {
  const intl = useIntl();

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...metadata, page, size });

    dispatch({
      type: `${EVENT_FILES_NAMESPACE}/fetchAll`,
      payload: dataParam,
    });
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.created_time',
      }),
      dataIndex: 'createdTime',
      render: (text) => {
        return <CellCreateTime>{moment(text).format('DD/MM/YYYY HH:mm')}</CellCreateTime>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.type',
      }),
      dataIndex: 'type',
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
      title: intl.formatMessage({
        id: 'view.storage.event',
      }),
      dataIndex: 'eventName',
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
  ];

  return (
    <div>
      <ProTableStyled
        loading={loading}
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
  const { list, metadata } = state.eventFiles;
  return {
    loading: state.loading.models.eventFiles,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(EventFiles);
