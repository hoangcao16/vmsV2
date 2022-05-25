import { Badge, Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, useIntl } from 'umi';
import { EVENT_AI_NAMESPACE } from '../../constants';
import GridViewEventAI from './components/GridViewEventAI/GridViewEventAI';
import { CellCreateTime, ProTableStyled } from './style';

function EventAI({ list, dispatch, metadata, loading }) {
  const intl = useIntl();

  const [viewType, setViewType] = useState('list');

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...metadata, page, size });

    dispatch({
      type: `${EVENT_AI_NAMESPACE}/fetchAll`,
      payload: dataParam,
    });
  };

  const renderSubtype = (value) => {
    return (
      <Tooltip
        title={intl.formatMessage({
          id: 'view.ai_events.' + value,
        })}
      >
        <span>
          {intl.formatMessage({
            id: 'view.ai_events.' + value,
          })}
        </span>
      </Tooltip>
    );
  };

  const renderStatus = (value) => {
    return (
      <>
        {value === 'process' && <Badge color="yellow" />}
        {value === 'processed' && <Badge color="green" />}
        {value === 'not_processed' && <Badge color="red" />}

        {intl.formatMessage({
          id: 'view.ai_events.processingStatus.' + value,
        })}
      </>
    );
  };

  const renderName = (value) => {
    if (value && value.length > 30) {
      return (
        <Tooltip title={value}>
          <span>
            {value.substr(0, 15) + '...' + value.substr(value.length - 15, value.length - 1)}
          </span>
        </Tooltip>
      );
    } else {
      return value;
    }
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
        id: 'view.storage.event',
      }),
      dataIndex: 'eventType',
      render: renderSubtype,
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
        id: 'view.penaltyTicket.ticket_num',
      }),
      dataIndex: 'penaltyTicketId',
    },

    {
      title: intl.formatMessage({
        id: 'view.common_device.status',
      }),
      dataIndex: 'status',
      render: renderStatus,
    },

    {
      title: intl.formatMessage({
        id: 'view.storage.note',
      }),
      dataIndex: 'note',
      render: renderName,
    },
  ];

  return (
    <div>
      {viewType === 'list' && (
        <ProTableStyled
          loading={loading}
          rowKey={'id'}
          search={false}
          options={false}
          dataSource={list}
          columns={columns}
          // onRow={(record) => {
          //   return {
          //     onClick: (event) => {
          //       handleOpenDrawerView(record);
          //     },
          //   };
          // }}
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
      )}

      {viewType === 'grid' && <GridViewEventAI />}
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.eventAI;
  return {
    loading: state.loading.models.eventAI,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(EventAI);
