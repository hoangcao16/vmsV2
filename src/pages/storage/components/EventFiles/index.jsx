import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import AddressApi from '@/services/address/AddressApi';
import AdDivisionApi from '@/services/advision/AdDivision';
import cameraApi from '@/services/controller-api/cameraService';
import eventApi from '@/services/controller-api/eventApi';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import debounce from 'lodash/debounce';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, useIntl } from 'umi';
import { CellCreateTime, ContainerFilterEventFiles, ProTableStyled } from './eventFilesStyled';

const layoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const layoutShort = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

function EventFiles({ dispatch, loading, list, metadata }) {
  const intl = useIntl();

  const [form] = Form.useForm();
  const [collapse, setCollapse] = useState(false);

  const [cameraGroupList, setCameraGroupList] = useState([]);
  const [cameraList, setCameraList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [adminUnitList, setAdminUnitList] = useState([]);

  const [eventList, setEventList] = useState([]);

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...metadata, page, size });

    dispatch({
      type: 'eventFiles/fetchAllEventFiles',
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
      searchValue: value ? value : '',
      page: 1,
      size: 10,
    });

    dispatch({
      type: 'eventFiles/saveSearchParam',
      payload: dataParam,
    });

    dispatch({
      type: 'eventFiles/fetchAllEventFiles',
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
        cameraGroupUuid: cameraGroupUuid === '' ? '' : cameraGroupUuid,
      })
      .then((data) => {
        if (data && data.payload) {
          setCameraList(data.payload);
        }
      });
  };

  const onChangeCamera = (cameraUuid) => {
    const dataParam = Object.assign({ ...metadata, cameraUuid: cameraUuid ? cameraUuid : '' });
    dispatch({
      type: 'eventFiles/saveSearchParam',
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
      cameraUuid: null,
    });

    getAllCamera(cameraGroupUuid);
    dispatch({
      type: 'eventFiles/saveSearchParam',
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
          type: 'eventFiles/saveSearchParam',
          payload: dataParam,
        });
        setStartDate(null);
      } else {
        const dataParam = Object.assign({
          ...metadata,
          startRecordTime: +moment.unix(),
        });
        dispatch({
          type: 'eventFiles/saveSearchParam',
          payload: dataParam,
        });
        setStartDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...metadata, startRecordTime: -1 });
      dispatch({
        type: 'eventFiles/saveSearchParam',
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
          type: 'eventFiles/saveSearchParam',
          payload: dataParam,
        });
        setEndDate(null);
      } else {
        const dataParam = Object.assign({
          ...metadata,
          endRecordTime: +moment.unix(),
        });
        dispatch({
          type: 'eventFiles/saveSearchParam',
          payload: dataParam,
        });
        setEndDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...metadata, endRecordTime: -1 });
      dispatch({
        type: 'eventFiles/saveSearchParam',
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
      type: 'eventFiles/saveSearchParam',
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
      type: 'eventFiles/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeWard = (wardId) => {
    const dataParam = Object.assign({ ...metadata, wardId: wardId ? wardId : '' });
    dispatch({
      type: 'eventFiles/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeAddress = (event) => {
    const value = event.target.value ? event.target.value : '';
    const dataParam = Object.assign({ ...metadata, address: value });
    dispatch({
      type: 'eventFiles/saveSearchParam',
      payload: dataParam,
    });
  };

  const handleAddressBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      address: value,
    });
  };

  const onChangeEventType = (eventUuid) => {
    const dataParam = Object.assign({
      ...metadata,
      eventUuid: eventUuid ? eventUuid : 'notnull',
    });

    dispatch({
      type: 'eventFiles/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeFileType = (value) => {
    const dataParam = Object.assign({
      ...metadata,
      type: value ? value : -1,
    });
    dispatch({
      type: 'eventFiles/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeUnit = (unitId) => {
    const dataParam = Object.assign({
      ...metadata,
      administrativeUnitUuid: unitId ? unitId : '',
    });
    dispatch({
      type: 'eventFiles/saveSearchParam',
      payload: dataParam,
    });
  };

  const onFinish = (values) => {
    const dataParam = Object.assign({
      ...metadata,

      page: 1,
      size: 10,
    });

    dispatch({
      type: 'eventFiles/saveSearchParam',
      payload: dataParam,
    });

    dispatch({
      type: 'eventFiles/fetchAllEventFiles',
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

  const columns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.created_time',
      }),
      dataIndex: 'createdTime',
      render: (text) => {
        return <CellCreateTime>{moment(text).format('DD/MM/YYYY HH:mm')}</CellCreateTime>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.type',
      }),
      dataIndex: 'type',
      render: (text) => {
        if (text === 0)
          return intl.formatMessage({
            id: 'view.storage.type_video',
          });
        if (text === 1)
          return intl.formatMessage({
            id: 'view.storage.type_image',
          });
      },
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.event',
      }),
      dataIndex: 'eventName',
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.file_name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage(
        {
          id: `view.storage.camera_name`,
        },
        {
          cam: intl.formatMessage({
            id: 'camera',
          }),
        },
      ),
      dataIndex: 'cameraName',
    },
  ];

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

  return (
    <div>
      <ContainerFilterEventFiles>
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
                  </Row>

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
                      placeholder={intl.formatMessage({ id: 'view.map.administrative_unit' })}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </ContainerFilterEventFiles>

      <ProTableStyled
        loading={loading}
        rowKey={'id'}
        search={false}
        options={false}
        dataSource={list}
        columns={columns}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: onPaginationChange,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'pages.storage.dailyArchive.total',
            })} ${total} ${intl.formatMessage({
              id: 'pages.storage.dailyArchive.camera',
            })}`,
          total: metadata?.total,
          // onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.eventFiles;
  return {
    loading: state.loading.models.eventFiles,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(EventFiles);
