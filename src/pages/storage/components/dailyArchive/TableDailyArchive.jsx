import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import AddressApi from '@/services/address/AddressApi';
import AdDivisionApi from '@/services/advision/AdDivision';
import DailyArchiveApi from '@/services/dailyArchive/DailyArchiveApi';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import debounce from 'lodash/debounce';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { CellCreateTime, ContainerFilterDailyArchive } from './style';

const layoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const layoutShort = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

const searchCaptureFileParamDefault = {
  page: 1,
  size: 10,
  startRecordTime: -1,
  endRecordTime: -1,
  address: '',
  provinceId: '',
  districtId: '',
  wardId: '',
  administrativeUnitUuid: '',
  fileType: 0,
  cameraGroupUuid: '',
  cameraUuid: '',
  type: -1,
  eventUuid: '',
  searchType: '',
  searchValue: '',
};

function TableDailyArchive() {
  const [form] = Form.useForm();
  const intl = useIntl();

  const [collapse, setCollapse] = useState(false);

  const [searchParam, setSearchParam] = useState(searchCaptureFileParamDefault);
  const [cameraGroupList, setCameraGroupList] = useState([]);
  const [cameraList, setCameraList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [adminUnitList, setAdminUnitList] = useState([]);

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...searchParam, page, size });
    setSearchParam(dataParam);
    handleGetListDailyArchive(dataParam);
  };

  const getAllCamera = (cameraGroupUuid) => {
    if (cameraGroupUuid === '') {
      DailyArchiveApi.getAllCamera({
        page: 0,
        size: 1000000,
        sort_by: 'name',
        order_by: 'asc',
      }).then((data) => {
        if (data && data.payload) {
          setCameraList(data.payload);
        }
      });
    } else {
      DailyArchiveApi.getAllCamera({
        page: 0,
        size: 1000000,
        sort_by: 'name',
        order_by: 'asc',
        cameraGroupUuid: cameraGroupUuid,
      }).then((data) => {
        if (data && data.payload) {
          setCameraList(data.payload);
        }
      });
    }
  };

  const onChangeCamera = (cameraUuid) => {
    const dataParam = Object.assign({ ...searchParam, cameraUuid: cameraUuid });
    setSearchParam(dataParam);
  };

  const onChangeCameraGroup = (cameraGroupUuid) => {
    form.setFieldsValue({
      cameraUuid: null,
    });

    const dataParam = Object.assign({
      ...searchParam,
      cameraGroupUuid: cameraGroupUuid,
      cameraUuid: null,
    });
    setSearchParam(dataParam);
    getAllCamera(cameraGroupUuid);
  };

  const onChangeStartDate = (moment) => {
    if (moment) {
      moment.set('hour', 0);
      moment.set('minute', 0);
      moment.set('second', 0);
      moment.set('millisecond', 1);
      if (endDate && moment.isAfter(endDate)) {
        form.setFieldsValue({
          startDate: null,
        });
        const dataParam = Object.assign({
          ...searchParam,
          startRecordTime: -1,
        });
        setSearchParam(dataParam);
        setStartDate(null);
      } else {
        const dataParam = Object.assign({
          ...searchParam,
          startRecordTime: +moment.unix(),
        });
        setSearchParam(dataParam);
        setStartDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...searchParam, startRecordTime: -1 });
      setSearchParam(dataParam);
    }
  };

  const onChangeEndDate = (moment) => {
    if (moment) {
      moment.set('hour', 23);
      moment.set('minute', 59);
      moment.set('second', 59);
      moment.set('millisecond', 999);
      if (startDate && startDate.isAfter(moment)) {
        form.setFieldsValue({
          endDate: null,
        });
        const dataParam = Object.assign({
          ...searchParam,
          endRecordTime: -1,
        });
        setSearchParam(dataParam);
        setEndDate(null);
      } else {
        const dataParam = Object.assign({
          ...searchParam,
          endRecordTime: +moment.unix(),
        });
        setSearchParam(dataParam);
        setEndDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...searchParam, endRecordTime: -1 });
      setSearchParam(dataParam);
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
    const dataParam = Object.assign({ ...searchParam, provinceId: cityId });
    setSearchParam(dataParam);
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
    const dataParam = Object.assign({ ...searchParam, districtId: districtId });
    setSearchParam(dataParam);
  };

  const onChangeWard = (wardId) => {
    const dataParam = Object.assign({ ...searchParam, wardId: wardId });
    setSearchParam(dataParam);
  };

  const onChangeAddress = (event) => {
    let value = event.target.value;
    const dataParam = Object.assign({ ...searchParam, address: value });
    setSearchParam(dataParam);
  };

  const handleAddressBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      address: value,
    });
  };

  const onChangeUnit = (unitId) => {
    const dataParam = Object.assign({
      ...searchParam,
      administrativeUnitUuid: unitId,
    });
    setSearchParam(dataParam);
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
      ...searchParam,
      searchType: 'all',
      searchValue: value,
      page: 1,
      size: 10,
    });

    handleGetListDailyArchive(dataParam);
    setSearchParam(dataParam);
  };

  const onFinish = (values) => {
    // console.log('Success:', values);
    handleGetListDailyArchive(searchParam);
  };

  const handleGetListDailyArchive = (searchParam) => {
    DailyArchiveApi.getAllDailyArchive(searchParam).then((res) => {
      setList(res.payload);

      setTotal(res.metadata.total);
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
    getAllCamera('');
    DailyArchiveApi.getAllGroupCamera({
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
  }, []);

  useEffect(() => {
    handleGetListDailyArchive(searchParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: intl.formatMessage({
        id: 'view.storage.created_time',
      }),
      dataIndex: 'createdTime',
      render: (text) => {
        return <CellCreateTime>{moment(text * 1000).format('DD/MM/YYYY HH:mm')}</CellCreateTime>;
      },
    },
    {
      title: intl.formatMessage({
        id: 'view.storage.type',
      }),
      dataIndex: 'fileType',
      render: (text) => {
        if (text === 0)
          return intl.formatMessage({
            id: 'view.storage.type_video',
          });
        if (text === 1) return 'view.storage.type_image';
      },
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
    {
      title: intl.formatMessage({
        id: 'view.storage.address',
      }),
      dataIndex: 'address',
    },
  ];

  return (
    <div>
      <ProTable
        rowKey={'id'}
        search={false}
        options={false}
        dataSource={list}
        columns={columns}
        toolbar={{
          multipleLine: true,
          filter: (
            <ContainerFilterDailyArchive>
              <Form
                className="formFilterDailyArchive"
                name="basic"
                onFinish={onFinish}
                autoComplete="off"
                form={form}
              >
                <div className="collapse-filter">
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
            </ContainerFilterDailyArchive>
          ),
        }}
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
          total: total,
          // onChange: onPaginationChange,
          pageSize: searchParam.size,
          current: searchParam.page,
        }}
      />
    </div>
  );
}

export default TableDailyArchive;
