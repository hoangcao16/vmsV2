import AuthZApi from '@/services/authz/AuthZApi';
import axios from 'axios';
import { API_URL, STORAGE } from '../constants/common';

const request = axios.create({
  baseURL: API_URL,
});

request.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(STORAGE.TOKEN);

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error?.toJSON()?.status === 401 && !originalRequest._retry) {
      const oldToken = localStorage.getItem(STORAGE.TOKEN);

      await AuthZApi.refreshToken(oldToken);

      originalRequest._retry = true;
      return this.request(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default request;
