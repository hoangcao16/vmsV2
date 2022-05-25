import { appIntl } from '../IntlGlobalProvider';
import fileDownload from 'js-file-download';
import moment from 'moment';
export const ExportFileDownload = (data, fileName) => {
  const intl = appIntl();
  return fileDownload(
    data,
    `${intl.formatMessage({ id: fileName })}${moment().format('HHmmss_DDMMYYYY')}.xlsx`,
  );
};
