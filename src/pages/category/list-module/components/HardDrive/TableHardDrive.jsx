import { useEffect } from 'react';
import { connect } from 'dva';
import { useIntl } from 'umi';
import { ProTableStyle } from '../../style';
import { Progress, Empty } from 'antd';

const TableHardDrive = ({ dispatch, list, metadata, loading }) => {
  const intl = useIntl();
  let lang = localStorage.getItem('umi_locale');

  useEffect(() => {
    dispatch({
      type: 'hardDrive/fetchAllHardDrive',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
        lang: lang === 'en-US' ? 'en' : 'vn',
      },
    });
  }, [lang]);

  const renderPercentUsed = (cellValue, row) => {
    return <Progress percent={cellValue} />;
  };

  const renderHardDriveCapacity = (cellValue, row) => {
    const data = Math.round(cellValue / 1024);
    return `${data} GB`;
  };

  const hardDriveColumns = [
    {
      title: `${intl.formatMessage({
        id: 'view.storage.hard_drive_name',
      })}`,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: `${intl.formatMessage({
        id: 'view.storage.total_disk_space',
      })}`,
      dataIndex: 'diskSpace',
      key: 'diskSpace',
      width: '13%',
      render: renderHardDriveCapacity,
    },
    {
      title: `${intl.formatMessage({
        id: 'view.storage.percent_used',
      })}`,
      dataIndex: 'percentUsed',
      key: 'percentUsed',
      render: renderPercentUsed,
      width: '25%',
    },
    {
      title: `${intl.formatMessage({
        id: 'view.storage.time_remaining',
      })}`,
      dataIndex: 'timeUsed',
      key: 'timeUsed',
      width: '22%',
    },
    {
      title: 'URL',
      dataIndex: 'path',
      key: 'path',
      width: '10%',
    },
  ];

  const onPaginationChange = (page, size) => {
    dispatch({
      type: 'hardDrive/fetchAllHardDrive',
      payload: {
        page: page,
        size: size,
      },
    });
  };

  return (
    <>
      <ProTableStyle
        headerTitle={`${intl.formatMessage({
          id: 'view.user.hard_drive_list',
        })}`}
        rowKey="id"
        search={false}
        locale={{
          emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
        }}
        dataSource={list?.diskInfoList}
        columns={hardDriveColumns}
        options={false}
        loading={loading}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'view.camera.total',
            })} ${total} ${intl.formatMessage({
              id: 'noti.hard_drive',
            })}`,
          onChange: onPaginationChange,
          total: metadata?.total,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
    </>
  );
};

function mapStateToProps(state) {
  const { list, metadata } = state.hardDrive;
  return {
    loading: state.loading.models.hardDrive,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(TableHardDrive);
