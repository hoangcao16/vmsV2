import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import AddressApi from '@/services/address/AddressApi';
import AdDivisionApi from '@/services/advision/AdDivision';
import cameraApi from '@/services/controller-api/cameraService';
import DailyArchiveApi from '@/services/storage-api/DailyArchiveApi';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import debounce from 'lodash/debounce';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl, connect } from 'umi';
import DrawerViewCapture from './components/DrawViewCapture/DrawerViewCapture';
import { CellCreateTime, ContainerFilterDailyArchive, ProTableStyled } from './style';

const layoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const layoutShort = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

function TableDailyArchive({ list, dispatch, metadata, loading }) {
  const [form] = Form.useForm();
  const intl = useIntl();

  const [collapse, setCollapse] = useState(true);

  const [cameraGroupList, setCameraGroupList] = useState([]);
  const [cameraList, setCameraList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [adminUnitList, setAdminUnitList] = useState([]);

  const [isOpenView, setIsOpenView] = useState(false);
  const [captureSelected, setCaptureSelected] = useState(null);

  const handleOpenDrawerView = (value) => {
    setIsOpenView(true);
    setCaptureSelected(value);
  };

  const handleCloseDrawerView = () => {
    setIsOpenView(false);
    setCaptureSelected(null);
  };

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...metadata, page, size });

    dispatch({
      type: 'dailyArchive/fetchAllDailyArchive',
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
    const dataParam = Object.assign({ ...metadata, cameraUuid: cameraUuid });
    dispatch({
      type: 'dailyArchive/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeCameraGroup = (cameraGroupUuid) => {
    form.setFieldsValue({
      cameraUuid: null,
    });

    const dataParam = Object.assign({
      ...metadata,
      cameraGroupUuid: cameraGroupUuid,
      cameraUuid: null,
    });

    getAllCamera(cameraGroupUuid);
    dispatch({
      type: 'dailyArchive/saveSearchParam',
      payload: dataParam,
    });
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
          ...metadata,
          startRecordTime: -1,
        });
        dispatch({
          type: 'dailyArchive/saveSearchParam',
          payload: dataParam,
        });
        setStartDate(null);
      } else {
        const dataParam = Object.assign({
          ...metadata,
          startRecordTime: +moment.unix(),
        });
        dispatch({
          type: 'dailyArchive/saveSearchParam',
          payload: dataParam,
        });
        setStartDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...metadata, startRecordTime: -1 });
      dispatch({
        type: 'dailyArchive/saveSearchParam',
        payload: dataParam,
      });
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
          ...metadata,
          endRecordTime: -1,
        });
        dispatch({
          type: 'dailyArchive/saveSearchParam',
          payload: dataParam,
        });
        setEndDate(null);
      } else {
        const dataParam = Object.assign({
          ...metadata,
          endRecordTime: +moment.unix(),
        });
        dispatch({
          type: 'dailyArchive/saveSearchParam',
          payload: dataParam,
        });
        setEndDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...metadata, endRecordTime: -1 });
      dispatch({
        type: 'dailyArchive/saveSearchParam',
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
    const dataParam = Object.assign({ ...metadata, provinceId: cityId });
    dispatch({
      type: 'dailyArchive/saveSearchParam',
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
    const dataParam = Object.assign({ ...metadata, districtId: districtId });
    dispatch({
      type: 'dailyArchive/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeWard = (wardId) => {
    const dataParam = Object.assign({ ...metadata, wardId: wardId });
    dispatch({
      type: 'dailyArchive/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeAddress = (event) => {
    let value = event.target.value;
    const dataParam = Object.assign({ ...metadata, address: value });
    dispatch({
      type: 'dailyArchive/saveSearchParam',
      payload: dataParam,
    });
  };

  const handleAddressBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      address: value,
    });
  };

  const onChangeUnit = (unitId) => {
    const dataParam = Object.assign({
      ...metadata,
      administrativeUnitUuid: unitId,
    });
    dispatch({
      type: 'dailyArchive/saveSearchParam',
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
      searchType: 'all',
      searchValue: value,
      page: 1,
      size: 10,
    });

    dispatch({
      type: 'dailyArchive/saveSearchParam',
      payload: dataParam,
    });

    dispatch({
      type: 'dailyArchive/fetchAllDailyArchive',
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
      type: 'dailyArchive/saveSearchParam',
      payload: dataParam,
    });

    dispatch({
      type: 'dailyArchive/fetchAllDailyArchive',
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

  // useEffect(() => {
  //   dispatch({
  //     type: 'dailyArchive/fetchAllDailyArchive',
  //     payload: {
  //       page: 1,
  //       size: 10,
  //     },
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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
        if (text === 1)
          return intl.formatMessage({
            id: 'view.storage.type_image',
          });
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
      <ContainerFilterDailyArchive>
        <Form name="basic" onFinish={onFinish} autoComplete="off" form={form}>
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

      <ProTableStyled
        loading={loading}
        rowKey={'id'}
        search={false}
        options={false}
        dataSource={list}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: (event) => {
              handleOpenDrawerView(record);
            },
          };
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
          total: metadata?.total,
          // onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />

      {captureSelected !== null && (
        <DrawerViewCapture
          isOpenView={isOpenView}
          data={captureSelected}
          onClose={handleCloseDrawerView}
        />
      )}
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.dailyArchive;
  return {
    loading: state.loading.models.dailyArchive,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(TableDailyArchive);
