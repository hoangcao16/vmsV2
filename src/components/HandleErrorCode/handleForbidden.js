import { notify } from '../Notify';
import { getLocale } from 'umi';
import UserApi from '@/services/user/UserApi';
const StatusForbidden = 605;
const handleForbiddenCode = (forbiddenCodes, error) => {
  let description = 'error.NO_PERMISSION';
  if (error) {
    description = 'error.CANNOT_DELETE';
  }
  if (forbiddenCodes) {
    let data = {
      page: 0,
      size: 1000000,
      filter: '',
      lang: `${getLocale() == 'en-US' ? 'en' : 'vn'}`,
    };
    let forbiddenNames = [];
    UserApi.getPermissions(data).then((result) => {
      if (result?.payload) {
        forbiddenCodes.map((code) => {
          const data = result?.payload.filter((r) => code === r.code);
          if (data && data.length > 0) {
            data.map((e) => forbiddenNames.push(e.name));
          }
        });
        if (forbiddenNames.length > 0) {
          description = {
            id: 'error.DO_NOT_HAVE_PERMISSION',
            params: { action: forbiddenNames.join(', ') },
          };
        }
        notify('error', { id: 'noti.error_code', params: { code: StatusForbidden } }, description);
      }
    });
  } else {
    notify('error', { id: 'noti.error_code', params: { code: StatusForbidden } }, description);
  }
  return null;
};
export default handleForbiddenCode;
