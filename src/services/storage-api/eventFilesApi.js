import request from '@/utils/request';

const eventFilesApi = {
  getAllEventFiles: (params) => {
    return request.get(`/cctv-controller-svc/api/v1/event-files`, { params: params });
  },

  updateFile: (data, uuid) => {
    return request.put(`/cctv-controller-svc/api/v1/files/${uuid}`, data);
  },

  updateEventFile: (data, uuid) => {
    return request.put(`/cctv-controller-svc/api/v1/event-files/${uuid}`, data);
  },
};

export default eventFilesApi;
