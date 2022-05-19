import AuthZApi from '@/services/authz/AuthZApi';
import axios from 'axios';
import { API_URL, STATUS_CODE, STORAGE } from '../constants/common';

const request = axios.create({
  baseURL: API_URL,
});

request.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(STORAGE.TOKEN);

    if (token) {
      config.headers.Authorization = token;
    }
    config.headers.charset = 'utf-8';
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  function (response) {
    if (!STATUS_CODE.LIST_SUCCESS_CODE.includes(response.data?.code)) {
      return Promise.reject(response?.data);
    }

    return response.data;
  },
  async function (error) {
    const originalRequest = error.config;

    if (originalRequest && error?.toJSON()?.status === 401 && !originalRequest._retry) {
      const oldToken = localStorage.getItem(STORAGE.TOKEN);

      await AuthZApi.refreshToken(oldToken);

      originalRequest._retry = true;

      return request(originalRequest);
    }
    return Promise.reject(error?.response?.data);
  },
);

export default request;
