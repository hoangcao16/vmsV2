import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { notify } from '@/components/Notify';
import ExportEventFileApi from '@/services/exportEventFile';
import getBase64 from '@/utils/getBase64';
import permissionCheck from '@/utils/PermissionCheck';
import {
  CloseOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Radio,
  Row,
  Space,
  Tabs,
  Tooltip,
} from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'umi';
import { v4 as uuidV4 } from 'uuid';
import './AddEditUser.less';
import TableCameraPermission from './camera-table/TableCameraPermission';
import TableGroupCameraPermission from './group-camera-table/TableGroupCameraPermission';
import SettingPermissionUser from './SettingPermissionUser';
import { StyledDragger } from './style';
const { TabPane } = Tabs;

const TABS_SELECTED = {
  INFO: '1',
  PERMISSION: '2',
};

const layoutLong = {
  labelCol: { span: 5 },
  wrapperCol: { span: 24 },
};

function AddEditUser({
  dispatch,
  onClose,
  openDrawer,
  handleDeleteUser,
  selectedRecord,
  userAddingUuid,
}) {
  const dateFormat = 'DD/MM/YYYY';
  const intl = useIntl();
  const [form] = Form.useForm();
  const [avatarFileName, setAvatarFileName] = useState(
    selectedRecord?.avatar_base64 || selectedRecord?.avatar_file_name || '',
  );
  const [keyActive, setKeyActive] = useState(TABS_SELECTED.INFO);
  const [isLoading, setLoading] = useState(false);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{intl.formatMessage({ id: 'view.map.add_image' })}</div>
    </div>
  );
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notify('error', 'noti.ERROR', 'noti.upload_file_desc');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notify('error', 'noti.ERROR', 'noti.size_file_desc');
    }
    return isJpgOrPng && isLt2M;
  }

  const uploadImage = async (options) => {
    const { file } = options;
    await ExportEventFileApi.uploadAvatar(uuidV4(), file).then((result) => {
      if (result && result.payload && result.payload.fileUploadInfoList.length > 0) {
        getBase64(file, (imageUrl) => {
          setAvatarFileName(imageUrl);
          //   let fileName = result.data.payload.fileUploadInfoList[0].name;
          //   setAvatarFileName(fileName);
        });
      }
    });
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      phone: values?.phone,
      date_of_birth: moment(values?.date_of_birth).format('DD-MM-YYYY'),
      avatar_file_name: avatarFileName,
    };

    if (isEmpty(selectedRecord)) {
      dispatch({
        type: 'user/create',
        payload: payload,
      });
      setKeyActive(TABS_SELECTED.PERMISSION);
    } else {
      dispatch({
        type: 'user/patch',
        payload: { id: selectedRecord?.uuid, values: { ...payload } },
      });
    }

    // onClose();
  };

  const onChange = (key) => {
    setKeyActive(key);
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
            {isEmpty(userAddingUuid) && keyActive === TABS_SELECTED.INFO && (
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
            )}
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
                cancelText={intl.formatMessage({ id: 'view.penaltyTicket.cancel-a-ticket' })}
                okText={intl.formatMessage({ id: 'view.common_device.agree' })}
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
        <Tabs defaultActiveKey={TABS_SELECTED.INFO} activeKey={keyActive} onChange={onChange}>
          <TabPane
            tab={intl.formatMessage({
              id: 'pages.setting-user.list-user.information',
            })}
            key={TABS_SELECTED.INFO}
            disabled={!isEmpty(userAddingUuid)}
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
                      avatar_file_name: selectedRecord?.avatar_base64 ?? '',
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
                      {...layoutLong}
                    >
                      <StyledDragger
                        accept=".png,.jpeg,.jpg"
                        name="avatar"
                        listType="picture"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        customRequest={uploadImage}
                        onChange={handleChange}
                      >
                        {avatarFileName && avatarFileName !== '' ? (
                          <img className="avatar__image" src={avatarFileName} alt="avatar" />
                        ) : (
                          uploadButton
                        )}
                      </StyledDragger>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <MSFormItem
                      {...layoutLong}
                      label={intl.formatMessage({
                        id: 'view.ai_humans.name',
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

                  <Col span={24}>
                    <MSFormItem
                      {...layoutLong}
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
                  <Col span={24}>
                    <MSFormItem
                      {...layoutLong}
                      label={intl.formatMessage({
                        id: 'pages.setting-user.list-user.position',
                      })}
                      type="input"
                      name="position"
                      minLength={5}
                      maxLength={255}
                      required={true}
                    >
                      <Input
                        autoComplete="new-password"
                        onBlur={(e) => {
                          form.setFieldsValue({
                            position: e.target.value.trim(),
                          });
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          form.setFieldsValue({
                            position: e.clipboardData.getData('text').trim(),
                          });
                        }}
                      />
                    </MSFormItem>
                  </Col>
                  <Form.Item
                    hidden={true}
                    name={['avatar_file_name']}
                    rules={[{ required: false }]}
                  >
                    <Input
                      type="hidden"
                      onBlur={(e) => {
                        form.setFieldsValue({
                          ['avatar_file_name']: e.target.value.trim(),
                        });
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        form.setFieldsValue({
                          ['avatar_file_name']: e.clipboardData.getData('text').trim(),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} className="pb-1">
                  <Col span={24}>
                    <Form.Item
                      name={['phone']}
                      {...layoutLong}
                      label={intl.formatMessage({
                        id: 'pages.setting-user.list-user.phone',
                      })}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            const valiValue = getFieldValue(['phone']);

                            if (!valiValue.startsWith('0')) {
                              if (valiValue.length < 9 && valiValue.length > 0) {
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
                          required: true,
                          message: intl.formatMessage({
                            id: 'pages.setting-user.list-user.require',
                          }),
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        autoComplete="new-password"
                        onBlur={(e) => {
                          form.setFieldsValue({
                            ['phone']: e.target.value.trim(),
                          });
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          form.setFieldsValue({
                            ['phone']: e.clipboardData.getData('text').trim(),
                          });
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      {...layoutLong}
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
                      <DatePicker
                        format={dateFormat}
                        style={{ width: '100%' }}
                        disabledDate={disabledDate}
                        placeholder="DD/MM/YYYY"
                      />
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
                      {...layoutLong}
                    >
                      <Input
                        autoComplete="new-password"
                        onBlur={(e) => {
                          form.setFieldsValue({
                            email: e.target.value.trim(),
                          });
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          form.setFieldsValue({
                            email: e.clipboardData.getData('text').trim(),
                          });
                        }}
                      />
                    </MSFormItem>
                  </Col>
                  {isEmpty(selectedRecord) && (
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
                        {...layoutLong}
                      >
                        <Input
                          type="password"
                          autoComplete="new-password"
                          onBlur={(e) => {
                            form.setFieldsValue({
                              password: e.target.value.trim(),
                            });
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            form.setFieldsValue({
                              password: e.clipboardData.getData('text').trim(),
                            });
                          }}
                        />
                      </MSFormItem>
                    </Col>
                  )}
                  <Col span={24}>
                    <MSFormItem
                      {...layoutLong}
                      label={intl.formatMessage({
                        id: 'pages.setting-user.list-user.unit',
                      })}
                      type="input"
                      name="unit"
                      minLength={5}
                      maxLength={255}
                      required={true}
                    >
                      <Input
                        autoComplete="new-password"
                        onBlur={(e) => {
                          form.setFieldsValue({
                            unit: e.target.value.trim(),
                          });
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          form.setFieldsValue({
                            unit: e.clipboardData.getData('text').trim(),
                          });
                        }}
                      />
                    </MSFormItem>
                  </Col>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane
            tab={intl.formatMessage({
              id: 'pages.setting-user.list-user.permission',
            })}
            key={TABS_SELECTED.PERMISSION}
            disabled={isEmpty(selectedRecord) && isEmpty(userAddingUuid)}
          >
            <SettingPermissionUser id={userAddingUuid ?? selectedRecord?.uuid} />
            <TableGroupCameraPermission id={userAddingUuid ?? selectedRecord?.uuid} />
            <TableCameraPermission id={userAddingUuid ?? selectedRecord?.uuid} />
          </TabPane>
        </Tabs>
      </MSCustomizeDrawer>
    </>
  );
}

function mapStateToProps(state) {
  const { userAddingUuid } = state.user;

  return {
    userAddingUuid,
  };
}

export default connect(mapStateToProps)(AddEditUser);
