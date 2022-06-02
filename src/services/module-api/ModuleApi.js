import request from '@/utils/request';

const ModuleApi = {
  getAllNVR: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/nvr`, { params: params });
  },
  editNVR: async (nvrId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/nvr/${nvrId}`, values);
  },

  getAllPlayback: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/playback`, { params: params });
  },
  editPlayback: async (playbackId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/playback/${playbackId}`, values);
  },

  getAllZone: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/zones`, { params: params });
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

  getAllCamproxy: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/camproxy`, { params: params });
  },
  editCamproxy: async (camproxyId, values) => {
    return request.put(`/cctv-controller-svc/api/v1/camproxy/${camproxyId}`, values);
  },

  getAllHardDrive: async (params) => {
    return request.get(`/cctv-monitor-ctrl-svc/api/v1/config/disk-info`, { params: params });
  },
};

export default ModuleApi;
