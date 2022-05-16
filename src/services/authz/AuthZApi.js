import { STORAGE } from '@/constants/common';
import request from '@/utils/request';
import { history } from 'umi';

const loginPath = '/user/login';
const AuthZApi = {
  login: async (payload) => {
    try {
      const data = request.post(`/authz/login`, payload);
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
      const data = request.get(`/authz/api/v0/authorization/get_permission`);
      localStorage.setItem(STORAGE.USER_PERMISSIONS, JSON.stringify(data.payload));
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  logout: async () => {
    try {
      await request.post(`/authz/logout`);
      history.push(loginPath);
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  refreshToken: async (oldToken) => {
    try {
      const data = await request.post('/authz/refresh', oldToken);
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
