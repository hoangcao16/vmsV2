/* eslint-disable react/no-array-index-key */
import { LIVE_MODE } from '@/constants/common';
import cameraApi from '@/services/controllerApi/cameraService';
import { CloseOutlined, FilterFilled, LoadingOutlined } from '@ant-design/icons';
import { Button, Form, Input, Pagination, Spin, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'umi';

import FilterDrawer from './FilterDrawer';

const CameraItem = ({ item, index }) => {
  return (
    <Draggable draggableId={item.uuid} index={index}>
      {(provided) => (
        <StyledCameraItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
        >
          <Tooltip title={item.name} placement="left">
            <CameraItemName active={item.recordingStatus}>{item.name}</CameraItemName>
          </Tooltip>
        </StyledCameraItem>
      )}
    </Draggable>
  );
};

const CameraList = ({ dispatch, filters, cameras: listCameras = [], ...props }) => {
  const intl = useIntl();
  const [pagination, setPagination] = React.useState({
    page: 1,
    size: 20,
    name: '',
    total: 0,
  });
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCameras();
  }, [pagination.page, pagination.name, filters]);

  const fetchCameras = async () => {
    setLoading(true);
    try {
      const { metadata, payload } = await cameraApi.getAll({
        page: pagination.page,
        size: pagination.size,
        name: pagination.name,
        ...filters,
      });

      dispatch({
        type: 'live/saveAvailableList',
        payload,
      });
      setPagination({
        ...pagination,
        ...metadata,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = ({ name }) => {
    setPagination({
      page: 1,
      size: 20,
      name,
      total: 0,
    });
    const filters = form.getFieldsValue();
    dispatch({
      type: 'filterCamera/setFilter',
      payload: { filters },
    });
  };

  return (
    <StyledDrawer {...props}>
      <div className="ant-drawer-header">
        <div className="ant-drawer-header-title">
          <Button icon={<CloseOutlined />} className="ant-drawer-close" onClick={props?.onClose} />
          <div className="ant-drawer-title">
            <FormattedMessage id="pages.live-mode.list.camera" />
          </div>
        </div>
      </div>
      <StyledDrawerContent>
        {loading && <StyledSpin indicator={<LoadingOutlined style={{ fontSize: 32 }} />} />}
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <StyledSearch size={8}>
            <Form.Item name="name" noStyle>
              <Input.Search
                allowClear
                maxLength={255}
                placeholder={intl.formatMessage({
                  id: 'placeholder-camera',
                })}
                onSearch={form.submit}
                onBlur={(e) => {
                  form.setFieldsValue({
                    name: e.target.value.trim(),
                  });
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  form.setFieldsValue({
                    name: e.clipboardData.getData('text').trim(),
                  });
                }}
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<FilterFilled />}
              onClick={() => setVisibleFilter(!visibleFilter)}
            />
          </StyledSearch>
          {visibleFilter && <FilterDrawer form={form} />}
        </Form>
        <StyledWrapper autoHide>
          <Droppable droppableId={LIVE_MODE.CAMERA_LIST_DROPPABLE_ID}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {listCameras.map((item, index) => (
                  <CameraItem key={index} item={item} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </StyledWrapper>
        <StyledPagination>
          <Pagination
            size="small"
            pageSize={pagination.size}
            current={pagination.page}
            total={pagination.total}
            onChange={(page) =>
              setPagination({
                ...pagination,
                page,
              })
            }
          />
        </StyledPagination>
      </StyledDrawerContent>
    </StyledDrawer>
  );
};

const StyledDrawer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  bottom: 0;
  right: ${(prop) => (prop.visible ? 0 : '-100%')};
  z-index: 1000;
  background-color: #1f1f1f;
  transition: all 0.5s linear;
`;

const StyledDrawerContent = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;
  flex-flow: column;
  width: 350px;
`;

const StyledSpin = styled(Spin)`
  display: flex !important;
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: #eeeeee10;
  justify-content: center;
  align-items: center;
`;

const StyledWrapper = styled(Scrollbars)`
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  margin: 10px 0;
`;

const StyledSearch = styled.div`
  display: flex;

  .ant-input-search {
    margin-right: 10px;
  }
`;

const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const StyledCameraItem = styled.div`
  margin-bottom: 5px;
  padding: 5px;
  user-select: none;
`;

const CameraItemName = styled.p`
  position: relative;
  white-space: nowrap;
  margin-bottom: 0;
  padding-left: 15px;
  overflow: hidden;
  text-overflow: ellipsis;

  &::after {
    position: absolute;
    top: calc(50% - 3px);
    left: 0;
    width: 6px;
    height: 6px;
    background-color: ${(prop) => (prop.active ? '#52c41a' : '#FF4D4F')};
    border-radius: 50px;
    content: '';
  }
`;

function mapStateToProps(state) {
  const { filters } = state.filterCamera;

  return {
    filters,
  };
}

export default connect(mapStateToProps)(CameraList);
