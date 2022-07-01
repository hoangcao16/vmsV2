import eventFilesApi from '@/services/storage-api/eventFilesApi';
import { Badge, Tooltip, Empty } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { connect, useIntl } from 'umi';
import {
  CAPTURED_NAMESPACE,
  DAILY_ARCHIVE_NAMESPACE,
  EVENT_AI_NAMESPACE,
  EVENT_FILES_NAMESPACE,
  GRID_VIEW,
  IMPORTANT_NAMESPACE,
  LIST_VIEW,
} from '../../constants';
import DrawerView from './components/DrawerView';
import GridViewTable from './components/GridViewTable';
import { CellCreateTime, ProTableStyled } from './style';

function TableStorage({ dispatch, state, nameSpace }) {
  const intl = useIntl();
  const { list, metadata } = state[nameSpace];
  const viewType = state[nameSpace].viewType ? state[nameSpace].viewType : LIST_VIEW;
  const loading = state.loading.models[nameSpace] ? state.loading.models[nameSpace] : false;

  const [isOpenView, setIsOpenView] = useState(false);
  const [captureSelected, setCaptureSelected] = useState(null);

  const [eventList, setEventList] = useState([]);

  const handleOpenDrawerView = (value) => {
    if (!value) {
      return;
    }
    setIsOpenView(true);
    setCaptureSelected(value);
  };

  const handleCloseDrawerView = () => {
    setIsOpenView(false);
    setCaptureSelected(null);
  };

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...metadata, page, size });

    dispatch({
      type: `${nameSpace}/fetchAll`,
      payload: dataParam,
    });
  };

  const getEventList = () => {
    eventFilesApi
      .getEventList({ page: 0, size: 1000000, sort_by: 'name', order_by: 'asc' })
      .then((res) => {
        setEventList(res.payload);
      });
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

  const renderColumns = () => {
    let columns = [
      {
        title: intl.formatMessage({
          id: 'view.storage.created_time',
        }),
        dataIndex: 'createdTime',
        render: (text) => {
          return (
            <CellCreateTime>
              {moment(
                nameSpace === DAILY_ARCHIVE_NAMESPACE || nameSpace === IMPORTANT_NAMESPACE
                  ? text * 1000
                  : text,
              ).format('DD/MM/YYYY HH:mm')}
            </CellCreateTime>
          );
        },
      },
    ];

    switch (nameSpace) {
      case DAILY_ARCHIVE_NAMESPACE: {
        columns.push(
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
        );
        break;
      }

      case CAPTURED_NAMESPACE: {
        columns.push(
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
        );
        break;
      }

      case EVENT_FILES_NAMESPACE: {
        columns.push(
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
        );
        break;
      }

      case IMPORTANT_NAMESPACE: {
        columns.push(
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
        );
        break;
      }

      case EVENT_AI_NAMESPACE: {
        columns.push(
          {
            title: intl.formatMessage({
              id: 'view.storage.type',
            }),
            dataIndex: 'fileType',
            render: (text) => {
              return intl.formatMessage({
                id: 'view.storage.type_image',
              });
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
        );
        break;
      }

      default: {
        break;
      }
    }

    return columns;
  };

  useEffect(() => {
    getEventList();
  }, []);
  return (
    <div>
      {viewType === GRID_VIEW && (
        <GridViewTable nameSpace={nameSpace} handleOnRow={handleOpenDrawerView} />
      )}

      {viewType === LIST_VIEW && (
        <ProTableStyled
          loading={loading}
          rowKey={'id'}
          search={false}
          locale={{
            emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
          }}
          options={false}
          dataSource={list}
          columns={renderColumns()}
          onRow={(record) => {
            return {
              onClick: (event) => {
                handleOpenDrawerView(record);
              },
            };
          }}
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
            pageSize: metadata?.size,
            current: metadata?.page,
          }}
        />
      )}

      {captureSelected !== null && (
        <DrawerView
          isOpenView={isOpenView}
          dataSelected={captureSelected}
          onClose={handleCloseDrawerView}
          nameSpace={nameSpace}
          eventList={eventList}
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps)(TableStorage);
