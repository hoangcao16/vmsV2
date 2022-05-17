import request from '@/utils/request';

const ModuleApi = {
  getAllNVR: async () => {
    return request.get(`/cctv-controller-svc/api/v1/nvr`);
  },
  editNVR: async (nvrId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/nvr/${nvrId}`, values);
  },

  getAllPlayback: async () => {
    return request.get(`/cctv-controller-svc/api/v1/playback`);
  },
  editPlayback: async (playbackId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/playback/${playbackId}`, values);
  },

  getAllZone: async () => {
    return request.get(`/cctv-controller-svc/api/v1/zones`);
  },

  addZone: async (values) => {
    return request.post('/cctv-controller-svc/api/v1/zones', values);
  },

  editZone: async (zoneId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/zones/${zoneId}`, values);
  },

  deleteZone: async (zoneId) => {
    return request.delete(`/cctv-controller-svc/api/v1/zones/${zoneId}`);
  },

  getAllCamproxy: async () => {
    return request.get(`/cctv-controller-svc/api/v1/camproxy`);
  },
  editCamproxy: async (camproxyId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/camproxy/${camproxyId}`, values);
  },
};

export default ModuleApi;
