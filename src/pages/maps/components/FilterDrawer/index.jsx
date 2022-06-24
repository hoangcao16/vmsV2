import MSFormItem from '@/components/Form/Item';
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import AddressApi from '@/services/addressApi';
import { Col, Form, Input, Row, Select } from 'antd';
import { connect } from 'dva';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { StyledButtonClearFilter } from './style';

function FilterDrawer({
  provincesOptions,
  tagsOptions,
  adDivisionsOptions,
  groupCameraOptions,
  type,
  form,
}) {
  const intl = useIntl();
  const [provinceId, setProvinceId] = useState(null);
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

  const handelClearFilter = () => {
    form.resetFields();
  };

  const onChangeDistrict = async (districtId) => {
    setDistrictId(districtId);
    await resetWardData();
  };

  function resetWardData() {
    form.setFieldsValue({ wardId: null });
  }

  return (
    <>
      {type === 'adminisUnit' ? (
        <>
          <Row gutter={[12, 6]}>
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
                  allowClear
                  dataSource={districts}
                  onChange={(districtId) => onChangeDistrict(districtId)}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'districtId', districts)}
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
                  allowClear
                  dataSource={wards}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'id', wards)}
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
                  placeholder={intl.formatMessage({ id: 'view.map.please_choose_location' })}
                />
              </MSFormItem>
            </Col>
            <Col span={24}>
              <Form.Item
                label={intl.formatMessage({ id: 'view.map.administrative_unit' })}
                name="administrativeUnitUuid"
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
                >
                  {adDivisionsOptions?.map((item) => (
                    <Select.Option key={item.uuid} value={item.uuid}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Col span={24}>
                <StyledButtonClearFilter type="link" onClick={handelClearFilter}>
                  {intl.formatMessage({ id: 'view.map.btn_remove_filter' })}
                </StyledButtonClearFilter>
              </Col>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row gutter={[12, 6]}>
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
                  allowClear
                  showSearch
                  dataSource={districts}
                  onChange={(districtId) => onChangeDistrict(districtId)}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'districtId', districts)}
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
                  allowClear
                  showSearch
                  dataSource={wards}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'id', wards)}
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
                  placeholder={intl.formatMessage({ id: 'view.map.please_choose_location' })}
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
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
                  }
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
                >
                  {tagsOptions?.map((item) => (
                    <Select.Option key={item.uuid} value={item.uuid}>
                      {item.key}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <StyledButtonClearFilter type="link" onClick={handelClearFilter}>
                {intl.formatMessage({ id: 'view.map.btn_remove_filter' })}
              </StyledButtonClearFilter>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { provincesOptions, groupCameraOptions, adDivisionsOptions, tagsOptions } =
    state.globalstore;
  const { type } = state.maps;

  return {
    provincesOptions,
    tagsOptions,
    adDivisionsOptions,
    groupCameraOptions,
    type,
  };
}

export default connect(mapStateToProps)(FilterDrawer);
