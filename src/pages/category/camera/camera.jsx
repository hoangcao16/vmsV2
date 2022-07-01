/* eslint-disable react-hooks/exhaustive-deps */
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import { CAMERASTATUS } from '@/constants/common';
import AddressApi from '@/services/addressApi';
import {
  DownloadOutlined,
  DownOutlined,
  PlusOutlined,
  RightOutlined,
  ScanOutlined,
} from '@ant-design/icons';
import { Button, Col, Empty, Form, Input, Row, Select, Tooltip } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getLocale, useIntl } from 'umi';
import AddCamera from './components/AddCamera';
import EditCamera from './components/EditCamera';
import ScanCamera from './components/ScanCamera';
import { ContainerFilterDailyArchive, ProTableStyle, SpanCode, StyledColFilter } from './style';

const CustomRow = styled.div`
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 24 },
};

const searchCaptureFileParamDefault = {
  page: 1,
  size: 10,
};

const CameraList = ({
  dispatch,
  list,
  metadata,
  closeDrawerState,
  adDivisionsOptions,
  vendorsOptions,
  provincesOptions,
  selectedIp,
}) => {
  const [form] = Form.useForm();
  const [isAddNewDrawer, setIsAddNewDrawer] = useState(false);
  const [isEditDrawer, setIsEditDrawer] = useState(false);
  const [isScanDrawer, setIsScanDrawer] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [searchParam, setSearchParam] = useState(searchCaptureFileParamDefault);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const intl = useIntl();
  const statusList = [
    {
      label: intl.formatMessage({ id: 'view.camera.active' }),
      value: CAMERASTATUS.SUCCESS,
    },
    {
      label: intl.formatMessage({ id: 'view.camera.inactive' }),
      value: CAMERASTATUS.ERRORS,
    },
  ];
  const handleEdit = (uuid) => {
    setIsEditDrawer(true);
    dispatch({
      type: 'camera/selectUuidEdit',
      payload: uuid,
    });
  };
  const onFinish = (values) => {
    const data = { ...searchParam, page: searchCaptureFileParamDefault.page };
    handleGetListCamera(data);
  };
  const handleAddCameraScan = async (ip) => {
    await dispatch({
      type: 'scanCamera/saveSelectedIp',
      payload: ip,
    });
  };
  useEffect(() => {
    if (selectedIp) {
      setIsAddNewDrawer(true);
    }
  }, [selectedIp]);
  const handleGetListCamera = (searchParam) => {
    dispatch({
      type: 'camera/fetchAllCamera',
      payload: searchParam,
    });
  };
  const handleQuickSearchPaste = (event) => {
    const value = event.target.value.trimStart();
    form.setFieldsValue({
      searchValue: value,
    });
  };

  const handleQuickSearchBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      searchValue: value,
    });
  };

  const onQuickSearchHandler = (e) => {
    const value = e.target.value.trim();

    const dataParam = Object.assign({
      ...searchParam,
      searchType: value === '' ? undefined : 'all',
      searchValue: value === '' ? undefined : value,
      page: 1,
      size: 10,
    });

    handleGetListCamera(dataParam);
    setSearchParam(dataParam);
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
    const dataParam = Object.assign({
      ...searchParam,
      provinceId: cityId,
      districtId: null,
      wardId: null,
    });
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
    const dataParam = Object.assign({ ...searchParam, districtId: districtId, wardId: null });
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
  const onChangeVendor = (vendorId) => {
    const dataParam = Object.assign({
      ...searchParam,
      vendorUuid: vendorId,
    });
    setSearchParam(dataParam);
  };
  const onChangeStatus = (status) => {
    const dataParam = Object.assign({ ...searchParam, recordingStatus: status });
    setSearchParam(dataParam);
  };
  const columns = [
    {
      title: intl.formatMessage(
        { id: 'view.map.camera_id' },
        {
          cam: '',
        },
      ),
      dataIndex: 'code',
      key: 'code',
      render: (text) => {
        return <SpanCode>{text}</SpanCode>;
      },
    },
    {
      title: intl.formatMessage(
        { id: 'view.map.camera_name' },
        {
          cam: intl.formatMessage({ id: 'camera' }),
        },
      ),
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return (
          <Tooltip title={text}>
            <CustomRow>{text}</CustomRow>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'view.map.province_id',
      }),
      dataIndex: 'provinceName',
      key: 'provinceName',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.district_id',
      }),
      dataIndex: 'districtName',
      key: 'districtName',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.ward_id',
      }),
      dataIndex: 'wardName',
      key: 'wardName',
    },
    {
      title: intl.formatMessage({
        id: 'view.map.address',
      }),
      dataIndex: 'address',
      key: 'address',
      render: (text) => {
        return (
          <Tooltip title={text}>
            <CustomRow>{text}</CustomRow>
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'view.map.zone',
      }),
      dataIndex: 'zoneName',
      key: 'zoneName',
    },
    {
      title: intl.formatMessage({
        id: 'view.common_device.status',
      }),
      dataIndex: 'recordingStatus',
      hideInForm: true,
      valueEnum: {
        0: {
          text: intl.formatMessage({
            id: 'view.user.detail_list.pause',
          }),
          status: 'Default',
        },
        1: {
          text: intl.formatMessage({
            id: 'view.camera.active',
          }),
          status: 'Success',
        },
        2: {
          text: intl.formatMessage({
            id: 'view.camera.error',
          }),
          status: 'Error',
        },
      },
      key: 'cameraStatus',
    },
  ];
  const onPaginationChange = (page, size) => {
    console.log(page, size);
    const dataParam = Object.assign({ ...searchParam, page, size });
    setSearchParam(dataParam);
    handleGetListCamera(dataParam);
  };

  const handleShowFilter = () => {
    setCollapse(true);
    const dataParam = Object.assign({
      ...searchParam,
      searchType: undefined,
      searchValue: undefined,
      page: 1,
      size: 10,
    });
    console.log(dataParam);
    setSearchParam(dataParam);
  };

  const handleClearFilter = () => {
    form.resetFields();
    const dataParam = Object.assign({
      ...searchParam,
      administrativeUnitUuid: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      recordingStatus: '',
      vendorUuid: '',
      address: '',
    });
    setSearchParam(dataParam);
  };
  useEffect(() => {
    dispatch({
      type: 'camera/fetchAllCamera',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
        name: '',
      },
    });
  }, []);
  useEffect(() => {
    setIsAddNewDrawer(false);
    setIsEditDrawer(false);
  }, [closeDrawerState]);
  //export excel camera
  const handleExport = async () => {
    const data = { ...searchParam, lang: `${getLocale() == 'en-US' ? 'en' : 'vn'}` };
    dispatch({
      type: 'camera/exportDataCamera',
      payload: data,
    });
  };
  return (
    <>
      <ProTableStyle
        headerTitle={intl.formatMessage(
          {
            id: 'view.camera.camera_list',
          },
          {
            cam: intl.formatMessage({
              id: 'camera',
            }),
          },
        )}
        rowKey="uuid"
        search={false}
        dataSource={list}
        columns={columns}
        locale={{
          emptyText: <Empty description={intl.formatMessage({ id: 'view.ai_config.no_data' })} />,
        }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              handleEdit(record?.uuid);
            },
          };
        }}
        options={false}
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
                  <Form.Item
                    name="searchValue"
                    // rules={[
                    //   {
                    //     max: 254,
                    //     message: intl.formatMessage({ id: 'noti.255_characters_limit' }),
                    //   },
                    // ]}
                  >
                    <Input.Search
                      allowClear
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
                      disabled={collapse}
                    />
                  </Form.Item>

                  {collapse === true ? (
                    <Button
                      type="link"
                      onClick={() => {
                        setCollapse(false);
                        handleClearFilter();
                      }}
                    >
                      {intl.formatMessage({
                        id: 'view.storage.hide_filter',
                      })}
                      <DownOutlined />
                    </Button>
                  ) : (
                    <Button type="link" onClick={handleShowFilter}>
                      {intl.formatMessage({
                        id: 'view.storage.filter',
                      })}
                      <RightOutlined />
                    </Button>
                  )}
                </div>
                {collapse === true && (
                  <div className="extra-filter">
                    <Row>
                      <Col span={7} offset={1}>
                        <Form.Item
                          {...formItemLayout}
                          label={intl.formatMessage({ id: 'view.map.province_id' })}
                          name="provinceId"
                        >
                          <Select
                            allowClear
                            showSearch
                            onChange={(cityId) => onChangeCity(cityId)}
                            filterOption={filterOption}
                            options={normalizeOptions('name', 'provinceId', provincesOptions)}
                            placeholder={intl.formatMessage({ id: 'view.map.province_id' })}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={7} offset={1}>
                        <Form.Item
                          {...formItemLayout}
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
                      <Col span={7} offset={1}>
                        <Form.Item
                          {...formItemLayout}
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
                    </Row>
                    <Row>
                      <Col span={7} offset={1}>
                        <Form.Item
                          {...formItemLayout}
                          label={intl.formatMessage({ id: 'view.map.administrative_unit' })}
                          name="administrativeUnitUuid"
                        >
                          <Select
                            showSearch
                            allowClear
                            onChange={(id) => onChangeUnit(id)}
                            filterOption={filterOption}
                            options={normalizeOptions('name', 'uuid', adDivisionsOptions)}
                            placeholder={intl.formatMessage({ id: 'view.map.administrative_unit' })}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={7} offset={1}>
                        <Form.Item
                          {...formItemLayout}
                          label={intl.formatMessage({ id: 'view.map.vendor' })}
                          name="vendorUuid"
                        >
                          <Select
                            showSearch
                            allowClear
                            onChange={(id) => onChangeVendor(id)}
                            filterOption={filterOption}
                            options={normalizeOptions('name', 'uuid', vendorsOptions)}
                            placeholder={intl.formatMessage({ id: 'view.map.choose_vendor' })}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={7} offset={1}>
                        <Form.Item
                          {...formItemLayout}
                          label={intl.formatMessage({ id: 'view.storage.street' })}
                          name="address"
                        >
                          <Input
                            allowClear
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
                      <Col span={7} offset={1}>
                        <Form.Item
                          {...formItemLayout}
                          label={intl.formatMessage({ id: 'view.common_device.status' })}
                          name="recordingStatus"
                        >
                          <Select
                            showSearch
                            allowClear
                            onChange={(id) => onChangeStatus(id)}
                            filterOption={filterOption}
                            options={normalizeOptions('label', 'value', statusList)}
                            placeholder={intl.formatMessage({ id: 'view.common_device.status' })}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <StyledColFilter span={24}>
                      <Button htmlType="submit" type="primary">
                        {intl.formatMessage({ id: 'view.map.btn_apply' })}
                      </Button>
                      <Button onClick={handleClearFilter}>
                        {intl.formatMessage({ id: 'view.map.btn_remove_filter' })}
                      </Button>
                    </StyledColFilter>
                  </div>
                )}
              </Form>
            </ContainerFilterDailyArchive>
          ),
          actions: [
            <Tooltip key="scan" title={intl.formatMessage({ id: 'view.camera.camera_scan' })}>
              <Button
                icon={<ScanOutlined />}
                onClick={() => {
                  setIsScanDrawer(true);
                }}
              />
            </Tooltip>,
            <Tooltip key="export" title={intl.formatMessage({ id: 'view.report.export_data' })}>
              <Button icon={<DownloadOutlined />} onClick={() => handleExport()} />
            </Tooltip>,
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setIsAddNewDrawer(true);
              }}
            >
              <PlusOutlined />
              {intl.formatMessage({
                id: 'view.camera.add_camera',
              })}
            </Button>,
          ],
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'view.camera.total',
            })} ${total} camera`,
          total: metadata?.total,
          onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
      <AddCamera isAddNewDrawer={isAddNewDrawer} setIsAddNewDrawer={setIsAddNewDrawer} />
      <EditCamera isEditDrawer={isEditDrawer} setIsEditDrawer={setIsEditDrawer} />
      <ScanCamera
        isScanDrawer={isScanDrawer}
        setIsScanDrawer={setIsScanDrawer}
        handleAddCameraScan={handleAddCameraScan}
      />
    </>
  );
};
function mapStateToProps(state) {
  const { list, metadata, closeDrawerState } = state.camera;
  const { adDivisionsOptions, vendorsOptions, provincesOptions } = state.globalstore;
  const { selectedIp } = state.scanCamera;
  return {
    loading: state.loading.models.camera,
    list,
    metadata,
    closeDrawerState,
    adDivisionsOptions,
    vendorsOptions,
    provincesOptions,
    selectedIp,
  };
}

export default connect(mapStateToProps)(CameraList);
