import request from '@/utils/request';

const PTZApi = {
  // PTZ
  getAllPresetTour: async (params) => {
    return request.get(`/ptz-ctrl/api/v1/search-preset-tour`, {
      params,
    });
  },

  getAllPreset: async (params) => {
    return request.get(`/ptz-ctrl/api/v1/search-preset`, {
      params,
    });
  },

  callPresetTour: async (data) => {
    return request.post(`/ptz-ctrl/api/v1/call-preset-tour`, data);
  },

  callPreset: async (data) => {
    return request.post(`/ptz-ctrl/api/v1/call-preset`, data);
  },

  postPan: async (data) => {
    return request.post(`/ptz-ctrl/api/v1/pan`, data);
  },

  postTilt: async (data) => {
    return request.post(`/ptz-ctrl/api/v1/tilt`, data);
  },

  postZoom: async (data) => {
    return request.post(`/ptz-ctrl/api/v1/zoom`, data);
  },

  postSetPreset: async (data) => {
    return request.post(`/ptz-ctrl/api/v1/set-preset`, data);
  },
};

export default PTZApi;
