import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useIntl } from 'umi';
import { ContainerExtraFilter } from './style';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { FaThLarge, FaThList } from 'react-icons/fa';

import {
  CAPTURED_NAMESPACE,
  DAILY_ARCHIVE_NAMESPACE,
  EVENT_AI_NAMESPACE,
  EVENT_FILES_NAMESPACE,
  GRID_VIEW,
  IMPORTANT_NAMESPACE,
  LIST_VIEW,
} from '../../constants';
import AddressApi from '@/services/address/AddressApi';
import cameraApi from '@/services/controller-api/cameraService';
import AdDivisionApi from '@/services/advision/AdDivision';
import eventApi from '@/services/controller-api/eventApi';

const layoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const layoutShort = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

function ExtraFilter({ state, nameSpace, dispatch }) {
  const metadata = state[nameSpace].metadata ? state[nameSpace].metadata : {};

  const intl = useIntl();
  const [form] = Form.useForm();

  const [collapse, setCollapse] = useState(true);

  const [cameraGroupList, setCameraGroupList] = useState([]);
  const [cameraList, setCameraList] = useState([]);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [adminUnitList, setAdminUnitList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [eventList, setEventList] = useState([]);

  const viewType = state[nameSpace].viewType ? state[nameSpace].viewType : 'list';

  const handleChangeViewType = (value) => {
    dispatch({
      type: `${nameSpace}/setViewType`,
      payload: value,
    });
  };

  const onFinish = (values) => {
    console.log(nameSpace);
    const dataParam = Object.assign({
      ...metadata,
      page: 1,
      size: 10,
    });

    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
    dispatch({
      type: `${nameSpace}/fetchAll`,
      payload: dataParam,
    });
  };

  const handleQuickSearchPaste = (event) => {
    const value = event.target.value.trimStart();
    form.setFieldsValue({
      quickSearch: value,
    });
  };

  const handleQuickSearchBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      quickSearch: value,
    });
  };

  const onQuickSearchHandler = (e) => {
    const value = e.target.value.trim();

    const dataParam = Object.assign({
      ...metadata,
      searchValue: value,
      page: 1,
      size: 10,
    });

    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });

    dispatch({
      type: `${nameSpace}/fetchAll`,
      payload: dataParam,
    });
  };

  const getAllCamera = (cameraGroupUuid) => {
    cameraApi
      .getAll({
        page: 0,
        size: 1000000,
        sort_by: 'name',
        order_by: 'asc',
        cameraGroupUuid: cameraGroupUuid ? cameraGroupUuid : '',
      })
      .then((data) => {
        if (data && data.payload) {
          setCameraList(data.payload);
        }
      });
  };

  const onChangeCamera = (cameraUuid) => {
    const dataParam = Object.assign({
      ...metadata,
      cameraUuid: cameraUuid ? cameraUuid : '',
    });
    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const onChangeCameraGroup = (cameraGroupUuid) => {
    form.setFieldsValue({
      cameraUuid: null,
    });

    const dataParam = Object.assign({
      ...metadata,
      cameraGroupUuid: cameraGroupUuid ? cameraGroupUuid : '',
      cameraUuid: '',
    });

    getAllCamera(cameraGroupUuid ? cameraGroupUuid : '');
    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const onChangeStartDate = (moment) => {
    if (moment) {
      if (endDate && moment.startOf('day').isAfter(endDate)) {
        form.setFieldsValue({
          startDate: null,
        });
        const dataParam = Object.assign({
          ...metadata,
          startRecordTime: -1,
        });
        dispatch({
          type: `${nameSpace}/saveSearchParam`,
          payload: dataParam,
        });
        setStartDate(null);
      } else {
        const dataParam = Object.assign({
          ...metadata,
          startRecordTime: +moment.unix(),
        });
        dispatch({
          type: `${nameSpace}/saveSearchParam`,
          payload: dataParam,
        });
        setStartDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...metadata, startRecordTime: -1 });
      dispatch({
        type: `${nameSpace}/saveSearchParam`,
        payload: dataParam,
      });
    }
  };

  const onChangeEndDate = (moment) => {
    if (moment) {
      if (startDate && moment.endOf('day').isBefore(startDate)) {
        form.setFieldsValue({
          endDate: null,
        });
        const dataParam = Object.assign({
          ...metadata,
          endRecordTime: -1,
        });
        dispatch({
          type: 'captured/saveSearchParam',
          payload: dataParam,
        });
        setEndDate(null);
      } else {
        const dataParam = Object.assign({
          ...metadata,
          endRecordTime: +moment.unix(),
        });
        dispatch({
          type: 'captured/saveSearchParam',
          payload: dataParam,
        });
        setEndDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...metadata, endRecordTime: -1 });
      dispatch({
        type: 'captured/saveSearchParam',
        payload: dataParam,
      });
    }
  };

  const onChangeCity = (cityId) => {
    form.setFieldsValue({ districtId: null, wardId: null });
    setWardList([]);
    setDistrictList([]);
    if (cityId) {
      AddressApi.getDistrictByProvinceId(cityId)
        .then((res) => {
          setDistrictList(res.payload);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const dataParam = Object.assign({ ...metadata, provinceId: cityId ? cityId : '' });
    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const onChangeDistrict = (districtId) => {
    form.setFieldsValue({ wardId: null });
    setWardList([]);
    if (districtId) {
      AddressApi.getWardByDistrictId(districtId)
        .then((res) => {
          setWardList(res.payload);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const dataParam = Object.assign({ ...metadata, districtId: districtId ? districtId : '' });
    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const onChangeWard = (wardId) => {
    const dataParam = Object.assign({ ...metadata, wardId: wardId ? wardId : '' });
    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const onChangeUnit = (unitId) => {
    const dataParam = Object.assign({
      ...metadata,
      administrativeUnitUuid: unitId ? unitId : '',
    });
    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const onChangeAddress = (event) => {
    let value = event.target.value;
    const dataParam = Object.assign({ ...metadata, address: value });
    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const handleAddressBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      address: value,
    });
  };

  const onChangeFileType = (value) => {
    const dataParam = Object.assign({
      ...metadata,
      type: value ? value : '',
    });
    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const onChangeEventType = (eventUuid) => {
    const dataParam = Object.assign({
      ...metadata,
      eventUuid: eventUuid ? eventUuid : 'notnull',
    });

    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  const onChangeProcessStatus = (status) => {
    const dataParam = Object.assign({
      ...metadata,
      status: status ? status : '',
    });

    dispatch({
      type: `${nameSpace}/saveSearchParam`,
      payload: dataParam,
    });
  };

  useEffect(() => {
    AddressApi.getAllProvinces()
      .then((res) => {
        setProvinceList(res.payload);
      })
      .catch((err) => {
        console.log(err);
      });

    getAllCamera('');

    cameraApi
      .getAllGroupCamera({
        parent: 'all',
        page: 0,
        size: 1000000,
        sort_by: 'name',
        order_by: 'asc',
      })
      .then((res) => {
        setCameraGroupList(res.payload);
      })
      .catch((err) => {
        console.log(err);
      });

    AdDivisionApi.getAll({
      page: 0,
      size: 1000000,
      sort_by: 'name',
      order_by: 'asc',
    }).then((data) => {
      if (data && data.payload) {
        setAdminUnitList(data.payload);
      }
    });

    //
    eventApi
      .getAll({ page: 0, size: 1000000, sort_by: 'name', order_by: 'asc' })
      .then((res) => {
        setEventList(res.payload);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // dispatch reset metadata to init state
    dispatch({
      type: `${nameSpace}/resetSearchParam`,
    });

    form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameSpace]);

  const typeList = [
    {
      id: 0,
      name: `${intl.formatMessage({
        id: 'view.storage.type_video',
      })}`,
    },
    {
      id: 1,
      name: `${intl.formatMessage({
        id: 'view.storage.type_image',
      })}`,
    },
  ];

  const processingstatusOptions = [
    {
      value: 'process',
      label: `${intl.formatMessage({
        id: 'view.ai_events.processingStatus.process',
      })}`,
    },
    {
      value: 'processed',
      label: `${intl.formatMessage({
        id: 'view.ai_events.processingStatus.processed',
      })}`,
    },
    {
      value: 'not_processed',
      label: `${intl.formatMessage({
        id: 'view.ai_events.processingStatus.not_processed',
      })}`,
    },
  ];

  return (
    <ContainerExtraFilter>
      <Form name="basic" onFinish={onFinish} autoComplete="off" form={form}>
        <div className="collapse-filter">
          <div className="collapse-filter__left">
            <Form.Item name="quickSearch">
              <Input.Search
                placeholder={intl.formatMessage({
                  id: 'view.storage.search_daily_archive',
                })}
                maxLength={255}
                onPaste={handleQuickSearchPaste}
                onBlur={handleQuickSearchBlur}
                onChange={debounce(onQuickSearchHandler, 1500)}
                onSearch={() => {
                  form.submit();
                }}
              />
            </Form.Item>

            {collapse === true && (
              <Button
                type="link"
                onClick={() => {
                  setCollapse(false);
                }}
              >
                {intl.formatMessage({
                  id: 'view.storage.filter',
                })}{' '}
                <RightOutlined />
              </Button>
            )}

            {collapse === false && (
              <Button
                type="link"
                onClick={() => {
                  setCollapse(true);
                }}
              >
                {intl.formatMessage({
                  id: 'view.storage.hide_filter',
                })}{' '}
                <DownOutlined />
              </Button>
            )}
          </div>

          {nameSpace === EVENT_AI_NAMESPACE && (
            <Space className="collapse-filter__right">
              <Button
                className="btn-viewType"
                type={viewType === LIST_VIEW ? 'link' : 'default'}
                icon={<FaThList />}
                onClick={() => {
                  handleChangeViewType(LIST_VIEW);
                }}
              />
              <Button
                className="btn-viewType"
                type={viewType === GRID_VIEW ? 'link' : 'default'}
                icon={<FaThLarge />}
                onClick={() => {
                  handleChangeViewType(GRID_VIEW);
                }}
              />
            </Space>
          )}
        </div>

        {collapse === false && (
          <div className="extra-filter">
            <Row justify="space-between">
              <Col span={11}>
                <Form.Item {...layoutLong} label="Camera" name="cameraUuid">
                  <Select
                    allowClear
                    showSearch
                    onChange={(uuid) => onChangeCamera(uuid)}
                    filterOption={filterOption}
                    options={normalizeOptions('name', 'uuid', cameraList)}
                    placeholder="Camera"
                  />
                </Form.Item>

                <Form.Item
                  {...layoutLong}
                  label={intl.formatMessage({
                    id: 'view.storage.group_camera',
                  })}
                  name="cameraGroupUuid"
                >
                  <Select
                    allowClear
                    showSearch
                    onChange={(uuid) => onChangeCameraGroup(uuid)}
                    filterOption={filterOption}
                    options={normalizeOptions('name', 'uuid', cameraGroupList)}
                    placeholder={intl.formatMessage({
                      id: 'view.storage.choose_group_camera',
                    })}
                  />
                </Form.Item>

                <Row>
                  <Col span={12}>
                    <Form.Item
                      {...layoutShort}
                      label={intl.formatMessage({
                        id: 'view.storage.from_date',
                      })}
                      name="startDate"
                    >
                      <DatePicker
                        onChange={onChangeStartDate}
                        placeholder={intl.formatMessage({
                          id: 'view.storage.from_date',
                        })}
                        style={{ width: '100%' }}
                        locale={locale}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      {...layoutShort}
                      label={intl.formatMessage({
                        id: 'view.storage.to_date',
                      })}
                      name="endDate"
                    >
                      <DatePicker
                        onChange={onChangeEndDate}
                        placeholder={intl.formatMessage({
                          id: 'view.storage.to_date',
                        })}
                        style={{ width: '100%' }}
                        locale={locale}
                        format="DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={12}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      {...layoutShort}
                      label={intl.formatMessage({ id: 'view.map.province_id' })}
                      name="provinceId"
                    >
                      <Select
                        allowClear
                        showSearch
                        onChange={(cityId) => onChangeCity(cityId)}
                        filterOption={filterOption}
                        options={normalizeOptions('name', 'provinceId', provinceList)}
                        placeholder={intl.formatMessage({ id: 'view.map.province_id' })}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      {...layoutShort}
                      label={intl.formatMessage({ id: 'view.map.district_id' })}
                      name="districtId"
                    >
                      <Select
                        allowClear
                        showSearch
                        onChange={(districtId) => onChangeDistrict(districtId)}
                        filterOption={filterOption}
                        options={normalizeOptions('name', 'districtId', districtList)}
                        placeholder={intl.formatMessage({ id: 'view.map.district_id' })}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Form.Item
                      {...layoutShort}
                      label={intl.formatMessage({ id: 'view.map.ward_id' })}
                      name="wardId"
                    >
                      <Select
                        allowClear
                        showSearch
                        onChange={(id) => onChangeWard(id)}
                        filterOption={filterOption}
                        options={normalizeOptions('name', 'id', wardList)}
                        placeholder={intl.formatMessage({ id: 'view.map.ward_id' })}
                      />
                    </Form.Item>
                  </Col>

                  {nameSpace === EVENT_AI_NAMESPACE ? (
                    <Col span={12}>
                      <Form.Item
                        {...layoutShort}
                        label={intl.formatMessage({ id: 'view.map.administrative_unit' })}
                        name="administrativeUnitUuid"
                      >
                        <Select
                          showSearch
                          allowClear
                          onChange={(id) => onChangeUnit(id)}
                          filterOption={filterOption}
                          options={normalizeOptions('name', 'uuid', adminUnitList)}
                          placeholder={intl.formatMessage({
                            id: 'view.map.administrative_unit',
                          })}
                        />
                      </Form.Item>
                    </Col>
                  ) : (
                    <Col span={12}>
                      <Form.Item
                        {...layoutShort}
                        label={intl.formatMessage({ id: 'view.storage.street' })}
                        name="address"
                      >
                        <Input
                          placeholder={intl.formatMessage({ id: 'view.storage.street' })}
                          onChange={debounce(onChangeAddress, 1500)}
                          maxLength={255}
                          onBlur={handleAddressBlur}
                          onPaste={(e) => {
                            form.setFieldsValue({
                              address: e.target.value.trimStart(),
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
                  )}
                </Row>

                {(nameSpace === DAILY_ARCHIVE_NAMESPACE ||
                  nameSpace === EVENT_FILES_NAMESPACE ||
                  nameSpace === IMPORTANT_NAMESPACE) && (
                  <Form.Item
                    {...layoutLong}
                    label={intl.formatMessage({ id: 'view.map.administrative_unit' })}
                    name="administrativeUnitUuid"
                  >
                    <Select
                      showSearch
                      allowClear
                      onChange={(id) => onChangeUnit(id)}
                      filterOption={filterOption}
                      options={normalizeOptions('name', 'uuid', adminUnitList)}
                      placeholder={intl.formatMessage({
                        id: 'view.map.administrative_unit',
                      })}
                    />
                  </Form.Item>
                )}

                {nameSpace === CAPTURED_NAMESPACE && (
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        {...layoutShort}
                        label={intl.formatMessage({ id: 'view.map.administrative_unit' })}
                        name="administrativeUnitUuid"
                      >
                        <Select
                          showSearch
                          allowClear
                          onChange={(id) => onChangeUnit(id)}
                          filterOption={filterOption}
                          options={normalizeOptions('name', 'uuid', adminUnitList)}
                          placeholder={intl.formatMessage({
                            id: 'view.map.administrative_unit',
                          })}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...layoutShort}
                        label={intl.formatMessage({ id: 'view.storage.file_type' })}
                        name="file_type"
                      >
                        <Select
                          allowClear
                          showSearch
                          onChange={(status) => onChangeFileType(status)}
                          filterOption={filterOption}
                          options={normalizeOptions('name', 'id', typeList)}
                          placeholder={intl.formatMessage({
                            id: 'view.storage.file_type',
                          })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {(nameSpace === EVENT_FILES_NAMESPACE || nameSpace === IMPORTANT_NAMESPACE) && (
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        {...layoutShort}
                        label={intl.formatMessage({ id: 'view.storage.event_type' })}
                        name="eventType"
                      >
                        <Select
                          allowClear
                          showSearch
                          onChange={(id) => onChangeEventType(id)}
                          filterOption={filterOption}
                          options={normalizeOptions('name', 'uuid', eventList)}
                          placeholder={intl.formatMessage({ id: 'view.storage.event_type' })}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...layoutShort}
                        label={intl.formatMessage({ id: 'view.storage.file_type' })}
                        name="file_type"
                      >
                        <Select
                          allowClear
                          showSearch
                          onChange={(status) => onChangeFileType(status)}
                          filterOption={filterOption}
                          options={normalizeOptions('name', 'id', typeList)}
                          placeholder={intl.formatMessage({
                            id: 'view.storage.file_type',
                          })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {nameSpace === EVENT_AI_NAMESPACE && (
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        {...layoutShort}
                        label={intl.formatMessage({ id: 'view.storage.event_type' })}
                        name="eventType"
                      >
                        <Select
                          allowClear
                          showSearch
                          onChange={(id) => onChangeEventType(id)}
                          filterOption={filterOption}
                          options={normalizeOptions('name', 'uuid', eventList)}
                          placeholder={intl.formatMessage({ id: 'view.storage.event_type' })}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...layoutShort}
                        label={intl.formatMessage({ id: 'view.common_device.status' })}
                        name="address"
                      >
                        <Select
                          allowClear
                          showSearch
                          onChange={(status) => onChangeProcessStatus(status)}
                          filterOption={filterOption}
                          options={processingstatusOptions}
                          placeholder={intl.formatMessage({
                            id: 'view.common_device.status',
                          })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Form>
    </ContainerExtraFilter>
  );
}

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps)(ExtraFilter);
