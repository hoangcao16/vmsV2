import request from '@/utils/request';
import _uniqueId from 'lodash/uniqueId';

const settingApi = {
  getRecordingVideo() {
    return request.request({
      method: 'GET',
      url: '/cctv-monitor-ctrl-svc/api/v1/config/recording-video',
    });
  },
  getDataCleanFile() {
    return request.get('/cctv-monitor-ctrl-svc/api/v1/config/clean-file');
  },
  getDataWarningDisk() {
    return request.get('/cctv-monitor-ctrl-svc/api/v1/config/warning-disk');
  },
  getEmailConfig() {
    return request.get('/cctv-monitor-ctrl-svc/api/v1/email/get-email');
  },
  postRecordingVideo(data) {
    return request.post('/cctv-monitor-ctrl-svc/api/v1/config/recording-video', data, {
      headers: {
        requestId: _uniqueId('cctv'),
      },
    });
  },
};

export default settingApi;
