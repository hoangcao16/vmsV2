import request from '@/utils/request';

const capturedApi = {
  getAllCaptured: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/event-files`, { params: params });
  },
};

export default capturedApi;
