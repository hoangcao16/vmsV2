import { STORAGE } from '@/constants/common';
import { history } from 'umi';
import MyService from '../RestApiClient';

const loginPath = '/user/login';
const AuthZApi = {
  login: async (payload) => {
    try {
      const { data } = await MyService.postRequest(`/authz/login`, payload);
      localStorage.setItem(STORAGE.TOKEN, data.accessToken);
      localStorage.setItem(STORAGE.REFRESH_TOKEN, data.refreshToken);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  getPermissionForCurrentUser: async () => {
    try {
      const { data } = await MyService.getRequest(`/authz/api/v0/authorization/get_permission`);

      console.log('data', data);
      console.log('data.payload', data.payload);
      localStorage.setItem(STORAGE.USER_PERMISSIONS, JSON.stringify(data.payload));
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  logout: async () => {
    try {
      await MyService.postRequest(`/authz/logout`);
      history.push(loginPath);
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  getAllUser: async (params) => {
    try {
      const { data } = await MyService.getRequest(`/authz/api/v0/users`, params);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  createUser: async (values) => {
    try {
      const { payload } = await MyService.postRequest('/authz/api/v0/users', values);
      return payload;
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  refreshToken: async (oldToken) => {
    try {
      const { data } = await MyService.postRequest('/authz/refresh', oldToken);
      localStorage.setItem(STORAGE.TOKEN, data.accessToken);
      localStorage.setItem(STORAGE.REFRESH_TOKEN, data.refreshToken);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },
};

export default AuthZApi;
