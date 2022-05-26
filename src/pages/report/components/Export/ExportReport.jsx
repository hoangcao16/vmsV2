import { notify } from '@/components/Notify';
import ReportApi from '@/services/report/ReportApi';
import { ExportOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import fileDownload from 'js-file-download';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getLocale } from 'umi';

const ExportReport = (props) => {
  const [currentLanguage, setCurrentLanguage] = useState('vn');

  useEffect(() => {
    if (getLocale() == 'en-US') {
      setCurrentLanguage('en');
    } else {
      setCurrentLanguage('vn');
    }
  }, []);

  const handleExport = async () => {
    const params = {
      ...props?.filterParams,
      typeChart: 'tableReport',
      lang: currentLanguage,
    };
    try {
      await ReportApi.getExportData(params).then((result) => {
        console.log('result', result);
        if (result.type === 'application/octet-stream') {
          const data = new Blob([result], { type: 'application/vnd.ms-excel' });
          fileDownload(data, `Report_${moment().format('DD.MM.YYYY_HH.mm.ss')}.xlsx`);
          notify('success', 'noti.success', 'report.export.success');
        } else {
          notify('success', 'noti.success', 'report.export.failed');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return <ExportOutlined onClick={handleExport} />;
};

function mapStateToProps(state) {
  return { filterParams: state?.chart?.payload };
}

export default connect(mapStateToProps)(ExportReport);
