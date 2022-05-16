import { connect } from 'dva';
import { useState, useEffect } from 'react';
import { StyledDrawer, StyledSpace } from './style';
import { Space, Button, Card, Row, Col, Form, Input, Upload, Avatar, Select } from 'antd';
import { useIntl } from 'umi';
import {
  UserOutlined,
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import MapAddCamera from '../map';
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import { NotificationError } from '@/components/Notif/NotifCustomize';
import AddressApi from '@/services/address/AddressApi';
import CameraApi from '@/services/camera/CameraApi';
import ZoneApi from '@/services/zone/ZoneApi';
import AdDivisionApi from '@/services/advision/AdDivision';
import VendorApi from '@/services/vendor/VendorApi';
import TagApi from '@/services/tag/tagApi';
const { Dragger } = Upload;
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 8 },
};
const AddCamera = ({ openDrawer, setIsAddNewDrawer }) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [cameraTypesOptions, setCameraTypesOptions] = useState([]);
  const [groupCameraOptions, setGroupCameraOptions] = useState([]);
  const [zonesOptions, setZonesOptions] = useState([]);
  const [adDivisionsOptions, setAdDivisionsOptions] = useState([]);
  const [vendorsOptions, setVendorsOptions] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFileName, setAvatarFileName] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [provinceId, setProvinceId] = useState(null);
  const [districts, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [wards, setWard] = useState([]);
  //get Data first mount
  useEffect(() => {
    const data = {
      name: '',
      id: '',
      provinceId: '',
      districtId: '',
    };
    AddressApi.getAllProvinces().then((res) => {
      setProvinces(res?.data?.payload);
    });

    CameraApi.getAllCameraTypes(data).then((res) => {
      setCameraTypesOptions(res?.data?.payload);
    });
    CameraApi.getAllGroupCamera(data).then((res) => {
      setGroupCameraOptions(res?.data?.payload);
    });
    ZoneApi.getAllZones(data).then((res) => {
      setZonesOptions(res?.data?.payload);
    });
    AdDivisionApi.getAllAdDivision(data).then((res) => {
      setAdDivisionsOptions(res?.data?.payload);
    });
    VendorApi.getAllVendor(data).then((res) => {
      setVendorsOptions(res?.data?.payload);
    });
    TagApi.getAllTags(data).then((res) => {
      setTagsOptions(res?.data?.payload);
    });
  }, []);
  // get districts when select province
  useEffect(() => {
    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then((res) => {
        setDistrict(res?.data?.payload);
      });
      setDistrictId(null);
    }
  }, [provinceId]);
  useEffect(() => {
    if (districtId) {
      AddressApi.getWardByDistrictId(districtId).then((res) => {
        setWard(res?.data?.payload);
      });
    } else {
      setWard([]);
    }
  }, [districtId]);
  const onChangeCity = (cityId) => {
    setProvinceId(cityId);
    form.setFieldsValue({ districtId: null, wardId: null });
  };
  const onChangeDistrict = (districtId) => {
    setDistrictId(districtId);
    form.setFieldsValue({ wardId: null });
  };
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
  };
  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{'view.map.add_image'}</div>
    </div>
  );
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      NotificationError('', `${intl.formatMessage({ id: 'noti.upload_file_desc' })}`);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      NotificationError('', `${intl.formatMessage({ id: 'noti.upload_file_desc' })}`);
    }
    return isJpgOrPng && isLt2M;
  }
  const uploadImage = async (options) => {
    const { file } = options;
    await ExportEventFileApi.uploadAvatar(uuidV4(), file).then((result) => {
      if (result.data && result.data.payload && result.data.payload.fileUploadInfoList.length > 0) {
        getBase64(file, (imageUrl) => {
          setLoading(false);
          setAvatarUrl(imageUrl);
          let fileName = result.data.payload.fileUploadInfoList[0].name;

          // handleSubmit({ avatar_file_name: fileName });
          setAvatarFileName(fileName);

          //phần này set vào state để push lên
        });
      }
    });
  };
  const onClose = () => {
    setIsAddNewDrawer(false);
  };
  const DraggerProps = {
    name: 'avatar',
    accept: '.png,.jpeg,.jpg',
    listType: 'picture-card',
    beforeUpload: { beforeUpload },
    customRequest: { uploadImage },
    onChange: { handleChange },
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    // onChange(info) {
    //   const { status } = info.file;
    //   if (status !== 'uploading') {
    //     console.log(info.file, info.fileList);
    //   }
    //   if (status === 'done') {
    //     message.success(`${info.file.name} file uploaded successfully.`);
    //   } else if (status === 'error') {
    //     message.error(`${info.file.name} file upload failed.`);
    //   }
    // },
    // onDrop(e) {
    //   console.log('Dropped files', e.dataTransfer.files);
    // },
  };
  const handleSubmit = () => {};
  return (
    <StyledDrawer
      openDrawer={openDrawer}
      onClose={onClose}
      width={'70%'}
      zIndex={1001}
      placement="right"
      extra={
        <Space>
          <Button type="primary" onClick={onClose}>
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
      <Card title="Thêm camera">
        <Form
          className="bg-grey"
          form={form}
          {...formItemLayout}
          layout="horizontal"
          onFinish={handleSubmit}
        >
          <Row>
            <Col span={10}>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name={['code']}
                    labelCol={10}
                    wrapperCol={24}
                    label={intl.formatMessage(
                      { id: 'view.map.camera_id' },
                      {
                        cam: intl.formatMessage({
                          id: 'camera',
                        }),
                      },
                    )}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'view.map.required_field',
                        }),
                      },
                    ]}
                  >
                    <Input
                      maxLength={255}
                      placeholder={intl.formatMessage(
                        {
                          id: 'view.map.please_enter_camera_id',
                        },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                          cam: intl.formatMessage({
                            id: 'camera',
                          }),
                        },
                      )}
                      onBlur={(e) => {
                        form.setFieldsValue({
                          code: e.target.value.trim(),
                        });
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        form.setFieldsValue({
                          code: e.clipboardData.getData('text').trim(),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    labelCol={8}
                    wrapperCol={16}
                    name={['name']}
                    label={intl.formatMessage(
                      {
                        id: 'view.camera.camera_name',
                      },
                      {
                        cam: intl.formatMessage({
                          id: 'camera',
                        }),
                      },
                    )}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'view.map.required_field',
                        }),
                      },
                    ]}
                  >
                    <Input
                      maxLength={255}
                      placeholder={intl.formatMessage(
                        {
                          id: 'view.map.please_enter_camera_name',
                        },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                          cam: intl.formatMessage({
                            id: 'camera',
                          }),
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
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <StyledSpace>
                    <Form.Item
                      labelCol={8}
                      wrapperCol={24}
                      label={intl.formatMessage(
                        {
                          id: 'view.camera.group_camera',
                        },
                        {
                          cam: intl.formatMessage({
                            id: 'camera',
                          }),
                        },
                      )}
                      name={['cameraTypeUuid']}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'view.map.required_field',
                          }),
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        dataSource={groupCameraOptions}
                        filterOption={filterOption}
                        options={normalizeOptions('name', 'uuid', groupCameraOptions)}
                        placeholder={intl.formatMessage(
                          {
                            id: 'view.camera.please_choose_group_camera',
                          },
                          {
                            cam: intl.formatMessage({
                              id: 'camera',
                            }),
                          },
                        )}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      />
                    </Form.Item>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => console.log('click')}
                    />
                  </StyledSpace>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <StyledSpace>
                    <Form.Item
                      labelCol={8}
                      wrapperCol={24}
                      label={intl.formatMessage(
                        {
                          id: 'view.camera.camera_type',
                        },
                        {
                          cam: intl.formatMessage({
                            id: 'camera',
                          }),
                        },
                      )}
                      name={['cameraTypeUuid']}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'view.map.required_field',
                          }),
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        dataSource={cameraTypesOptions}
                        filterOption={filterOption}
                        options={normalizeOptions('name', 'uuid', cameraTypesOptions)}
                        placeholder={intl.formatMessage(
                          {
                            id: 'view.map.please_choose_camera_type',
                          },
                          {
                            cam: intl.formatMessage({
                              id: 'camera',
                            }),
                          },
                        )}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      />
                    </Form.Item>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => console.log('click')}
                    />
                  </StyledSpace>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <StyledSpace>
                    <Form.Item
                      labelCol={8}
                      wrapperCol={16}
                      name={['vendorUuid']}
                      label={intl.formatMessage({
                        id: 'view.map.vendor',
                      })}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'view.map.required_field',
                          }),
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        dataSource={vendorsOptions}
                        filterOption={filterOption}
                        options={normalizeOptions('name', 'uuid', vendorsOptions)}
                        placeholder={intl.formatMessage({
                          id: 'view.map.choose_vendor',
                        })}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      />
                    </Form.Item>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => console.log('click')}
                    />
                  </StyledSpace>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    labelCol={8}
                    wrapperCol={16}
                    label={intl.formatMessage({
                      id: 'view.map.port',
                    })}
                    name={['port']}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'view.map.required_field',
                        }),
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          const data = getFieldValue(['port']);
                          const regex =
                            /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/;
                          if (data) {
                            if (isFinite(data) && regex.test(data)) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject(
                                intl.formatMessage({
                                  id: 'view.storage.invalid_format',
                                }),
                              );
                            }
                          } else {
                            return Promise.resolve();
                          }
                        },
                      }),
                    ]}
                  >
                    <Input
                      placeholder={intl.formatMessage(
                        {
                          id: 'view.map.please_enter_port',
                        },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                        },
                      )}
                      onBlur={(e) => {
                        form.setFieldsValue({
                          port: e.target.value.trim(),
                        });
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        form.setFieldsValue({
                          port: e.clipboardData.getData('text').trim(),
                        });
                      }}
                      maxLength={255}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    labelCol={8}
                    wrapperCol={16}
                    label={intl.formatMessage({
                      id: 'view.map.original_url',
                    })}
                    name={['cameraUrl']}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'view.map.required_field',
                        }),
                      },
                    ]}
                  >
                    <Input
                      placeholder={intl.formatMessage(
                        {
                          id: 'view.map.please_enter_original_url',
                        },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                        },
                      )}
                      onBlur={(e) => {
                        form.setFieldsValue({
                          cameraUrl: e.target.value.trim(),
                        });
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        form.setFieldsValue({
                          cameraUrl: e.clipboardData.getData('text').trim(),
                        });
                      }}
                      maxLength={2000}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    labelCol={8}
                    wrapperCol={16}
                    label={intl.formatMessage({
                      id: 'view.map.map',
                    })}
                    name={['cameraUrl']}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'view.map.required_field',
                        }),
                      },
                    ]}
                  >
                    <Input.Search
                      placeholder={intl.formatMessage(
                        {
                          id: 'view.map.please_choose_location',
                        },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                        },
                      )}
                      onBlur={(e) => {
                        form.setFieldsValue({
                          cameraUrl: e.target.value.trim(),
                        });
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        form.setFieldsValue({
                          cameraUrl: e.clipboardData.getData('text').trim(),
                        });
                      }}
                      maxLength={2000}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <MapAddCamera />
                </Col>
              </Row>
            </Col>
            <Col span={10} offset={4}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['provinceId']}
                    label={intl.formatMessage({
                      id: 'view.map.province_id',
                    })}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'view.map.required_field',
                        }),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      dataSource={provinces}
                      onChange={(cityId) => onChangeCity(cityId)}
                      filterOption={filterOption}
                      options={normalizeOptions('name', 'provinceId', provinces)}
                      placeholder={intl.formatMessage({
                        id: 'view.map.province_id',
                      })}
                      allowClear
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['districtId']}
                    label={intl.formatMessage({
                      id: 'view.map.district_id',
                    })}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'view.map.required_field',
                        }),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      dataSource={districts}
                      onChange={(districtId) => onChangeDistrict(districtId)}
                      filterOption={filterOption}
                      options={normalizeOptions('name', 'districtId', districts)}
                      placeholder={intl.formatMessage({
                        id: 'view.map.district_id',
                      })}
                      allowClear
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['wardId']}
                    label={intl.formatMessage({
                      id: 'view.map.ward_id',
                    })}
                    rules={[
                      {
                        required: true,
                        message: `${intl.formatMessage({
                          id: 'view.map.required_field',
                        })}`,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      dataSource={wards}
                      filterOption={filterOption}
                      options={normalizeOptions('name', 'id', wards)}
                      placeholder={intl.formatMessage({
                        id: 'view.map.ward_id',
                      })}
                      allowClear
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['address']}
                    label={intl.formatMessage({
                      id: 'view.storage.street',
                    })}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'view.map.required_field',
                        }),
                      },
                    ]}
                  >
                    <Input
                      maxLength={255}
                      placeholder={intl.formatMessage(
                        {
                          id: 'view.map.please_enter_street',
                        },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                        },
                      )}
                      onBlur={(e) => {
                        form.setFieldsValue({
                          address: e.target.value.trim(),
                        });
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        form.setFieldsValue({
                          address: e.clipboardData.getData('text').trim(),
                        });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <StyledSpace>
                    <Form.Item
                      labelCol={8}
                      wrapperCol={16}
                      label={intl.formatMessage({
                        id: 'view.map.zone',
                      })}
                      name={['zoneUuid']}
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'view.map.required_field',
                          }),
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        dataSource={zonesOptions}
                        filterOption={filterOption}
                        options={normalizeOptions('name', 'uuid', zonesOptions)}
                        placeholder={intl.formatMessage(
                          {
                            id: 'view.map.choose_zone',
                          },
                          {
                            plsEnter: intl.formatMessage({
                              id: 'please_enter',
                            }),
                          },
                        )}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      />
                    </Form.Item>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => console.log('click')}
                    />
                  </StyledSpace>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <StyledSpace>
                    <Form.Item
                      labelCol={8}
                      wrapperCol={16}
                      label={intl.formatMessage({
                        id: 'view.map.administrative_unit',
                      })}
                      name={['administrativeUnitUuid']}
                    >
                      <Select
                        allowClear
                        showSearch
                        dataSource={adDivisionsOptions}
                        filterOption={filterOption}
                        options={normalizeOptions('name', 'uuid', adDivisionsOptions)}
                        placeholder={intl.formatMessage({
                          id: 'view.map.please_choose_administrative_unit',
                        })}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      />
                    </Form.Item>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => console.log('click')}
                    />
                  </StyledSpace>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    labelCol={8}
                    wrapperCol={16}
                    label={intl.formatMessage({
                      id: 'view.map.hls_url',
                    })}
                    name={['hlsUrl']}
                  >
                    <Input
                      placeholder={intl.formatMessage(
                        {
                          id: 'view.map.please_enter_hls_url',
                        },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                        },
                      )}
                      onBlur={(e) => {
                        form.setFieldsValue({
                          hlsUrl: e.target.value.trim(),
                        });
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        form.setFieldsValue({
                          hlsUrl: e.clipboardData.getData('text').trim(),
                        });
                      }}
                      maxLength={2000}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <StyledSpace>
                    <Form.Item
                      labelCol={8}
                      wrapperCol={16}
                      label={intl.formatMessage({
                        id: 'view.category.tags',
                      })}
                      name={['tags']}
                      rules={[]}
                    >
                      <Select
                        showSearch
                        dataSource={tagsOptions}
                        filterOption={filterOption}
                        options={normalizeOptions('key', 'uuid', tagsOptions)}
                        placeholder={intl.formatMessage({
                          id: 'view.map.choose_tags',
                        })}
                        allowClear
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      />
                    </Form.Item>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                      onClick={() => console.log('click')}
                    />
                  </StyledSpace>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    labelCol={8}
                    wrapperCol={16}
                    label={intl.formatMessage({
                      id: 'view.map.add_image',
                    })}
                  >
                    <Dragger {...DraggerProps}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        {intl.formatMessage({
                          id: 'view.map.dragger_title',
                        })}
                      </p>
                      <p className="ant-upload-hint">
                        {intl.formatMessage({
                          id: 'view.map.dragger_sub_title',
                        })}
                      </p>
                    </Dragger>
                    {/* <Upload
                  // accept=".png,.jpeg,.jpg"
                  // name="avatar"
                  // listType="picture-card"
                  className="avatar-uploader width-150"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={uploadImage}
                  onChange={handleChange}
                >
                  {avatarUrl && avatarUrl !== '' ? (
                    <div className=" d-flex justify-content-center">
                      <Avatar
                        icon={<UserOutlined />}
                        src={avatarUrl}
                        className="avatarUser"
                        size={{
                          xs: 24,
                          sm: 32,
                          md: 40,
                          lg: 64,
                          xl: 80,
                          xxl: 130,
                        }}
                      />
                    </div>
                  ) : (
                    uploadButton
                  )}
                </Upload> */}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Card>
    </StyledDrawer>
  );
};
function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(AddCamera);
