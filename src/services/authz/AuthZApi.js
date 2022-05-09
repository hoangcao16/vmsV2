import { STORAGE } from '@/constants/common';
import { history } from 'umi';
import MyService from '../RestApiClient';

const loginPath = '/user/login';
const AuthZApi = {
  login: async (payload) => {
    try {
      const { data } = await MyService.postRequest(`/authz/login`, payload);
      localStorage.setItem(STORAGE.TOKEN, data.accessToken);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  },

  getPermissionForCurrentUser: async () => {
    try {
      const { data } = await MyService.getRequest(`/authz/api/v0/authorization/get_permission`);
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
    }
  },
};

export default AuthZApi;
