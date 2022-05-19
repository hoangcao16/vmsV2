import MSFormItem from '@/components/Form/Item';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React from 'react';
import { useIntl } from 'umi';
const { Option } = Select;
function AddUser({ dispatch, onClose }) {
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      phone: values?.phone,
      date_of_birth: moment(values?.date_of_birth).format('DD-MM-YYYY'),
    };

    dispatch({
      type: 'user/create',
      payload: payload,
    });

    onClose();
  };
  return (
    <>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={24}>
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
          <Col span={24}>
            <MSFormItem
              label={intl.formatMessage({
                id: 'pages.setting-user.list-user.sex',
              })}
              type="select"
              name="sex"
              required={true}
            >
              <Select placeholder="Chọn giới tính">
                <Option value={0}>
                  {intl.formatMessage({
                    id: 'pages.setting-user.list-user.male',
                  })}
                </Option>
                <Option value={1}>
                  {intl.formatMessage({
                    id: 'pages.setting-user.list-user.female',
                  })}
                </Option>
              </Select>
            </MSFormItem>
          </Col>
          <Col span={24}>
            <Form.Item
              name="date_of_birth"
              label={intl.formatMessage({
                id: 'pages.setting-user.list-user.date_of_birth',
              })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'pages.setting-user.list-user.require',
                  }),
                },
              ]}
            >
              <DatePicker inputReadOnly={true} format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={['phone']}
              label={intl.formatMessage({
                id: 'pages.setting-user.list-user.phone',
              })}
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const valiValue = getFieldValue(['phone']);
                    if (!valiValue.length) {
                      return Promise.reject(
                        intl.formatMessage({
                          id: 'pages.setting-user.list-user.require',
                        }),
                      );
                    }

                    if (!valiValue.startsWith('0')) {
                      if (valiValue.length < 9) {
                        return Promise.reject(new Error('Tối thiểu 9 ký tự'));
                      } else if (valiValue.length > 19) {
                        return Promise.reject(new Error('Tối đa 19 ký tự'));
                      }
                    } else {
                      if (valiValue.length < 10) {
                        return Promise.reject(new Error('Tối thiểu 10 ký tự'));
                      } else if (valiValue.length > 20) {
                        return Promise.reject(new Error('Tối đa 20 ký tự'));
                      }
                    }

                    return Promise.resolve();
                  },
                }),
                {
                  required: intl.formatMessage({
                    id: 'pages.setting-user.list-user.require',
                  }),
                },
              ]}
            >
              <Input type="number" autoComplete="new-password" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <MSFormItem
              label="Email"
              type="email"
              name="email"
              minLength={5}
              maxLength={255}
              required={true}
            >
              <Input autoComplete="new-password" />
            </MSFormItem>
          </Col>
          <Col span={24}>
            <MSFormItem
              label={intl.formatMessage({
                id: 'pages.setting-user.list-user.password',
              })}
              type="input"
              name="password"
              minLength={8}
              maxLength={255}
              required={true}
            >
              <Input type="password" autoComplete="new-password" />
            </MSFormItem>
          </Col>
        </Row>
      </Form>
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
        <Button htmlType="submit" onClick={handleSubmit} type="primary">
          {intl.formatMessage({
            id: 'pages.setting-user.list-user.add',
          })}
        </Button>
      </div>
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.user,
  };
}

export default connect(mapStateToProps)(AddUser);
