import FieldEventApi from '@/services/fieldEvent/FieldEventApi';
import { ConfigProvider, DatePicker, Form, Select, Space } from 'antd';
import locale from 'antd/es/locale/en_GB';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import moment from 'moment';
import 'moment/locale/en-gb';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';

moment.locale('en-gb', {
  week: {
    dow: 1,
  },
});

const { Option } = Select;

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

const typeChart = {
  PIE: 'pie',
  LINE: 'line',
};

const PickerWithType = (props) => {
  return (
    <ConfigProvider locale={locale}>
      <DatePicker allowClear={false} {...props} />
    </ConfigProvider>
  );
};

const DatePickerForm = (props) => {
  const [format, setFormat] = useState('DD/MM/YYYY');
  const [formatParams, setFormatParams] = useState('DDMMYYYY');
  const [form] = Form.useForm();
  const [allFields, setAllFields] = useState([]);
  const [eventsUuid, setEventsUuid] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    form.submit();
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

  useEffect(() => {
    if (isEmpty(allFields)) {
      props.dispatch({
        type: 'chartControl/emptyFieldId',
        boolean: true,
      });
      props.dispatch({
        type: 'chartControl/emptyEventIds',
        boolean: true,
      });
    } else {
      const fieldFilter = allFields.filter((item) => item.nameNoAccent == feildData.feild);
      if (!isEmpty(fieldFilter)) {
        const eventsFilter = fieldFilter[0]?.eventList.filter(
          (item) =>
            item.nameNoAccent == feildData.event.daudo ||
            item.nameNoAccent == feildData.event.vuotdendo,
        );
        if (!isEmpty(eventsFilter)) {
          setEventsUuid([eventsFilter[0]?.uuid, eventsFilter[1]?.uuid] || [eventsFilter[0]?.uuid]);
          props.dispatch({
            type: 'chartControl/emptyEventIds',
            boolean: false,
          });
        }
      } else {
        setEventsUuid(allFields[0]?.eventList[0]?.uuid || []);
        if (isEmpty(allFields[0]?.eventList[0]?.uuid)) {
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
      }
      props.dispatch({
        type: 'chartControl/emptyFieldId',
        boolean: false,
      });
    }
    form.submit();
  }, [allFields]);

  const handleFilter = ({ typeDate, startDate, endDate }) => {
    if (
      (typeDate == typeTime.DAY && moment(endDate).diff(moment(startDate), 'days') >= 12) ||
      (typeDate == typeTime.WEEK &&
        moment(endDate).endOf('weeks').diff(moment(startDate).startOf('weeks'), 'days') >=
          12 * 7) ||
      (typeDate == typeTime.MONTH && moment(endDate).diff(moment(startDate), 'months') >= 12) ||
      (typeDate == typeTime.YEAR && moment(endDate).diff(moment(startDate), 'years') >= 5)
    ) {
      if (props.typeChart == typeChart.PIE) {
        props.dispatch({
          type: 'home/timeoutDataPieChart',
          boolean: true,
        });
      }
      if (props.typeChart == typeChart.LINE) {
        props.dispatch({
          type: 'home/timeoutDataLineChart',
          boolean: true,
        });
      }
    } else {
      let params = {
        typeTime: typeDate.toUpperCase(),
        startDate: moment(startDate).format(formatParams),
        endDate: moment(endDate).format(formatParams),
        provinceIds: '2',
        districtIds: '',
        wardIds: '',
        eventUuids: eventsUuid.toString(),
        cameraUuids: '',
      };

      if (props.typeChart == typeChart.PIE) {
        props.dispatch({
          type: 'home/timeoutDataPieChart',
          boolean: false,
        });
      }
      if (props.typeChart == typeChart.LINE) {
        props.dispatch({
          type: 'home/timeoutDataLineChart',
          boolean: false,
        });
      }

      if (props.typeChart == typeChart.PIE) {
        props.dispatch({
          type: 'chart/changeReportHeaderDataPieChart',
          payload: params,
        });
      } else {
        props.dispatch({
          type: 'chart/changeReportHeaderData',
          payload: params,
        });
      }
    }
  };

  const onValuesChange = ({ typeDate }) => {
    if (typeDate) {
      if (typeDate == 'week') {
        setFormat('WW-YYYY');
        setFormatParams('WWYYYY');
        form.setFieldsValue({
          startDate: moment().subtract(4, 'weeks'),
          endDate: moment(),
        });
      } else if (typeDate == 'month') {
        setFormat('MM/YYYY');
        setFormatParams('MMYYYY');
        form.setFieldsValue({
          startDate: moment().subtract(11, 'months'),
          endDate: moment(),
        });
      } else if (typeDate == 'year') {
        setFormat('YYYY');
        setFormatParams('YYYY');
        form.setFieldsValue({
          startDate: moment().subtract(4, 'years'),
          endDate: moment(),
        });
      } else {
        setFormat('DD/MM/YYYY');
        setFormatParams('DDMMYYYY');
        form.setFieldsValue({
          startDate: moment().subtract(7, 'days'),
          endDate: moment(),
        });
      }
    }

    form.submit();
  };

  return (
    <Form
      form={form}
      onFinish={handleFilter}
      onValuesChange={onValuesChange}
      initialValues={{
        typeDate: 'day',
        startDate: moment().subtract(7, 'days'),
        endDate: moment(),
      }}
    >
      <Space>
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
          name="startDate"
          label={intl.formatMessage({
            id: `pages.report.chart.from`,
          })}
        >
          <PickerWithType picker={form.getFieldValue('typeDate')} format={format} id="start" />
        </Form.Item>
        <Form.Item
          name="endDate"
          label={intl.formatMessage({
            id: `pages.report.chart.to`,
          })}
        >
          <PickerWithType picker={form.getFieldValue('typeDate')} format={format} id="end" />
        </Form.Item>
      </Space>
    </Form>
  );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(DatePickerForm);
