import MSFormItem from '@/components/Form/Item';
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import AddressApi from '@/services/addressApi';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';

function FilterDrawer({
  provincesOptions,
  tagsOptions,
  adDivisionsOptions,
  groupCameraOptions,
  dispatch,
  filters,
  form,
}) {
  const intl = useIntl();
  const [provinceId, setProvinceId] = useState(filters?.provinceId ?? null);
  const [districts, setDistrict] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [wards, setWard] = useState([]);

  const points = [
    {
      name: intl.formatMessage({
        id: 'view.storage.all',
      }),
      id: 1,
    },
    {
      name: intl.formatMessage({
        id: 'view.map.location_onmap',
      }),
      id: 2,
    },
    {
      name: intl.formatMessage({
        id: 'view.map.not_located_yet',
      }),
      id: 3,
    },
  ];

  useEffect(() => {
    setDistrict([]);
    if (provinceId) {
      AddressApi.getDistrictByProvinceId(provinceId).then((data) => setDistrict(data.payload));
      setDistrictId(null);
    }
  }, [provinceId]);

  useEffect(() => {
    setWard([]);
    if (districtId) {
      AddressApi.getWardByDistrictId(districtId).then((data) => setWard(data.payload));
    }
  }, [districtId]);

  const onChangeCity = async (cityId) => {
    setProvinceId(cityId);
    resetDistrictAndWardData();
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
    <StyledRow gutter={[12, 0]}>
      <Col span={12}>
        <Form.Item
          label={intl.formatMessage({ id: 'view.camera.group_camera' })}
          name="cameraGroupUuid"
        >
          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={intl.formatMessage({ id: 'view.storage.choose_group_camera' })}
          >
            {groupCameraOptions?.map((item) => (
              <Select.Option key={item.uuid} value={item.uuid}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <MSFormItem
          type="select"
          name="provinceId"
          label={`${intl.formatMessage({
            id: 'view.map.province_id',
          })}`}
        >
          <Select
            placeholder={intl.formatMessage({
              id: 'view.map.province_id',
            })}
            dataSource={provincesOptions}
            onChange={(cityId) => onChangeCity(cityId)}
            filterOption={filterOption}
            options={normalizeOptions('name', 'provinceId', provincesOptions)}
            allowClear
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </MSFormItem>
      </Col>

      <Col span={12}>
        <MSFormItem
          type="select"
          name="districtId"
          label={`${intl.formatMessage({
            id: 'view.map.district_id',
          })}`}
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
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </MSFormItem>
      </Col>

      <Col span={12}>
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
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </MSFormItem>
      </Col>
      <Col span={12}>
        <MSFormItem
          label={intl.formatMessage({ id: 'view.map.address_id' })}
          type="input"
          name="address"
          maxLength={255}
        >
          <Input
            allowClear
            placeholder={intl.formatMessage({ id: 'view.map.please_choose_location' })}
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
        </MSFormItem>
      </Col>
      <Col span={12}>
        <Form.Item
          label={intl.formatMessage({ id: 'view.map.administrative_unit' })}
          name="administrativeUnitUuid"
        >
          <Select
            allowClear
            showSearch
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
            }
            placeholder={intl.formatMessage({ id: 'view.storage.choose_administrative' })}
          >
            {adDivisionsOptions?.map((item) => (
              <Select.Option key={item.uuid} value={item.uuid}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          label={intl.formatMessage({ id: 'view.map.location_onmap' })}
          name="locationOnMap"
        >
          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={intl.formatMessage({ id: 'view.storage.choose_location' })}
          >
            {points?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item label="Tag" name="tag">
          <Select
            allowClear
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
            }
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            placeholder={intl.formatMessage({ id: 'view.storage.choose_tag' })}
          >
            {tagsOptions?.map((item) => (
              <Select.Option key={item.uuid} value={item.uuid}>
                {item.key}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      <Col span={12} className="colClearFilter">
        <Button type="primary" htmlType="submit">
          {intl.formatMessage({ id: 'view.map.btn_apply' })}
        </Button>
      </Col>
      <Col span={12} className="colClearFilter">
        <Button
          onClick={() => {
            form.resetFields();
          }}
        >
          {intl.formatMessage({ id: 'view.map.btn_remove_filter' })}
        </Button>
      </Col>
    </StyledRow>
  );
}

const StyledRow = styled(Row)`
  margin-top: 16px;

  .ant-btn {
    width: 100%;
  }
`;

function mapStateToProps(state) {
  const { listCameraGroups, listAdministrativeUnits, listTags, filters } = state.filterCamera;
  const { provincesOptions } = state.globalstore;

  return {
    provincesOptions,
    tagsOptions: listTags,
    adDivisionsOptions: listAdministrativeUnits,
    groupCameraOptions: listCameraGroups,
    filters,
  };
}

export default connect(mapStateToProps)(FilterDrawer);
