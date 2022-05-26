import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import ProTable from '@ant-design/pro-table';
import { Select, Tooltip } from 'antd';
import _ from 'lodash';
import { findIndex } from 'lodash-es';
import moment from 'moment';
import React, { useState } from 'react';
import { ContainerTableEventFile } from './style';
import { useIntl } from 'umi';

const TableEventFile = (props) => {
  const intl = useIntl();

  let eventList = props.eventList || [];
  let dataList = props.dataList || [];

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(2);

  const renderViolationTime = (value) => {
    return moment(value * 1000).format('DD/MM/YYYY HH:mm');
  };

  const renderCreatedTime = (value) => {
    return moment(value).format('DD/MM/YYYY HH:mm');
  };

  const renderType = (value) => {
    return !value || value === 0
      ? intl.formatMessage({
          id: 'view.storage.type_video',
        })
      : intl.formatMessage({
          id: 'view.storage.type_image',
        });
  };

  const onChangeEventHandler = (uuid, row) => {
    const event = eventList.filter((e) => e.uuid === uuid);
    if (event && event.length > 0) {
      const index = findIndex(dataList, (item) => item.uuid === row.uuid);
      if (index !== -1) {
        dataList[index] = Object.assign({
          ...dataList[index],
          eventUuid: uuid,
          eventName: event[0].name,
        });
      }
    }
  };

  const renderEvent = (row) => {
    const defaultVal = row.eventUuid === '' ? null : row.eventUuid;
    if (row.isSaved && !row.editMode)
      return (
        <Tooltip title={row.eventName}>
          <span>{row.eventName}</span>
        </Tooltip>
      );
    return (
      <Select
        allowClear
        showSearch
        onChange={(uuid) => onChangeEventHandler(uuid, row)}
        filterOption={filterOption}
        options={normalizeOptions('name', 'uuid', eventList)}
        placeholder={`t('view.category.event_type')`}
        defaultValue={defaultVal}
      />
    );
  };

  const onChangeNoteHandler = (event, row) => {
    const index = findIndex(dataList, (item) => item.uuid === row.uuid);
    if (index !== -1) {
      dataList[index] = Object.assign({
        ...dataList[index],
        note: event.target.value,
      });
    }
  };

  const eventFileColumns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.type',
      }),
      dataIndex: 'type',
      key: 'type',
      render: renderType,
    },
    {
      title: intl.formatMessage(
        {
          id: 'view.storage.camera_name',
        },
        {
          cam: intl.formatMessage({ id: 'camera' }),
        },
      ),
      dataIndex: 'cameraName',
      key: 'cameraName',
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.address',
      }),
      dataIndex: 'address',
      key: 'address',
    },

    {
      title: intl.formatMessage({
        id: 'view.storage.event',
      }),
      dataIndex: '',
      key: 'event',
      render: renderEvent,
    },

    {
      title: intl.formatMessage({
        id: 'view.storage.violation_time',
      }),
      dataIndex: 'violationTime',
      key: 'violationTime',
      render: renderViolationTime,
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.created_time',
      }),
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: renderCreatedTime,
    },
  ];

  const onPaginationChange = (page, size) => {
    setPage(page);
    setSize(size);
  };

  return (
    <ContainerTableEventFile>
      <ProTable
        rowKey={'uuid'}
        search={false}
        options={false}
        dataSource={dataList}
        columns={eventFileColumns}
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
          total: dataList.length,
          // onChange: onPaginationChange,
          pageSize: size,
          current: page,
        }}
      />
    </ContainerTableEventFile>
  );
};

function tableEventFilePropsAreEqual(prevTblEventFile, nextTblEventFile) {
  return _.isEqual(prevTblEventFile.dataList, nextTblEventFile.dataList);
}

export const MemoizedTableEventFile = React.memo(TableEventFile, tableEventFilePropsAreEqual);
