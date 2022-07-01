import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import permissionCheck from '@/utils/PermissionCheck';
import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Popconfirm, Row, Space, Tooltip } from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import React from 'react';
import { useIntl } from 'umi';
import TableRoleCameraPermission from './camera-table/TableRoleCameraPermission';
import TableRoleGroupCameraPermission from './group-camera-table/TableRoleGroupCameraPermission';
import TablePermissionInRole from './TablePermissionInRole';

function AddEditUserRole({ dispatch, onClose, openDrawer, selectedRecord, handleDeleteRole }) {
  const intl = useIntl();

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const payload = {
      ...values,
    };

    if (isEmpty(selectedRecord)) {
      dispatch({
        type: 'userRole/create',
        payload: payload,
      });
    } else {
      dispatch({
        type: 'userRole/patch',
        payload: { id: selectedRecord?.uuid, values: { ...payload } },
      });
    }

    //đóng drawer
    onClose();
  };
  return (
    <div>
      <MSCustomizeDrawer
        openDrawer={openDrawer}
        onClose={onClose}
        width={isEmpty(selectedRecord) ? '25%' : '80%'}
        zIndex={1002}
        title={
          isEmpty(selectedRecord)
            ? intl.formatMessage({
                id: 'pages.setting-user.list-user.add-role',
              })
            : intl.formatMessage({
                id: 'pages.setting-user.list-user.edit-role',
              })
        }
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

            {!isEmpty(selectedRecord) && permissionCheck('delete_role') && (
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.setting-user.list-user.delete-confirm',
                })}
                onConfirm={() => {
                  handleDeleteRole(selectedRecord?.uuid);
                }}
                cancelText="Cancel"
                okText="Ok"
              >
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'pages.setting-user.list-user.delete',
                  })}
                  arrowPointAtCenter={true}
                >
                  <Button type="danger">
                    <DeleteOutlined />
                    {intl.formatMessage({ id: 'pages.setting-user.list-user.delete' })}
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={selectedRecord ?? {}}
        >
          <Row gutter={16}>
            <Col span={isEmpty(selectedRecord) ? 24 : 12}>
              <MSFormItem
                label={intl.formatMessage({
                  id: 'pages.setting-user.list-user.name',
                })}
                type="input"
                name="name"
                minLength={5}
                maxLength={255}
                required={true}
              >
                <Input
                  autoComplete="new-password"
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
              </MSFormItem>
            </Col>
            <Col span={isEmpty(selectedRecord) ? 24 : 12}>
              <MSFormItem
                label={intl.formatMessage({
                  id: 'pages.setting-user.list-user.description',
                })}
                type="input"
                name="description"
                minLength={5}
                maxLength={255}
                required={true}
              >
                <Input
                  autoComplete="new-password"
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
              </MSFormItem>
            </Col>
          </Row>
        </Form>

        {!isEmpty(selectedRecord) && (
          <>
            <TablePermissionInRole id={selectedRecord?.uuid} />
            <TableRoleGroupCameraPermission id={selectedRecord?.uuid} />
            <TableRoleCameraPermission id={selectedRecord?.uuid} />
          </>
        )}
      </MSCustomizeDrawer>
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.userRole;
  return {
    loading: state.loading.models.userRole,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(AddEditUserRole);
