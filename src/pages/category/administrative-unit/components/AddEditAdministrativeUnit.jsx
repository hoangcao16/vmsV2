import {
  CloseOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { StyledDrawer } from '../style';
import { useIntl } from 'umi';
import { isEmpty } from 'lodash';
import MSFormItem from '@/components/Form/Item';
import AddressApi from '@/services/address/AddressApi';
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import { notify } from '@/components/Notify';
import ExportEventFileApi from '@/services/exporteventfile/ExportEventFileApi';
import { v4 as uuidV4 } from 'uuid';
import getBase64 from '@/utils/getBase64';
import PhoneInput from 'react-phone-number-input';

const DATA_FAKE_UNIT = {
  provinces: [{ name: '', provinceId: '' }],
};

const AddEditAdministrativeUnit = ({ onClose, selectedRecord, dispatch, openDrawer }) => {
  console.log('selectedRecord', selectedRecord);
  const intl = useIntl();
  const [form] = Form.useForm();
  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_UNIT);

  const [provinceId, setProvinceId] = useState(selectedRecord?.provinceId || null);
  const [districts, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState(selectedRecord?.districtId || null);
  const [wards, setWard] = useState([]);
  const [avatarFileName, setAvatarFileName] = useState(selectedRecord?.avatarFileName || '');

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchSelectOptions().then(setFilterOptions);
  }, []);

  useEffect(() => {
    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then((data) => setDistrict(data.payload));
      setDistrictId(null);
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      AddressApi.getWardByDistrictId(districtId).then((data) => setWard(data.payload));
    } else {
      setWard([]);
    }
  }, [districtId]);

  const { provinces } = filterOptions;

  const onChangeCity = async (cityId) => {
    setProvinceId(cityId);

    await resetDistrictAndWardData();
  };

  function resetDistrictAndWardData() {
    form.setFieldsValue({ districtId: null, wardId: null });
  }

  const onChangeDistrict = async (districtId) => {
    setDistrictId(districtId);
    await resetWardData();
  };

  function resetWardData() {
    form.setFieldsValue({ wardId: null });
  }

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
      if (result.data && result.data.payload && result.data.payload.fileUploadInfoList.length > 0) {
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

  const handleSubmit = (value) => {
    const payload = {
      ...value,
      avatarFileName: avatarFileName,
    };

    if (isEmpty(selectedRecord)) {
      dispatch({
        type: 'advision/add',
        payload: payload,
      });
    } else {
      dispatch({
        type: 'advision/edit',
        payload: { id: selectedRecord?.uuid, values: { ...payload } },
      });
    }

    onClose();
  };

  return (
    <StyledDrawer
      openDrawer={openDrawer}
      onClose={onClose}
      width={'35%'}
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
          {!isEmpty(selectedRecord) && (
            <Popconfirm
              placement="bottom"
              title={intl.formatMessage({ id: 'noti.delete_zone' })}
              //   onConfirm={onDeleteRecord}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>
                <DeleteOutlined />
                {intl.formatMessage({ id: 'delete' })}
              </Button>
            </Popconfirm>
          )}
          <Button onClick={onClose}>
            <CloseOutlined />
            {intl.formatMessage({ id: 'view.map.cancel' })}
          </Button>
        </Space>
      }
    >
      <Card
        title={
          isEmpty(selectedRecord)
            ? intl.formatMessage({ id: 'view.category.add_administrative_unit' })
            : intl.formatMessage({ id: 'view.category.edit_administrative_unit' })
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={selectedRecord ?? {}}
        >
          <Row gutter={24}>
            <Col span={9}>
              <Upload
                accept=".png,.jpeg,.jpg"
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={uploadImage}
                onChange={handleChange}
              >
                {avatarFileName && avatarFileName !== '' ? (
                  <img src={avatarFileName} alt="avatar" style={{ width: '100%' }} />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Col>
            <Col span={15}>
              <Row gutter={24}>
                <Col span={24}>
                  <MSFormItem
                    label={`${intl.formatMessage({
                      id: 'view.category.administrative_unit_name',
                    })}`}
                    type="input"
                    name="name"
                    required={true}
                    maxLength={255}
                    className="margin"
                  >
                    <Input
                      placeholder={intl.formatMessage(
                        { id: 'view.category.plsEnter_administrative_unit_name' },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                        },
                      )}
                    />
                  </MSFormItem>
                </Col>

                <Col span={24}>
                  <div className="custom_wrapper">
                    <span className="custom_required_feild_red">* </span>
                    <span className="custom_required_feild">
                      {intl.formatMessage({ id: 'view.ai_humans.phone' })}
                    </span>
                  </div>
                  <MSFormItem type="tel" name="tel">
                    <PhoneInput
                      international={false}
                      defaultCountry="VN"
                      placeholder={intl.formatMessage(
                        { id: 'view.map.please_enter_your_phone_number' },
                        {
                          plsEnter: intl.formatMessage({
                            id: 'please_enter',
                          }),
                        },
                      )}
                    />
                  </MSFormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <MSFormItem
                label={`${intl.formatMessage({
                  id: 'view.map.location',
                })}`}
                type="input"
                name="address"
                maxLength={255}
                required={true}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'view.map.please_choose_location' })}
                />
              </MSFormItem>
            </Col>

            <Col span={8}>
              <MSFormItem
                type="select"
                name="provinceId"
                label={`${intl.formatMessage({
                  id: 'view.map.province_id',
                })}`}
                required={true}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'view.map.province_id',
                  })}
                  dataSource={provinces}
                  onChange={(cityId) => onChangeCity(cityId)}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'provinceId', provinces)}
                  allowClear
                />
              </MSFormItem>
            </Col>

            <Col span={8}>
              <MSFormItem
                type="select"
                name="districtId"
                label={`${intl.formatMessage({
                  id: 'view.map.district_id',
                })}`}
                required={true}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'view.map.district_id',
                  })}
                  showSearch
                  dataSource={districts}
                  onChange={(districtId) => onChangeDistrict(districtId)}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'districtId', districts)}
                />
              </MSFormItem>
            </Col>

            <Col span={8}>
              <MSFormItem
                type="select"
                name="wardId"
                label={`${intl.formatMessage({
                  id: 'view.map.ward_id',
                })}`}
              >
                <Select
                  placeholder={intl.formatMessage({
                    id: 'view.map.ward_id',
                  })}
                  showSearch
                  dataSource={wards}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'id', wards)}
                />
              </MSFormItem>
            </Col>

            <Col span={12}>
              <MSFormItem
                label={`${intl.formatMessage({
                  id: 'view.map.longitude',
                })}`}
                name="long_"
                type="long_"
                maxLength={255}
              >
                <Input
                  placeholder={intl.formatMessage(
                    { id: 'view.map.please_enter_longitude' },
                    {
                      plsEnter: intl.formatMessage({
                        id: 'please_enter',
                      }),
                    },
                  )}
                />
              </MSFormItem>
            </Col>
            <Col span={12}>
              <MSFormItem
                label={`${intl.formatMessage({
                  id: 'view.map.latitude',
                })}`}
                name="lat_"
                type="lat_"
                maxLength={255}
              >
                <Input
                  placeholder={intl.formatMessage(
                    { id: 'view.map.please_enter_latitude' },
                    {
                      plsEnter: intl.formatMessage({
                        id: 'please_enter',
                      }),
                    },
                  )}
                />
              </MSFormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </StyledDrawer>
  );
};

async function fetchSelectOptions() {
  const { payload: provinces } = await AddressApi.getAllProvinces();
  return {
    provinces,
  };
}

export default AddEditAdministrativeUnit;
