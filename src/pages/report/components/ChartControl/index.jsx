import {
  disableOptions,
  filterOptionForChart,
  normalizeOptions,
} from '@/components/select/CustomSelect';
import AddressApi from '@/services/address/AddressApi';
import cameraApi from '@/services/controller-api/cameraService';
import { Checkbox, Col, ConfigProvider, DatePicker, Form, Row, Select, Tag } from 'antd';
import locale from 'antd/es/locale/en_GB';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/en-gb';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import './ChartControl.less';

const { RangePicker } = DatePicker;

moment.locale('en-gb', {
  week: {
    dow: 1,
  },
});

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const feildData = {
  feild: 'giaothong',
  event: {
    daudo: 'daudosaiquydinh',
    vuotdendo: 'vuotdendo',
  },
};

const typeTime = {
  DAY: 'day',
  MONTH: 'month',
  WEEK: 'week',
  YEAR: 'year',
};

const CheckAll = styled.div`
  background-color: #434343;
  padding: 0 12px;
  margin: 12px 0 6px;
`;

const TypeWapper = styled.div`
  padding: 12px 24px;
`;

const ChartControl = (props) => {
  const defaultProvinceId = '2';
  const [format, setFormat] = useState('DD/MM/YYYY');
  const [formatParams, setFormatParams] = useState('DDMMYYYY');
  const [form] = Form.useForm();
  const [formValue, setFormValue] = useState({});
  const [allDistricts, setAllDistricts] = useState([]);
  const [allWards, setAllWards] = useState([]);
  const [allAiCamera, setAllAiCamera] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
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
    if (!isEmpty(props?.allFiedls)) {
      props?.allFiedls.forEach((i) => {
        i.value = i?.name;
      });
      const fieldFilter = props?.allFiedls.filter((item) => item.nameNoAccent == feildData.feild);
      if (!isEmpty(fieldFilter)) {
        form.setFieldsValue({ fieldId: fieldFilter[0].uuid });
        setEvents(fieldFilter[0]?.eventList);
      } else {
        form.setFieldsValue({ fieldId: props?.allFiedls[0].uuid });
        setEvents(props?.allFiedls[0]?.eventList);
      }

      props.dispatch({
        type: 'chartControl/emptyFieldId',
        boolean: false,
      });

      if (!isEmpty(fieldFilter)) {
        const eventsFilter = fieldFilter[0]?.eventList.filter(
          (item) =>
            item.nameNoAccent == feildData.event.daudo ||
            item.nameNoAccent == feildData.event.vuotdendo,
        );
        if (!isEmpty(eventsFilter) && eventsFilter.length >= 2) {
          form.setFieldsValue({ eventIds: [eventsFilter[0].uuid, eventsFilter[1].uuid] });
        } else if (!isEmpty(eventsFilter) && eventsFilter.length == 1) {
          form.setFieldsValue({ eventIds: [eventsFilter[0].uuid] });
        } else {
          form.setFieldsValue({ eventIds: [] });
        }
      } else {
        form.setFieldsValue({ eventIds: events[0]?.uuid });
      }

      if (isEmpty(form.getFieldValue('eventIds'))) {
        props.dispatch({
          type: 'chartControl/emptyEventIds',
          boolean: true,
        });
      } else {
        props.dispatch({
          type: 'chartControl/emptyEventIds',
          boolean: false,
        });
      }
    } else {
      props.dispatch({
        type: 'chartControl/emptyFieldId',
        boolean: true,
      });
      props.dispatch({
        type: 'chartControl/emptyEventIds',
        boolean: true,
      });
    }
  }, [props?.allFiedls]);

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

  const onChange = (list) => {
    setIndeterminate(list.length && list.length < events.length);
    setCheckAll(list.length === events.length);
  };

  const onCheckAllChange = (e) => {
    if (e.target.checked) {
      const array = [];
      events.forEach((item) => {
        array.push(item.uuid);
      });
      form.setFieldsValue({ eventIds: array });
      if (events.length >= 2) {
        props.dispatch({ type: 'chartDisable/pieChartDisable', boolean: false });
      } else {
        props.dispatch({ type: 'chartDisable/pieChartDisable', boolean: true });
      }
    } else {
      form.setFieldsValue({ eventIds: [] });
      props.dispatch({ type: 'chartDisable/pieChartDisable', boolean: true });
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    form.submit();
  };

  const handleFilter = ({
    typeDate,
    dateRange,
    provinceId,
    districtId,
    wardId,
    fieldId,
    eventIds,
  }) => {
    if (isEmpty(fieldId)) {
      props.dispatch({
        type: 'chartControl/emptyFieldId',
        boolean: true,
      });
      return;
    } else {
      props.dispatch({
        type: 'chartControl/emptyFieldId',
        boolean: false,
      });
    }

    if (isEmpty(eventIds)) {
      props.dispatch({
        type: 'chartControl/emptyEventIds',
        boolean: true,
      });
      return;
    } else {
      props.dispatch({
        type: 'chartControl/emptyEventIds',
        boolean: false,
      });
    }

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
        type: 'chart/timeoutData',
        boolean: true,
      });
    } else {
      let params = {
        typeTime: typeDate.toUpperCase(),
        startDate: moment(dateRange[0]).format(formatParams),
        endDate: moment(dateRange[1]).format(formatParams),
        provinceIds: provinceId?.toString(),
        districtIds: districtId?.toString(),
        wardIds: wardId?.toString(),
        eventUuids: form.getFieldValue('eventIds').toString(),
        cameraUuids: form.getFieldValue('aiCamera').toString(),
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
        type: 'chart/timeoutData',
        boolean: false,
      });
    }
  };

  const onValuesChange = ({
    typeDate,
    dateRange,
    provinceId,
    districtId,
    wardId,
    aiCamera,
    fieldId,
    eventIds,
    ...values
  }) => {
    setFormValue({
      typeDate,
      dateRange,
      provinceId,
      districtId,
      wardId,
      fieldId,
      aiCamera,
      eventIds,
      ...values,
    });

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
      props.dispatch({ type: 'chartDisable/barChartDisable', boolean: true });
      props.dispatch({ type: 'chartDisable/chooseCurrentTabWhenChangeChartControl', payload: '1' });
    }

    if (provinceId && provinceId.length > 1) {
      form.setFieldsValue({
        districtId: [],
        wardId: [],
      });
      props.dispatch({ type: 'chartDisable/barChartDisable', boolean: false });
    }

    if ((districtId && districtId.length > 1) || (wardId && wardId.length > 1)) {
      props.dispatch({ type: 'chartDisable/barChartDisable', boolean: false });
    } else if ((districtId && districtId.length == 1) || (wardId && wardId.length == 1)) {
      props.dispatch({ type: 'chartDisable/barChartDisable', boolean: true });
      props.dispatch({ type: 'chartDisable/chooseCurrentTabWhenChangeChartControl', payload: '1' });
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

    let array = eventIds || [];

    if (fieldId) {
      const currentField = props?.allFiedls.find((item) => item.uuid == fieldId);
      setEvents(currentField?.eventList);
      if (!isEmpty(currentField.eventList)) {
        //eslint-disable-next-line react-hooks/exhaustive-deps
        array = [currentField?.eventList[0]?.uuid];
        form.setFieldsValue({
          eventIds: [currentField?.eventList[0]?.uuid],
        });
      } else {
        form.setFieldsValue({
          eventIds: [],
        });
        jhhjkgghhgfsdszz;
      }
    }

    if (array && !isEmpty(array) && array.length <= 1) {
      props.dispatch({ type: 'chartDisable/pieChartDisable', boolean: true });
      props.dispatch({ type: 'chartDisable/chooseCurrentTabWhenChangeChartControl', payload: '1' });
    }

    if (array && array.length > 1) {
      props.dispatch({ type: 'chartDisable/pieChartDisable', boolean: false });
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
      <div className="chartControl-title">
        {intl.formatMessage({
          id: `pages.report.chart.filter`,
        })}
      </div>
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
            fieldId: [],
            aiCamera: [],
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
            <Form.Item
              name="dateRange"
              label={intl.formatMessage({
                id: `pages.report.chart.dateRange`,
              })}
            >
              <PickerWithType picker={form.getFieldValue('typeDate')} format={format} />
            </Form.Item>
            <span>
              {intl.formatMessage({
                id: `pages.report.chart.area`,
              })}
            </span>
            <Form.Item name="provinceId">
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
              <Form.Item name="districtId">
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
                <Form.Item name="wardId">
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
            <Form.Item name="aiCamera" label="Camera AI">
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
            <Form.Item
              name="fieldId"
              label={intl.formatMessage({
                id: `pages.report.chart.field`,
              })}
            >
              <Select
                allowClear={false}
                showSearch
                datasource={props?.allFiedls}
                filterOption={filterOptionForChart}
                placeholder="Field"
              >
                {normalizeOptions('name', 'uuid', props?.allFiedls).map(({ label, value }) => (
                  <Select.Option
                    disabled={disableOptions(form.getFieldValue('fieldId'), value, 100000)}
                    value={value}
                  >
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span>
              {intl.formatMessage({
                id: `pages.report.chart.eventType`,
              })}
            </span>
            <CheckAll>
              <Form.Item name="checkAll">
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  {intl.formatMessage({
                    id: `pages.report.chart.checkAll`,
                  })}
                </Checkbox>
              </Form.Item>
            </CheckAll>
            <TypeWapper>
              <Form.Item name="eventIds">
                <CheckboxGroup onChange={onChange}>
                  {normalizeOptions('name', 'uuid', events, false).map(({ label, value }) => (
                    <Row>
                      <Col span={24}>
                        <Checkbox value={value}>{label}</Checkbox>
                      </Col>
                    </Row>
                  ))}
                </CheckboxGroup>
              </Form.Item>
            </TypeWapper>
          </div>
        </Form>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    allProvinces: state?.globalstore?.provincesOptions,
    allFiedls: state?.globalstore?.fieldsOptions,
  };
}

export default connect(mapStateToProps)(ChartControl);
