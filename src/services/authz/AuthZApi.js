import { STORAGE } from '@/constants/common';
import request from '@/utils/request';
import { history } from 'umi';

const loginPath = '/user/login';
const AuthZApi = {
  login: async (payload) => {
    try {
      const data = await request.post(`/authz/login`, payload);
      localStorage.setItem(STORAGE.TOKEN, data.accessToken);
      localStorage.setItem(STORAGE.REFRESH_TOKEN, data.refreshToken);
      return data;
    } catch (error) {
      console.log(error);
      history.push(loginPath);
      localStorage.removeItem(STORAGE.TOKEN);
      localStorage.removeItem(STORAGE.USER_PERMISSIONS);
      localStorage.removeItem(STORAGE.REFRESH_TOKEN);
      return {};
    }
  },

  getPermissionForCurrentUser: async () => {
    try {
      const data = await request.get(`/authz/api/v0/authorization/get_permission`);
      localStorage.setItem(STORAGE.USER_PERMISSIONS, JSON.stringify(data.payload));
      return data;
    } catch (error) {
      console.log(error);
      history.push(loginPath);
      localStorage.removeItem(STORAGE.TOKEN);
      localStorage.removeItem(STORAGE.USER_PERMISSIONS);
      localStorage.removeItem(STORAGE.REFRESH_TOKEN);
      return {};
    }
  },

  logout: async () => {
    try {
      await request.post(`/authz/logout`);
      history.push(loginPath);
      localStorage.removeItem(STORAGE.TOKEN);
      localStorage.removeItem(STORAGE.USER_PERMISSIONS);
      localStorage.removeItem(STORAGE.REFRESH_TOKEN);
    } catch (error) {
      history.push(loginPath);
      localStorage.removeItem(STORAGE.TOKEN);
      localStorage.removeItem(STORAGE.USER_PERMISSIONS);
      localStorage.removeItem(STORAGE.REFRESH_TOKEN);
      return {};
    }
  },

  refreshToken: async (oldToken) => {
    try {
      const data = await request.post('/authz/refresh', { token: oldToken });
      localStorage.setItem(STORAGE.TOKEN, data.accessToken);
      localStorage.setItem(STORAGE.REFRESH_TOKEN, data.refreshToken);
      return data;
    } catch (error) {
      history.push(loginPath);
      localStorage.removeItem(STORAGE.TOKEN);
      localStorage.removeItem(STORAGE.USER_PERMISSIONS);
      localStorage.removeItem(STORAGE.REFRESH_TOKEN);
      return {};
    }
  },
};

export default AuthZApi;
