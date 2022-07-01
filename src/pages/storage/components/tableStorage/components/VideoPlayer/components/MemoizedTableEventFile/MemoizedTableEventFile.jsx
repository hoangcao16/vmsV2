import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import { Button, Select, Tooltip, Empty } from 'antd';
import _ from 'lodash';
import { findIndex } from 'lodash-es';
import moment from 'moment';
import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useIntl } from 'umi';
import { ProTableStyled } from '../../../../style';
import { ContainerTableEventFile, StyledSpanPlaceholder } from './style';

const TableEventFile = (props) => {
  const intl = useIntl();

  let eventList = props.eventList || [];
  let dataList = props.dataList || [];

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

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
    if (row.isSaved && !row.editMode) {
      return (
        <Tooltip
          title={
            row.eventName ? (
              row.eventName
            ) : (
              <StyledSpanPlaceholder className="spanChooseEventType">
                {intl.formatMessage({ id: 'view.storage.choose_event_type' })}
              </StyledSpanPlaceholder>
            )
          }
        >
          <span>
            {row.eventName ? (
              row.eventName
            ) : (
              <StyledSpanPlaceholder className="spanChooseEventType">
                {intl.formatMessage({ id: 'view.storage.choose_event_type' })}
              </StyledSpanPlaceholder>
            )}
          </span>
        </Tooltip>
      );
    }
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

  const onSetEventFileHandler = (eventUuid, uuid) => {
    console.log('❗TuanHQ🐞 💻 onSetEventFileHandler 💻 eventUuid, uuid', eventUuid, uuid);
  };

  const renderSelectContent = (name, fieldName) => {
    return (
      <div className="event-select">
        <span className="event-name">{name}</span>&nbsp;
        <span className="field-name">{fieldName}</span>
      </div>
    );
  };

  const renderSetEventAction = (row) => {
    return (
      <div className="actionEventFileInActive">
        <Button type="text" icon={<BsThreeDotsVertical />} />
      </div>
    );
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
      <ProTableStyled
        rowKey={'uuid'}
        search={false}
        options={false}
        locale={{
          emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
        }}
        dataSource={dataList}
        columns={eventFileColumns}
        onRow={(record) => {
          return {
            onClick: (event) => {
              props.onSetEventFileHandler(record);
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
