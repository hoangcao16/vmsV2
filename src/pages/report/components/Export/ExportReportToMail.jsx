import { SendOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import React from 'react';

const ExportReportToMail = (props) => {
  return <SendOutlined />;
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ExportReportToMail);
