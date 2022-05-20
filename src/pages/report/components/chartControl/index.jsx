import React, { useState, useEffect } from 'react';
import { DatePicker, Select, ConfigProvider, Form, Tag } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import locale from 'antd/es/locale/en_GB';
import { connect } from 'dva';
import { useIntl } from 'umi';
import './ChartControl.less';
import AddressApi from '@/services/address/AddressApi';
import {
  disableOptions,
  filterOptionForChart,
  normalizeOptions,
} from '@/components/select/CustomSelect';
import cameraApi from '@/services/controller-api/cameraService';
import FieldEventApi from '@/services/fieldEvent/FieldEventApi';
const { RangePicker } = DatePicker;

moment.locale('en-gb', {
  week: {
    dow: 1,
  },
});

const { Option } = Select;

const typeTime = {
  DAY: 'day',
  MONTH: 'month',
  WEEK: 'week',
  YEAR: 'year',
};

const ChartControl = (props) => {
  const defaultProvinceId = '2';
  const [format, setFormat] = useState('DD/MM/YYYY');
  const [formatParams, setFormatParams] = useState('DDMMYYYY');
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState({});
  const [allDistricts, setAllDistricts] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [allAiCamera, setAllAiCamera] = useState([]);
  const [allFields, setAllFields] = useState([]);

  const [events, setEvents] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    form.submit();
  }, []);

  useEffect(() => {
    try {
      AddressApi.getDistrictByProvinceId(defaultProvinceId).then((result) => {
        setAllDistricts(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const params = {
      provinceIds: defaultProvinceId,
      districtIds: '',
      wardIds: '',
      size: 100000,
      page: 1,
    };
    try {
      cameraApi.getAllAI(params).then((result) => {
        setAllAiCamera(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      FieldEventApi.getAllFieldEvent().then((result) => {
        setAllFields(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getDistricts = () => {
    try {
      AddressApi.getDistrictByProvinceId(form.getFieldValue('provinceId')).then((result) => {
        setAllDistricts(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getWards = () => {
    try {
      AddressApi.getWardByDistrictId(form.getFieldValue('districtId')).then((result) => {
        setAllWards(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAiCamera = () => {
    const params = {
      provinceIds: form.getFieldValue('provinceId').toString(),
      districtIds: form.getFieldValue('districtId').toString(),
      wardIds: form.getFieldValue('wardId').toString(),
      size: 100000,
      page: 1,
    };
    try {
      cameraApi.getAllAI(params).then((result) => {
        setAllAiCamera(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = ({ typeDate, dateRange, provinceId, districtId, wardId }) => {
    const start = moment(dateRange[0]);
    const end = moment(dateRange[1]);
    if (
      (typeDate == typeTime.DAY && moment(end).diff(moment(start), 'days') >= 12) ||
      (typeDate == typeTime.WEEK &&
        moment(end).endOf('weeks').diff(moment(start).startOf('weeks'), 'days') >= 12 * 7) ||
      (typeDate == typeTime.MONTH && moment(end).diff(moment(start), 'months') >= 12) ||
      (typeDate == typeTime.YEAR && moment(end).diff(moment(start), 'years') >= 5)
    ) {
      props.dispatch({
        type: 'chart/getData',
        boolean: false,
      });
    } else {
      let params = {
        typeTime: typeDate.toUpperCase(),
        startDate: moment(dateRange[0]).format(formatParams),
        endDate: moment(dateRange[1]).format(formatParams),
        provinceIds: provinceId?.toString(),
        districtIds: districtId?.toString(),
        wardIds: wardId?.toString(),
        eventUuids: '57353610-dc42-4096-8a51-9da12ee8b85e,bf943458-8cd3-4bc5-8f8b-e3b583c25f47',
        cameraUuids: '',
      };
      props.dispatch({
        type: 'chart/changeReportHeaderDataPieChart',
        payload: params,
      });
      props.dispatch({
        type: 'chart/changeReportHeaderData',
        payload: params,
      });
      props.dispatch({
        type: 'chart/getData',
        boolean: true,
      });
    }
  };

  const onValuesChange = ({
    typeDate,
    dateRange,
    provinceId,
    districtId,
    wardId,
    fieldId,
    ...values
  }) => {
    setFormValue({ typeDate, dateRange, provinceId, districtId, wardId, fieldId, ...values });
    if (typeDate) {
      if (typeDate == typeTime.WEEK) {
        setFormat('WW-YYYY');
        setFormatParams('WWYYYY');
        form.setFieldsValue({
          dateRange: [moment().subtract(4, 'weeks'), moment()],
        });
      } else if (typeDate == typeTime.MONTH) {
        setFormat('MM/YYYY');
        setFormatParams('MMYYYY');
        form.setFieldsValue({
          dateRange: [moment().subtract(11, 'months'), moment()],
        });
      } else if (typeDate == typeTime.YEAR) {
        setFormat('YYYY');
        setFormatParams('YYYY');
        form.setFieldsValue({
          dateRange: [moment().subtract(4, 'years'), moment()],
        });
      } else {
        setFormat('DD/MM/YYYY');
        setFormatParams('DDMMYYYY');
        form.setFieldsValue({
          dateRange: [moment().subtract(7, 'days'), moment()],
        });
      }
    }

    if (provinceId && provinceId.length == 1) {
      getDistricts();
      setAllWards([]);
    }

    if (provinceId && provinceId.length > 1) {
      form.setFieldsValue({
        districtId: [],
        wardId: [],
      });
    }

    if (districtId && districtId.length == 1) {
      getWards();
    }

    if (districtId && districtId.length !== 1) {
      form.setFieldsValue({
        wardId: [],
      });
    }

    if (provinceId || districtId || wardId) {
      form.setFieldsValue({
        aiCamera: [],
      });
      getAiCamera();
    }

    form.submit();
  };

  const PickerWithType = (props) => {
    return (
      <ConfigProvider locale={locale}>
        <RangePicker allowClear={false} {...props} />
      </ConfigProvider>
    );
  };

  return (
    <div className="chartControl">
      <div className="chartControl-title">Bộ lọc</div>
      <div className="chartControl-filter">
        <Form
          form={form}
          onFinish={handleFilter}
          onValuesChange={onValuesChange}
          initialValues={{
            typeDate: 'day',
            dateRange: [moment().subtract(7, 'days'), moment()],
            provinceId: defaultProvinceId,
            districtId: [],
            wardId: [],
            fieldId: allFields[0]?.uuid || '',
          }}
        >
          <div className="chartControl-filter-items">
            <Form.Item
              name="typeDate"
              label={intl.formatMessage({
                id: `pages.report.chart.by`,
              })}
            >
              <Select>
                <Option value="day">
                  {intl.formatMessage({
                    id: `pages.report.chart.day`,
                  })}
                </Option>
                <Option value="week">
                  {intl.formatMessage({
                    id: `pages.report.chart.week`,
                  })}
                </Option>
                <Option value="month">
                  {intl.formatMessage({
                    id: `pages.report.chart.month`,
                  })}
                </Option>
                <Option value="year">
                  {intl.formatMessage({
                    id: `pages.report.chart.year`,
                  })}
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange" label="Khoảng thời gian">
              <PickerWithType picker={form.getFieldValue('typeDate')} format={format} />
            </Form.Item>
            <Form.Item name="provinceId" label="Provinces">
              <Select
                mode="multiple"
                allowClear={false}
                showSearch
                datasource={props?.allProvinces}
                filterOption={filterOptionForChart}
                tagRender={(prop) => (
                  <Tag
                    closable={form.getFieldValue('provinceId')?.length > 1}
                    onClose={prop.onClose}
                  >
                    {prop.label}
                  </Tag>
                )}
                placeholder="Provinces"
              >
                {normalizeOptions('name', 'provinceId', props?.allProvinces).map(
                  ({ label, value }) => (
                    <Select.Option
                      disabled={disableOptions(form.getFieldValue('provinceId'), value, 5)}
                      value={value}
                    >
                      {label}
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
            {form.getFieldValue('provinceId')?.length == 1 && (
              <Form.Item name="districtId" label="Districts">
                <Select
                  mode="multiple"
                  allowClear={false}
                  showSearch
                  datasource={allDistricts}
                  filterOption={filterOptionForChart}
                  placeholder="Districts"
                >
                  {normalizeOptions('name', 'districtId', allDistricts).map(({ label, value }) => (
                    <Select.Option
                      disabled={disableOptions(form.getFieldValue('districtId'), value, 5)}
                      value={value}
                    >
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {form.getFieldValue('provinceId')?.length == 1 &&
              form.getFieldValue('districtId')?.length <= 1 && (
                <Form.Item name="wardId" label="Wards">
                  <Select
                    mode="multiple"
                    allowClear={false}
                    showSearch
                    datasource={allWards}
                    filterOption={filterOptionForChart}
                    // options={normalizeOptions('name', 'id', allWards)}
                    placeholder="Wards"
                  >
                    {normalizeOptions('name', 'id', allWards).map(({ label, value }) => (
                      <Select.Option
                        disabled={disableOptions(form.getFieldValue('wardId'), value, 5)}
                        value={value}
                      >
                        {label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            <Form.Item name="aiCamera" label="AiCamera">
              <Select
                mode="multiple"
                allowClear={false}
                showSearch
                datasource={allAiCamera}
                filterOption={filterOptionForChart}
                placeholder="AiCamera"
              >
                {normalizeOptions('name', 'uuid', allAiCamera).map(({ label, value }) => (
                  <Select.Option
                    disabled={disableOptions(form.getFieldValue('aiCamera'), value, 100000)}
                    value={value}
                  >
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="fieldId" label="Field">
              <Select
                allowClear={false}
                showSearch
                datasource={allFields}
                filterOption={filterOptionForChart}
                placeholder="Field"
              >
                {normalizeOptions('name', 'uuid', allFields).map(({ label, value }) => (
                  <Select.Option
                    disabled={disableOptions(form.getFieldValue('fieldId'), value, 100000)}
                    value={value}
                  >
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  console.log('state', state);
  return { allProvinces: state?.globalstore?.provincesOptions };
}

export default connect(mapStateToProps)(ChartControl);
