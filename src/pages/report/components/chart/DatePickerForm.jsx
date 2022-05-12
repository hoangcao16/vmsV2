import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Space, ConfigProvider, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import locale from 'antd/es/locale/en_GB';
import './ChartHeader.less';
import { connect } from 'dva';
import { useIntl } from 'umi';

moment.locale('en-gb', {
  week: {
    dow: 1,
  },
});

const { Option } = Select;

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
  const intl = useIntl();

  useEffect(() => {
    form.submit();
  }, []);

  const handleFilter = ({ typeDate, startDate, endDate }) => {
    let params = {
      typeTime: typeDate.toUpperCase(),
      startDate: moment(startDate).format(formatParams),
      endDate: moment(endDate).format(formatParams),
      provinceIds: '2',
      districtIds: '',
      wardIds: '',
      eventUuids: '57353610-dc42-4096-8a51-9da12ee8b85e,bf943458-8cd3-4bc5-8f8b-e3b583c25f47',
      cameraUuids: '',
    };

    props.dispatch({
      type: 'chart/changeReportHeaderData',
      payload: params,
    });
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
        <Form.Item name="typeDate">
          <Select>
            <Option value="day">
              {intl.formatMessage({
                id: `pages.report.chart.day`,
                defaultMessage: 'name',
              })}
            </Option>
            <Option value="week">
              {intl.formatMessage({
                id: `pages.report.chart.week`,
                defaultMessage: 'name',
              })}
            </Option>
            <Option value="month">
              {intl.formatMessage({
                id: `pages.report.chart.month`,
                defaultMessage: 'name',
              })}
            </Option>
            <Option value="year">
              {intl.formatMessage({
                id: `pages.report.chart.year`,
                defaultMessage: 'name',
              })}
            </Option>
          </Select>
        </Form.Item>
        <Form.Item name="startDate">
          <PickerWithType picker={form.getFieldValue('typeDate')} format={format} id="start" />
        </Form.Item>
        <Form.Item name="endDate">
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
