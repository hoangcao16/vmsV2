import { notify } from '@/components/Notify';
import ReportApi from '@/services/report/ReportApi';
import getCurrentLocale from '@/utils/Locale';
import { ExportOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { connect } from 'dva';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useIntl } from 'umi';
import React from 'react';

const ExportReport = (props) => {
  const intl = useIntl();
  const handleExport = async () => {
    const params = {
      ...props?.filterParams,
      typeChart: 'tableReport',
      lang: getCurrentLocale(),
    };
    try {
      await ReportApi.getExportData(params).then((result) => {
        console.log('result', result);
        if (result.type === 'application/octet-stream') {
          const data = new Blob([result], { type: 'application/vnd.ms-excel' });
          fileDownload(data, `Report_${moment().format('DD.MM.YYYY_HH.mm.ss')}.xlsx`);
          notify('success', 'noti.success', 'report.export.success');
        } else {
          notify('error', 'noti.faid', 'report.export.failed');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Tooltip
      placement="left"
      title={intl.formatMessage({ id: 'pages.report.export.exportReprot' })}
    >
      <ExportOutlined onClick={handleExport} />
    </Tooltip>
  );
};

function mapStateToProps(state) {
  return { filterParams: state?.chart?.payload };
}

export default connect(mapStateToProps)(ExportReport);
