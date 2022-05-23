import MSFormItem from '@/components/Form/Item';
import { STORAGE } from '@/constants/common';
import { Col, Form, Radio, Row, Select } from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';

function SettingPermissionUser({
  id,
  dispatch,
  listAllRole,
  listAllUserGroup,
  rolesOfUser,
  groupsOfUser,
}) {
  const [value, setValue] = useState(0);
  const intl = useIntl();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch({
      type: 'userSettingData/fetchAllData',
      payload: {
        uuid: id ?? localStorage.getItem(STORAGE.USER_UUID_SELECTED),
      },
    });
  }, [id]);

  const handleSubmit = () => {};

  const onChangeData = async (e) => {
    let data = {
      user_uuid: id,
    };

    if (value === 0) {
      data.group_uuids = e;
      dispatch({
        type: 'userSettingData/setGroupForUser',
        payload: data,
      });
    }
    if (value === 1) {
      data.role_uuids = e;
      dispatch({
        type: 'userSettingData/setRoleForUser',
        payload: data,
      });
    }
  };

  if (!isEmpty(groupsOfUser)) {
    value === 0 && form.setFieldsValue({ group_uuid: groupsOfUser });
  }

  if (!isEmpty(listAllUserGroup) && isEmpty(groupsOfUser)) {
    value === 0 && form.setFieldsValue({ group_uuid: [] });
  }

  if (!isEmpty(rolesOfUser)) {
    value === 1 && form.setFieldsValue({ role_uuid: rolesOfUser });
  }

  if (!isEmpty(listAllRole) && isEmpty(rolesOfUser)) {
    value === 1 && form.setFieldsValue({ role_uuid: [] });
  }

  return (
    <div>
      <h4>
        {intl.formatMessage({
          id: 'pages.setting-user.list-user.permission',
        })}
      </h4>

      <Form
        // layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={value === 0 ? groupsOfUser : rolesOfUser}
      >
        <Row gutter={[18, 18]}>
          <Col span={6} className="pb-1">
            <Col span={24}>
              <MSFormItem
                label={intl.formatMessage({
                  id: 'pages.setting-user.list-user.permission-by',
                })}
                type="select"
                name="permissionBy"
                required={true}
              >
                <Radio.Group
                  onChange={(e) => {
                    e.preventDefault();
                    form.setFieldsValue({
                      permissionBy: e.target.value,
                    });

                    setValue(e.target.value);
                  }}
                  value={value}
                  defaultValue={0}
                >
                  <Radio value={0}>
                    {intl.formatMessage({
                      id: 'pages.setting-user.list-user.group-user',
                    })}
                  </Radio>
                  <Radio value={1}>
                    {intl.formatMessage({
                      id: 'pages.setting-user.list-user.role',
                    })}
                  </Radio>
                </Radio.Group>
              </MSFormItem>
            </Col>
          </Col>
          {value === 0 ? (
            <Col span={12}>
              <Col span={24}>
                <Form.Item
                  name={['group_uuid']}
                  label={intl.formatMessage({
                    id: 'pages.setting-user.list-user.group-user',
                  })}
                >
                  <Select
                    showSearch
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(e) => onChangeData(e)}
                    filterSort={(optionA, optionB) =>
                      optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
                    }
                  >
                    {listAllUserGroup?.map((item) => (
                      <Select.Option key={item.name} value={item.uuid}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Col>
          ) : (
            <Col span={12}>
              <Col span={24}>
                <Form.Item
                  name={['role_uuid']}
                  label={intl.formatMessage({
                    id: 'pages.setting-user.list-user.group-user',
                  })}
                >
                  <Select
                    showSearch
                    mode="multiple"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(e) => onChangeData(e)}
                    filterSort={(optionA, optionB) =>
                      optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
                    }
                  >
                    {listAllRole?.map((item) => (
                      <Select.Option key={item.name} value={item.uuid}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
}

function mapStateToProps(state) {
  const { listAllRole, listAllUserGroup, rolesOfUser, groupsOfUser } = state.userSettingData;
  return {
    loading: state.loading.models.userSettingData,
    listAllRole,
    listAllUserGroup,
    rolesOfUser: rolesOfUser.map((r) => r.role_uuid),
    groupsOfUser: groupsOfUser.map((r) => r.group_uuid),
  };
}

export default connect(mapStateToProps)(SettingPermissionUser);
