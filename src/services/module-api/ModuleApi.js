import request from '@/utils/request';

const ModuleApi = {
  getAllNVR: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/nvr`, params);
  },
  editNVR: async (nvrId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/nvr/${nvrId}`, values);
  },

  getAllPlayback: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/playback`, params);
  },
  editPlayback: async (playbackId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/playback/${playbackId}`, values);
  },

  getAllCamproxy: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/camproxy`, params);
  },
  getAllZone: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/zones`, params);
  },

  addZone: async (values) => {
    return request.post('/cctv-controller-svc/api/v1/zones', values);
  },
};

export default ModuleApi;
