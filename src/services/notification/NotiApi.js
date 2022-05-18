import request from '@/utils/request';

const NotiApi = {
  getData: async (params) => {
    return request.get(`/cctv-monitor-ctrl-svc/api/v1/message/notification`, {
      params,
    });
  },
  getBagde: async () => {
    return request.get('/cctv-monitor-ctrl-svc/api/v1/message/get-badge');
  },
};

export default NotiApi;
