import MSFormItem from '@/components/Form/Item';
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AddressApi from '@/services/address/AddressApi';
import ModuleApi from '@/services/module-api/ModuleApi';
import { isEmpty } from 'lodash';
import { DrawerActionStyle } from '../../style';

const { TextArea } = Input;

export const DATA_FAKE_ZONE = {
  provinces: [{ name: '', provinceId: '' }],
  campoxy: [{ name: '', uuid: '' }],
  nvr: [{ name: '', uuid: '' }],
  playback: [{ name: '', uuid: '' }],
};

const AddEditZone = ({ onClose, selectedRecord, dispatch }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [filterOptions, setFilterOptions] = useState(DATA_FAKE_ZONE);

  const [provinceId, setProvinceId] = useState(selectedRecord?.provinceId || null);
  const [districts, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState(selectedRecord?.districtId || null);
  const [wards, setWard] = useState([]);

  const handleSubmit = (value) => {
    const payload = {
      ...value,
    };
    if (isEmpty(selectedRecord)) {
      dispatch({
        type: 'zone/addZone',
        payload: payload,
      });
    } else {
      dispatch({
        type: 'zone/editZone',
        payload: { id: selectedRecord?.uuid, values: { ...payload } },
      });
    }
    onClose();
  };

  async function fetchSelectOptions() {
    const values = await Promise.all([
      AddressApi.getAllProvinces(),
      ModuleApi.getAllPlayback(),
      ModuleApi.getAllNVR(),
      ModuleApi.getAllCamproxy(),
    ]);
    const [provinces, playback, nvr, camproxy] = values.map((value) => value.payload);

    return {
      provinces,
      playback,
      nvr,
      camproxy,
    };
  }

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

  const { provinces, playback, nvr, camproxy } = filterOptions;

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

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={selectedRecord ?? {}}
      >
        <Row gutter={24}>
          <Col span={24}>
            <MSFormItem
              label={`${intl.formatMessage({
                id: 'view.common_device.zone_name',
              })}`}
              type="input"
              name="name"
              maxLength={255}
              required={true}
            >
              <Input />
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
                showSearch
                dataSource={provinces}
                onChange={(cityId) => onChangeCity(cityId)}
                filterOption={filterOption}
                options={normalizeOptions('name', 'provinceId', provinces)}
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
                showSearch
                dataSource={wards}
                filterOption={filterOption}
                options={normalizeOptions('name', 'id', wards)}
              />
            </MSFormItem>
          </Col>
          <Col span={24}>
            <MSFormItem
              type="input"
              label={`${intl.formatMessage({
                id: 'view.map.address',
              })}`}
              name="address"
              maxLength={255}
              required={true}
            >
              <Input />
            </MSFormItem>
          </Col>

          <Col span={24}>
            <MSFormItem
              type="input"
              label={`${intl.formatMessage({
                id: 'view.user.detail_list.desc',
              })}`}
              name="description"
              maxLength={255}
              required={true}
            >
              <TextArea />
            </MSFormItem>
          </Col>
          <Col span={24}>
            <MSFormItem
              type="select"
              label={`${intl.formatMessage({
                id: 'view.common_device.choose_nvr',
              })}`}
              name="nvrUuidList"
            >
              <Select
                mode="multiple"
                showArrow
                style={{ width: '100%' }}
                options={nvr?.map((r) => ({
                  value: r.uuid,
                  label: r.name,
                }))}
              />
            </MSFormItem>
          </Col>
          <Col span={24}>
            <MSFormItem
              type="select"
              label={`${intl.formatMessage({
                id: 'view.common_device.choose_playback',
              })}`}
              name="playbackUuidList"
            >
              <Select
                mode="multiple"
                showArrow
                style={{ width: '100%' }}
                options={playback?.map((s) => ({
                  value: s.uuid,
                  label: s.name,
                }))}
              />
            </MSFormItem>
          </Col>
          <Col span={24}>
            <MSFormItem
              type="select"
              label={`${intl.formatMessage({
                id: 'view.common_device.choose_camproxy',
              })}`}
              name="campUuidList"
            >
              <Select
                mode="multiple"
                showArrow
                style={{ width: '100%' }}
                options={camproxy?.map((c) => ({
                  value: c.uuid,
                  label: c.name,
                }))}
              />
            </MSFormItem>
          </Col>
        </Row>
        <DrawerActionStyle>
          <Button onClick={onClose} type="danger">
            {`${intl.formatMessage({
              id: 'view.user.detail_list.cancel',
            })}`}
          </Button>
          <Button htmlType="submit" type="ghost">
            {`${intl.formatMessage({
              id: 'view.user.detail_list.confirm',
            })}`}
          </Button>
        </DrawerActionStyle>
      </Form>
    </div>
  );
};

export default AddEditZone;
