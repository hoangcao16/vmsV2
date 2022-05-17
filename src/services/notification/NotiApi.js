import request from '@/utils/request';

const NotiApi = {
  getData: async (params) => {
    return request.get(`/cctv-monitor-ctrl-svc/api/v1/message/notification`, {
      params,
    });
  },
};

export default NotiApi;
