import request from '@/utils/request';

const eventFilesApi = {
  getAllEventFiles: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/event-files`, { params: params });
  },
};

export default eventFilesApi;
