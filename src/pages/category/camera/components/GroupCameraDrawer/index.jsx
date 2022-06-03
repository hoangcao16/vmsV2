/* eslint-disable react-hooks/exhaustive-deps */
import { StyledDrawer, SpanCode } from './style';
import { connect } from 'dva';
import { useIntl } from 'umi';
import { Space, Button, Form, Input, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
const GroupCameraDrawer = ({
  dispatch,
  isOpenDrawer,
  cameraGroupUuid,
  isEdit,
  setIsEdit,
  selectedGroupCamera,
  cameraGroupExistsed,
  metadataCameraGroupExistsed,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [cameraListInGroup, setCameraListInGroup] = useState([]);
  const [isOpenDrawerCamera, setIsOpenDrawerCamera] = useState(false);
  const [selectedCameraToAdd, setSelectedCameraToAdd] = useState([]);
  // fill data if isedit
  useEffect(() => {
    if (isEdit) {
      dispatch({
        type: 'groupcamera/fetchGroupCameraByUuid',
        payload: cameraGroupUuid,
      });
    }
  }, [isEdit]);
  // fill data if isOpenDrawer
  useEffect(() => {
    if (isEdit) {
      for (const key in selectedGroupCamera) {
        if (selectedGroupCamera.hasOwnProperty(key)) {
          form.setFieldsValue({
            [key]: selectedGroupCamera[key],
          });
        }
      }
      if (!isEmpty(selectedGroupCamera?.cameraList)) {
        setCameraListInGroup(selectedGroupCamera?.cameraList);
      }
    }
  }, [selectedGroupCamera]);
  //close drawer
  const onClose = () => {
    dispatch({
      type: 'groupcamera/saveIsOpenDrawer',
      payload: false,
    });
    setIsEdit(false);
    setCameraListInGroup([]);
    setSelectedCameraToAdd([]);
    form.resetFields();
  };
  // close drawer choose camera to add list
  const onCloseDrawerAdd = () => {
    setIsOpenDrawerCamera(false);
  };
  const handleSubmit = async (value) => {
    const cameraUuidList = cameraListInGroup?.map((camera) => camera.uuid);
    if (isEdit) {
      await dispatch({
        type: 'groupcamera/updateGroupCamera',
        payload: { ...value, cameraUuidList },
        uuid: cameraGroupUuid,
      });
      await dispatch({
        type: 'groupcamera/saveIsOpenDrawer',
        payload: false,
      });
    } else {
      const payload = {
        ...value,
        cameraUuidList,
        parent: cameraGroupUuid,
      };
      if (isEmpty(payload?.parent)) {
        delete payload.parent;
      }
      dispatch({
        type: 'groupcamera/createNewGroupCamera',
        payload,
      });
    }
  };
  const handleDeleteCameraFromGroup = async (camera) => {
    const index = cameraListInGroup.findIndex((item) => item.uuid === camera.uuid);
    const cameraList = [...cameraListInGroup];
    cameraList.splice(index, 1);
    const cameraUuidList = cameraList?.map((cam) => cam.uuid);
    setCameraListInGroup(cameraList);
    await dispatch({
      type: 'groupcamera/updateGroupCamera',
      payload: { cameraUuidList },
      uuid: cameraGroupUuid,
    });
  };
  const columns = () => {
    if (isEdit && !isOpenDrawerCamera) {
      return [
        {
          title: intl.formatMessage(
            { id: 'view.map.camera_id' },
            {
              cam: '',
            },
          ),
          dataIndex: 'code',
          key: 'code',
          render: (text) => {
            return <SpanCode>{text}</SpanCode>;
          },
        },
        {
          title: intl.formatMessage(
            { id: 'view.map.camera_name' },
            {
              cam: intl.formatMessage({ id: 'camera' }),
            },
          ),
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.province_id',
          }),
          dataIndex: 'provinceName',
          key: 'provinceName',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.district_id',
          }),
          dataIndex: 'districtName',
          key: 'districtName',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.ward_id',
          }),
          dataIndex: 'wardName',
          key: 'wardName',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.address',
          }),
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.zone',
          }),
          dataIndex: 'zoneName',
          key: 'zoneName',
        },
        {
          title: intl.formatMessage({
            id: 'view.common_device.status',
          }),
          dataIndex: 'recordingStatus',
          hideInForm: true,
          valueEnum: {
            0: {
              text: intl.formatMessage({
                id: 'view.user.detail_list.pause',
              }),
              status: 'Default',
            },
            1: {
              text: intl.formatMessage({
                id: 'view.camera.active',
              }),
              status: 'Success',
            },
            2: {
              text: intl.formatMessage({
                id: 'view.camera.error',
              }),
              status: 'Error',
            },
          },
          key: 'cameraStatus',
        },
        {
          title: '',
          key: 'zoneName',
          width: '5%',
          render: (text, record) => {
            return <DeleteOutlined onClick={() => handleDeleteCameraFromGroup(record)} />;
          },
        },
      ];
    } else {
      return [
        {
          title: intl.formatMessage(
            { id: 'view.map.camera_id' },
            {
              cam: '',
            },
          ),
          dataIndex: 'code',
          key: 'code',
          render: (text) => {
            return <SpanCode>{text}</SpanCode>;
          },
        },
        {
          title: intl.formatMessage(
            { id: 'view.map.camera_name' },
            {
              cam: intl.formatMessage({ id: 'camera' }),
            },
          ),
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.province_id',
          }),
          dataIndex: 'provinceName',
          key: 'provinceName',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.district_id',
          }),
          dataIndex: 'districtName',
          key: 'districtName',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.ward_id',
          }),
          dataIndex: 'wardName',
          key: 'wardName',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.address',
          }),
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: intl.formatMessage({
            id: 'view.map.zone',
          }),
          dataIndex: 'zoneName',
          key: 'zoneName',
        },
        {
          title: intl.formatMessage({
            id: 'view.common_device.status',
          }),
          dataIndex: 'recordingStatus',
          hideInForm: true,
          valueEnum: {
            0: {
              text: intl.formatMessage({
                id: 'view.user.detail_list.pause',
              }),
              status: 'Default',
            },
            1: {
              text: intl.formatMessage({
                id: 'view.camera.active',
              }),
              status: 'Success',
            },
            2: {
              text: intl.formatMessage({
                id: 'view.camera.error',
              }),
              status: 'Error',
            },
          },
          key: 'cameraStatus',
        },
      ];
    }
  };
  const handleSelectCamera = async () => {
    dispatch({
      type: 'groupcamera/fetchCameraGroupExistsed',
      payload: {
        page: 1,
        size: 100000,
        checkCameraGroupExists: true,
      },
    });
    setIsOpenDrawerCamera(true);
  };
  const onPaginationChange = (page, size) => {
    dispatch({
      type: 'groupcamera/fetchCameraGroupExistsed',
      payload: {
        page,
        size,
        checkCameraGroupExists: true,
      },
    });
  };
  const handleSubmitAddCameraToGroup = () => {
    setCameraListInGroup((prev) => [...prev, ...selectedCameraToAdd]);
    onCloseDrawerAdd();
  };
  return (
    <>
      <StyledDrawer
        openDrawer={isOpenDrawer}
        onClose={onClose}
        width={'80%'}
        zIndex={1001}
        placement="right"
        extra={
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
            >
              <SaveOutlined />
              {intl.formatMessage({ id: 'view.map.button_save' })}
            </Button>
            <Button onClick={onClose}>
              <CloseOutlined />
              {intl.formatMessage({ id: 'view.map.cancel' })}
            </Button>
          </Space>
        }
      >
        <Form className="bg-grey" form={form} onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={['name']}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                  },
                  {
                    max: 255,
                    message: `${intl.formatMessage({ id: 'noti.255_characters_limit' })}`,
                  },
                ]}
                label={intl.formatMessage({ id: 'view.camera.camera_group_name' })}
              >
                <Input
                  placeholder={intl.formatMessage(
                    { id: 'view.camera.please_enter_new_camera_group_name' },
                    {
                      plsEnter: intl.formatMessage({ id: 'please_enter' }),
                      cam: intl.formatMessage({ id: 'camera' }),
                    },
                  )}
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
            </Col>
            <Col span={12}>
              <Form.Item
                name={['description']}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                  },
                  {
                    max: 255,
                    message: `${intl.formatMessage({ id: 'noti.255_characters_limit' })}`,
                  },
                ]}
                label={intl.formatMessage({ id: 'view.common_device.desc' })}
              >
                <Input.TextArea
                  autoSize
                  placeholder={intl.formatMessage({ id: 'view.user.detail_list.desc' })}
                  onBlur={(e) => {
                    form.setFieldsValue({
                      description: e.target.value.trim(),
                    });
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    form.setFieldsValue({
                      description: e.clipboardData.getData('text').trim(),
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <EditableProTable
          options={false}
          value={cameraListInGroup}
          columns={columns()}
          rowKey="uuid"
          search={false}
          recordCreatorProps={{
            creatorButtonText: intl.formatMessage({
              id: 'view.camera.add_cam_in_group',
            }),
            onClick: () => handleSelectCamera(),
          }}
        />
      </StyledDrawer>
      <StyledDrawer
        openDrawer={isOpenDrawerCamera}
        onClose={onCloseDrawerAdd}
        width={'80%'}
        zIndex={1001}
        placement="right"
        extra={
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                handleSubmitAddCameraToGroup();
              }}
            >
              <SaveOutlined />
              {intl.formatMessage({ id: 'view.map.button_save' })}
            </Button>
            <Button onClick={onCloseDrawerAdd}>
              <CloseOutlined />
              {intl.formatMessage({ id: 'view.map.cancel' })}
            </Button>
          </Space>
        }
      >
        <ProTable
          options={false}
          dataSource={cameraGroupExistsed}
          columns={columns()}
          rowKey="uuid"
          search={false}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedCameraToAdd(selectedRows);
            },
            selectedRowKeys: selectedCameraToAdd?.map((item) => item.uuid),
          }}
          tableAlertRender={false}
          tableAlertOptionRender={false}
          pagination={{
            showQuickJumper: true,
            showTotal: (total) =>
              `${intl.formatMessage({
                id: 'pages.setting-user.list-user.total',
              })} ${total}`,
            total: metadataCameraGroupExistsed?.total,
            pageSize: 20,
          }}
        />
      </StyledDrawer>
    </>
  );
};

function mapStateToProps(state) {
  const { selectedGroupCamera, cameraGroupExistsed, metadataCameraGroupExistsed, isOpenDrawer } =
    state.groupcamera;
  return {
    selectedGroupCamera,
    cameraGroupExistsed,
    metadataCameraGroupExistsed,
    isOpenDrawer,
  };
}
export default connect(mapStateToProps)(GroupCameraDrawer);
