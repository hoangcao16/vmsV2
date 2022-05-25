import React, { useState, useEffect } from 'react';
import { DatePicker, Select, Space, ConfigProvider, Form } from 'antd';
import moment from 'moment';
import 'moment/locale/en-gb';
import locale from 'antd/es/locale/en_GB';
import './ChartHeader.less';
import { connect } from 'dva';
import DatePickerForm from './DatePickerForm';
import { useHistory } from 'react-router-dom';

const ChartHeader = (props) => {
  const [currentPathIsReport, setCurrentPathIsReport] = useState(true);
  let url = useHistory();

  useEffect(() => {
    if (url.location.pathname == '/report') {
      setCurrentPathIsReport(true);
    } else {
      setCurrentPathIsReport(false);
    }
  }, []);

  return (
    <div className="chart-header">
      <div className="chart-header-title">{props.title}</div>
      {currentPathIsReport ? (
        ''
      ) : (
        <div className="chart-header-date">
          <DatePickerForm title={props.title} typeChart={props.typeChart} />
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ChartHeader);
