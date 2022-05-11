import MSFormItem from '@/components/Form/Item';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
const { Option } = Select;
function AddUserContent({ dispatch, onClose }) {
  const [form] = Form.useForm();
  const handleSubmit = () => {
    const value = form.getFieldsValue(true);

    const payload = {
      ...value,
      phone: value?.phone,
      date_of_birth: moment(value?.date_of_birth).format('DD-MM-YYYY'),
    };

    dispatch({
      type: 'user/create',
      payload: payload,
    });

    //đóng drawer
    onClose();
  };
  return (
    <>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <MSFormItem
              label="Tên"
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
            <MSFormItem label="Giới tính" type="select" name="sex" required={true}>
              <Select placeholder="Chọn giới tính">
                <Option value={0}>Nam</Option>
                <Option value={1}>Nữ</Option>
              </Select>
            </MSFormItem>
          </Col>
          <Col span={24}>
            <Form.Item
              name="date_of_birth"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Trường này bắt buộc' }]}
            >
              <DatePicker
                placeholder="Ngày/Tháng/Năm"
                inputReadOnly={true}
                format="DD/MM/YYYY"
                width="100%"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name={['phone']}
              label="Số điện thoại"
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const valiValue = getFieldValue(['phone']);
                    if (!valiValue.length) {
                      return Promise.reject('Trường này bắt buộc');
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
                { required: 'Trường này bắt buộc' },
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
              label="Mật khẩu"
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
          Thêm
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

export default connect(mapStateToProps)(AddUserContent);
