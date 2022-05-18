import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { Button, Col, Form, Input, Row } from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import React from 'react';
import { useIntl } from 'umi';
import TableCameraPermission from './camera-table/TableCameraPermission';
import TableGroupCameraPermission from './group-camera-table/TableGroupCameraPermission';
import TablePermissionInGroup from './TablePermissionInGroup';
import TableUserInGroup from './TableUserInGroup';

function AddEditUserGroup({ dispatch, onClose, openDrawer, selectedRecord }) {
  const intl = useIntl();

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const payload = {
      ...values,
    };

    if (isEmpty(selectedRecord)) {
      dispatch({
        type: 'userGroup/create',
        payload: payload,
      });
    } else {
      dispatch({
        type: 'userGroup/patch',
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
        width={isEmpty(selectedRecord) ? '20%' : '80%'}
        zIndex={1002}
        title={
          isEmpty(selectedRecord)
            ? intl.formatMessage({
                id: 'pages.setting-user.list-user.add-user-group',
              })
            : intl.formatMessage({
                id: 'pages.setting-user.list-user.edit-user-group',
              })
        }
        placement="right"
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
                <Input autoComplete="new-password" />
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
                <Input autoComplete="new-password" />
              </MSFormItem>
            </Col>
          </Row>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button htmlType="submit" type="primary">
              {isEmpty(selectedRecord)
                ? intl.formatMessage({
                    id: 'pages.setting-user.list-user.add',
                  })
                : intl.formatMessage({
                    id: 'pages.setting-user.list-user.edit',
                  })}
            </Button>
          </div>
        </Form>
        {!isEmpty(selectedRecord) && (
          <>
            <TableUserInGroup id={selectedRecord?.uuid} />
            <TablePermissionInGroup id={selectedRecord?.uuid} />
            <TableGroupCameraPermission id={selectedRecord?.uuid} />
            <TableCameraPermission id={selectedRecord?.uuid} />
          </>
        )}
      </MSCustomizeDrawer>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.userGroup,
  };
}

export default connect(mapStateToProps)(AddEditUserGroup);
