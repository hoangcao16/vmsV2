import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import UserApi from '@/services/user/UserApi';
import permissionCheck from '@/utils/PermissionCheck';
import {
  CloseOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Popconfirm, Radio, Row, Space, Tooltip } from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import useHandleUploadFile from '../../../../../hooks/useHandleUploadFile';
import './AddEditUser.less';
import { StyledDragger } from './style';

function AddEditUser({ dispatch, onClose, openDrawer, handleDeleteUser, selectedRecord }) {
  const dateFormat = 'DD/MM/YYYY';
  const intl = useIntl();
  const [form] = Form.useForm();
  const [imgFile, setImgFile] = useState('');
  const [imageUrl, imgFileName, loading, handleChange, uploadImage, beforeUpload] =
    useHandleUploadFile(imgFile);

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    UserApi.getDetailUser(selectedRecord?.uuid).then(async (res) => {
      setImgFile(res?.payload?.avatar_file_name);
    });
  }, []);

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{intl.formatMessage({ id: 'view.map.add_image' })}</div>
    </div>
  );

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      phone: values?.phone,
      date_of_birth: moment(values?.date_of_birth).format('DD-MM-YYYY'),
      avatar_file_name: imgFileName,
    };

    if (isEmpty(selectedRecord)) {
      dispatch({
        type: 'user/create',
        payload: payload,
      });
    } else {
      dispatch({
        type: 'user/patch',
        payload: { id: selectedRecord?.uuid, values: { ...payload } },
      });
    }

    onClose();
  };
  return (
    <>
      <MSCustomizeDrawer
        openDrawer={openDrawer}
        onClose={onClose}
        width={'80%'}
        zIndex={1001}
        title={intl.formatMessage({
          id: isEmpty(selectedRecord)
            ? 'pages.setting-user.list-user.new-user'
            : 'pages.setting-user.list-user.edit-user',
        })}
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

            {!isEmpty(selectedRecord) && permissionCheck('delete_user') && (
              <Popconfirm
                title={intl.formatMessage({
                  id: 'pages.setting-user.list-user.delete-confirm',
                })}
                onConfirm={() => {
                  handleDeleteUser(selectedRecord?.uuid);
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
        {' '}
        <Form
          // layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={
            !isEmpty(selectedRecord)
              ? {
                  ...selectedRecord,
                  date_of_birth: moment(selectedRecord?.date_of_birth, dateFormat),
                }
              : {}
          }
        >
          <Row gutter={[18, 18]}>
            <Col span={12} className="pb-1">
              <Col span={24}>
                <Form.Item
                  label={intl.formatMessage({
                    id: 'pages.setting-user.list-user.imageUrl',
                  })}
                >
                  <StyledDragger
                    accept=".png,.jpeg,.jpg"
                    name="avatar"
                    listType="picture"
                    className="camera-image"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    customRequest={uploadImage}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      uploadButton
                    )}
                  </StyledDragger>
                </Form.Item>
              </Col>

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
                  <Radio.Group
                    onChange={(e) => {
                      e.preventDefault();
                      form.setFieldsValue({
                        sex: e.target.value,
                      });
                    }}
                    defaultValue={selectedRecord?.sex}
                  >
                    <Radio value={0}>
                      {intl.formatMessage({
                        id: 'pages.setting-user.list-user.male',
                      })}
                    </Radio>
                    <Radio value={1}>
                      {intl.formatMessage({
                        id: 'pages.setting-user.list-user.female',
                      })}
                    </Radio>
                  </Radio.Group>
                </MSFormItem>
              </Col>
              <Form.Item hidden={true} name={['avatar_file_name']} rules={[{ required: false }]}>
                <Input type="hidden" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  <DatePicker inputReadOnly={true} format={dateFormat} style={{ width: '100%' }} />
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
            </Col>
          </Row>
        </Form>
      </MSCustomizeDrawer>
    </>
  );
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.user,
  };
}

export default connect(mapStateToProps)(AddEditUser);
