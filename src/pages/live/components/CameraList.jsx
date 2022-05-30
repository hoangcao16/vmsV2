import { LIVE_MODE } from '@/constants/common';
import useClickOutside from '@/hooks/useClickOutside';
import cameraApi from '@/services/controllerApi/cameraService';
import { FilterFilled } from '@ant-design/icons';
import { Button, Form, Input, Pagination, Space, Tooltip } from 'antd';
import React, { useEffect, useRef } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import styled from 'styled-components';
import { connect } from 'umi';

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

const CameraList = ({ dispatch, ...props }) => {
  const [pagination, setPagination] = React.useState({
    page: 1,
    size: 20,
    name: '',
    total: 0,
  });
  const divRef = useRef(null);
  const [form] = Form.useForm();

  useClickOutside(divRef, props?.onCancel);

  useEffect(() => {
    fetchCameras();
  }, [pagination.page, pagination.name]);

  const fetchCameras = async () => {
    try {
      const { metadata, payload } = await cameraApi.getAll({
        page: pagination.page,
        size: pagination.size,
        name: pagination.name,
      });

      dispatch({
        type: 'live/saveAvailableList',
        payload,
      });
      setPagination({
        ...pagination,
        ...metadata,
      });
    } catch (error) {}
  };

  const handleSearch = ({ name }) => {
    setPagination({
      page: 1,
      size: 20,
      name,
      total: 0,
    });
  };

  return (
    <StyledDrawer ref={divRef} {...props}>
      <Form form={form} onFinish={handleSearch}>
        <Space size={8}>
          <Form.Item name="name" noStyle>
            <Input.Search placeholder="Nhãn camera" onSearch={form.submit} />
          </Form.Item>
          <Button type="primary" icon={<FilterFilled />} />
        </Space>
      </Form>
      <StyledWrapper autoHide>
        <Droppable droppableId={LIVE_MODE.CAMERA_LIST_DROPPABLE_ID}>
          {(provided) => (
            <StyledCameraList ref={provided.innerRef} {...provided.droppableProps}>
              {props?.cameras.map((item, index) => (
                <CameraItem item={item} index={index} />
              ))}
              {provided.placeholder}
            </StyledCameraList>
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
    </StyledDrawer>
  );
};

const StyledDrawer = styled.div`
  position: fixed;
  display: flex;
  flex-flow: column;
  top: 0;
  bottom: 0;
  right: ${(prop) => (prop.visible ? 0 : '-100%')};
  z-index: 1000;
  padding: 1rem;
  background-color: #1f1f1f;
  transition: all 0.2s linear;
`;

const StyledWrapper = styled(Scrollbars)`
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  margin: 10px 0;
`;

const StyledCameraList = styled.div``;

const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const StyledCameraItem = styled.div`
  margin-bottom: 5px;
  padding: 5px;
  z-index: 99999 !important;
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

export default connect(() => {})(CameraList);
