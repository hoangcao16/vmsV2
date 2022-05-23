import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import AddressApi from '@/services/address/AddressApi';
import AdDivisionApi from '@/services/advision/AdDivision';
import cameraApi from '@/services/controller-api/cameraService';
import EventAiAPI from '@/services/storage-api/EventAI-api';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Badge, Button, Col, DatePicker, Form, Input, Row, Select, Space, Tooltip } from 'antd';
import locale from 'antd/lib/date-picker/locale/vi_VN';
import debounce from 'lodash/debounce';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaThLarge, FaThList } from 'react-icons/fa';
import { connect, useIntl } from 'umi';
import GridViewEventAI from './components/GridViewEventAI/GridViewEventAI';
import { CellCreateTime, ContainerFilterEventAI, ProTableStyled } from './style';

const layoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const layoutShort = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};

function EventAI({ list, dispatch, metadata, loading }) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [collapse, setCollapse] = useState(true);

  const [cameraGroupList, setCameraGroupList] = useState([]);
  const [cameraList, setCameraList] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [adminUnitList, setAdminUnitList] = useState([]);

  const [eventList, setEventList] = useState([]);

  const [viewType, setViewType] = useState('list');

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...metadata, page, size });

    dispatch({
      type: 'eventAI/fetchAllEventsAI',
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
      type: 'eventAI/saveSearchParam',
      payload: dataParam,
    });

    dispatch({
      type: 'eventAI/fetchAllEventsAI',
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
      type: 'eventAI/saveSearchParam',
      payload: dataParam,
    });

    dispatch({
      type: 'eventAI/fetchAllEventsAI',
      payload: dataParam,
    });
  };

  const onChangeCamera = (cameraUuid) => {
    const dataParam = Object.assign({ ...metadata, cameraUuid: cameraUuid });
    dispatch({
      type: 'eventAI/saveSearchParam',
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
      type: 'eventAI/saveSearchParam',
      payload: dataParam,
    });
  };

  const getAllCamera = (cameraGroupUuid) => {
    cameraApi
      .getAllAI({
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
          type: 'eventAI/saveSearchParam',
          payload: dataParam,
        });
        setStartDate(null);
      } else {
        const dataParam = Object.assign({
          ...metadata,
          startRecordTime: +moment.unix(),
        });
        dispatch({
          type: 'eventAI/saveSearchParam',
          payload: dataParam,
        });
        setStartDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...metadata, startRecordTime: -1 });
      dispatch({
        type: 'eventAI/saveSearchParam',
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
          type: 'eventAI/saveSearchParam',
          payload: dataParam,
        });
        setEndDate(null);
      } else {
        const dataParam = Object.assign({
          ...metadata,
          endRecordTime: +moment.unix(),
        });
        dispatch({
          type: 'eventAI/saveSearchParam',
          payload: dataParam,
        });
        setEndDate(moment);
      }
    } else {
      const dataParam = Object.assign({ ...metadata, endRecordTime: -1 });
      dispatch({
        type: 'eventAI/saveSearchParam',
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
      type: 'eventAI/saveSearchParam',
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
      type: 'eventAI/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeWard = (wardId) => {
    const dataParam = Object.assign({ ...metadata, wardId: wardId });
    dispatch({
      type: 'eventAI/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeUnit = (unitId) => {
    const dataParam = Object.assign({
      ...metadata,
      administrativeUnitUuid: unitId,
    });
    dispatch({
      type: 'eventAI/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeEventType = (eventUuid) => {
    const dataParam = Object.assign({
      ...metadata,
      eventType: eventUuid,
    });

    dispatch({
      type: 'eventAI/saveSearchParam',
      payload: dataParam,
    });
  };

  const onChangeProcessStatus = (status) => {
    const dataParam = Object.assign({
      ...metadata,
      status: status,
    });

    dispatch({
      type: 'eventAI/saveSearchParam',
      payload: dataParam,
    });
  };

  //

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

    //

    EventAiAPI.getAiEventType({ name: '', type: REACT_APP_AI_SOURCE })
      .then((res) => {
        setEventList(res.payload);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  //   dispatch({
  //     type: 'eventAI/fetchAllEventsAI',
  //     payload: {
  //       page: 1,
  //       size: 10,
  //     },
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const renderSubtype = (value) => {
    return (
      <Tooltip
        title={intl.formatMessage({
          id: 'view.ai_events.' + value,
        })}
      >
        <span>
          {intl.formatMessage({
            id: 'view.ai_events.' + value,
          })}
        </span>
      </Tooltip>
    );
  };

  const renderStatus = (value) => {
    return (
      <>
        {value === 'process' && <Badge color="yellow" />}
        {value === 'processed' && <Badge color="green" />}
        {value === 'not_processed' && <Badge color="red" />}

        {intl.formatMessage({
          id: 'view.ai_events.processingStatus.' + value,
        })}
      </>
    );
  };

  const renderName = (value) => {
    if (value && value.length > 30) {
      return (
        <Tooltip title={value}>
          <span>
            {value.substr(0, 15) + '...' + value.substr(value.length - 15, value.length - 1)}
          </span>
        </Tooltip>
      );
    } else {
      return value;
    }
  };

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
        id: 'view.storage.event',
      }),
      dataIndex: 'eventType',
      render: renderSubtype,
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
        id: 'view.penaltyTicket.ticket_num',
      }),
      dataIndex: 'penaltyTicketId',
    },

    {
      title: intl.formatMessage({
        id: 'view.common_device.status',
      }),
      dataIndex: 'status',
      render: renderStatus,
    },

    {
      title: intl.formatMessage({
        id: 'view.storage.note',
      }),
      dataIndex: 'note',
      render: renderName,
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
    <div>
      <ContainerFilterEventAI>
        <Form
          className="formFilterDailyArchive"
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
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

            <Space className="collapse-filter__right">
              <Button
                className="btn-viewType"
                type={viewType === 'list' ? 'link' : 'default'}
                icon={<FaThList />}
                onClick={() => {
                  setViewType('list');
                }}
              />
              <Button
                className="btn-viewType"
                type={viewType === 'grid' ? 'link' : 'default'}
                icon={<FaThLarge />}
                onClick={() => {
                  setViewType('grid');
                }}
              />
            </Space>
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
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </ContainerFilterEventAI>

      {viewType === 'list' && (
        <ProTableStyled
          loading={loading}
          rowKey={'id'}
          search={false}
          options={false}
          dataSource={list}
          columns={columns}
          // onRow={(record) => {
          //   return {
          //     onClick: (event) => {
          //       handleOpenDrawerView(record);
          //     },
          //   };
          // }}
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
      )}

      {viewType === 'grid' && <GridViewEventAI />}
    </div>
  );
}

function mapStateToProps(state) {
  const { list, metadata } = state.eventAI;
  return {
    loading: state.loading.models.eventAI,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(EventAI);
