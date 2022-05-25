import moment from 'moment';
import React, { useState } from 'react';
import { connect, useIntl } from 'umi';
import { DAILY_ARCHIVE_NAMESPACE } from '../../constants';
import DrawerViewCapture from './components/DrawViewCapture/DrawerViewCapture';
import { CellCreateTime, ProTableStyled } from './style';

function TableDailyArchive({ list, dispatch, metadata, loading }) {
  const intl = useIntl();

  const [isOpenView, setIsOpenView] = useState(false);
  const [captureSelected, setCaptureSelected] = useState(null);

  const handleOpenDrawerView = (value) => {
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
      type: `${DAILY_ARCHIVE_NAMESPACE}/fetchAll`,
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
          // onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />

      {captureSelected !== null && (
        <DrawerViewCapture
          isOpenView={isOpenView}
          data={captureSelected}
          onClose={handleCloseDrawerView}
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.dailyArchive;
  return {
    loading: state.loading.models.dailyArchive,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(TableDailyArchive);
