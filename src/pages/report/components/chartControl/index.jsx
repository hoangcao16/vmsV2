import React, { useState, useEffect } from 'react';
import { DatePicker, Select, ConfigProvider, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import locale from 'antd/es/locale/en_GB';
import { connect } from 'dva';
import { useIntl } from 'umi';
import './ChartControl.less';
import AddressApi from '@/services/address/AddressApi';
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
const { RangePicker } = DatePicker;

moment.locale('en-gb', {
  week: {
    dow: 1,
  },
});

const { Option } = Select;

const ChartControl = (props) => {
  const defaultProvinceId = '2';
  const [format, setFormat] = useState('DD/MM/YYYY');
  const [formatParams, setFormatParams] = useState('DDMMYYYY');
  const [form] = Form.useForm();
  const [provinceId, setProvinceId] = useState([defaultProvinceId]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allWards, setAllWards] = useState([]);
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

  const getDistricts = () => {
    try {
      AddressApi.getDistrictByProvinceId(form.getFieldValue('ProvinceId')).then((result) => {
        setAllDistricts(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getWards = () => {
    try {
      AddressApi.getWardByDistrictId(form.getFieldValue('DistrictId')).then((result) => {
        setAllWards(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = ({ typeDate, dateRange, ProvinceId, DistrictId, WardId }) => {
    let params = {
      typeTime: typeDate.toUpperCase(),
      startDate: moment(dateRange[0]).format(formatParams),
      endDate: moment(dateRange[1]).format(formatParams),
      provinceIds: ProvinceId.toString(),
      districtIds: DistrictId.toString(),
      wardIds: WardId.toString(),
      eventUuids: '57353610-dc42-4096-8a51-9da12ee8b85e,bf943458-8cd3-4bc5-8f8b-e3b583c25f47',
      cameraUuids: '',
    };

    console.log('params', params);

    props.dispatch({
      type: 'chart/changeReportHeaderDataPieChart',
      payload: params,
    });
    props.dispatch({
      type: 'chart/changeReportHeaderData',
      payload: params,
    });
  };

  const onValuesChange = ({ typeDate, ProvinceId, DistrictId }) => {
    if (typeDate) {
      if (typeDate == 'week') {
        setFormat('WW-YYYY');
        setFormatParams('WWYYYY');
        form.setFieldsValue({
          dateRange: [moment().subtract(4, 'weeks'), moment()],
        });
      } else if (typeDate == 'month') {
        setFormat('MM/YYYY');
        setFormatParams('MMYYYY');
        form.setFieldsValue({
          dateRange: [moment().subtract(11, 'months'), moment()],
        });
      } else if (typeDate == 'year') {
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

    if (ProvinceId && ProvinceId.length == 1) {
      getDistricts();
      setAllWards([]);
      setProvinceId(ProvinceId);
    } else if (ProvinceId && ProvinceId.length < 1) {
      form.setFieldsValue({
        ProvinceId: provinceId,
      });
    }
    if (ProvinceId && ProvinceId.length > 1) {
      setProvinceId(ProvinceId);
      form.setFieldsValue({
        DistrictId: undefined,
        WardId: undefined,
      });
    }

    if (DistrictId && DistrictId.length == 1) {
      getWards();
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
            ProvinceId: defaultProvinceId,
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
            <Form.Item name="ProvinceId" label="Provinces">
              <Select
                defaultValue={[defaultProvinceId]}
                mode="multiple"
                allowClear={false}
                showSearch
                datasource={props?.allProvinces}
                filterOption={filterOption}
                options={normalizeOptions('name', 'provinceId', props?.allProvinces)}
                placeholder="Provinces"
              />
            </Form.Item>
            {provinceId.length == 1 && (
              <Form.Item name="DistrictId" label="Districts">
                <Select
                  mode="multiple"
                  allowClear={false}
                  showSearch
                  datasource={allDistricts}
                  filterOption={filterOption}
                  options={normalizeOptions('name', 'districtId', allDistricts)}
                  placeholder="Districts"
                />
              </Form.Item>
            )}

            <Form.Item name="WardId" label="Wards">
              <Select
                mode="multiple"
                allowClear={false}
                showSearch
                datasource={allWards}
                filterOption={filterOption}
                options={normalizeOptions('name', 'id', allWards)}
                placeholder="Wards"
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return { allProvinces: state?.globalstore?.provincesOptions };
}

export default connect(mapStateToProps)(ChartControl);
