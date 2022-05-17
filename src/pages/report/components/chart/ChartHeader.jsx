import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Space, ConfigProvider, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import locale from 'antd/es/locale/en_GB';
import './ChartHeader.less';
import { connect } from 'dva';
import { useIntl } from 'umi';
import DatePickerForm from './DatePickerForm';

const ChartHeader = (props) => {
  return (
    <div className="chart-header">
      <div className="chart-header-title">{props.title}</div>
      <div className="chart-header-date">
        <DatePickerForm title={props.title} typeChart={props.typeChart} />
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ChartHeader);
