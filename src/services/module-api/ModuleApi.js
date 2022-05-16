import { isEmpty } from 'lodash';
import MyService from '../RestApiClient';

const ModuleApi = {
  getAllNVR: async (params) => {
    try {
      const data = await MyService.getRequest('/cctv-controller-svc/api/v1/nvr', params);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  editNVR: async (nvrId, params) => {
    try {
      await MyService.putRequest(`/cctv-controller-svc/api/v1/nvr/${nvrId}`, params);
    } catch (error) {
      console.log(error);
    }

    return true;
  },

  getAllPlayback: async (params) => {
    try {
      const data = await MyService.getRequest('/cctv-controller-svc/api/v1/playback', params);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  editPlayback: async (playbackId, params) => {
    try {
      await MyService.putRequest(`/cctv-controller-svc/api/v1/playback/${playbackId}`, params);
    } catch (error) {
      console.log(error);
    }
  },

  getAllCamproxy: async (params) => {
    try {
      const data = await MyService.getRequest('/cctv-controller-svc/api/v1/camproxy', params);
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getAllZone: async (params) => {
    try {
      const data = await MyService.getRequest('/cctv-controller-svc/api/v1/zones', params);
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  addZone: async (params) => {
    try {
      result = await MyService.postRequest('/cctv-controller-svc/api/v1/zones', params);
    } catch (error) {
      console.log(error);
    }
  },
};

export default ModuleApi;
