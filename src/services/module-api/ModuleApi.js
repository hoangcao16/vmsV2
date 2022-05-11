import MyService from '../RestApiClient';

const ModuleApi = {
  getAllNVR: async (params) => {
    try {
      const { data } = await MyService.getRequest('/cctv-controller-svc/api/v1/nvr', params);
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getAllPlayback: async (params) => {
    try {
      const { data } = await MyService.getRequest('/cctv-controller-svc/api/v1/playback', params);
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getAllCamproxy: async (params) => {
    try {
      const { data } = await MyService.getRequest('/cctv-controller-svc/api/v1/camproxy', params);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getAllZone: async (params) => {
    try {
      const { data } = await MyService.getRequest('/cctv-controller-svc/api/v1/zones', params);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
};

export default ModuleApi;
