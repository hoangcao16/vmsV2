import request from '@/utils/request';

const settingApi = {
  getRecordingVideo: async () => {
    return request.get('/cctv-monitor-ctrl-svc/api/v1/config/recording-video');
  },
  getDataCleanFile: async () => {
    return request.get('/cctv-monitor-ctrl-svc/api/v1/config/clean-file');
  },
  getDataWarningDisk: async () => {
    return request.get('/cctv-monitor-ctrl-svc/api/v1/config/warning-disk');
  },
  getEmailConfig: async () => {
    return request.get('/cctv-monitor-ctrl-svc/api/v1/email/get-email');
  },
};

export default settingApi;
