import axios, { AxiosInstance } from 'axios';
// import { store } from "store";
import HandleErrorCode from '@/components/HandleErrorCode';
import { API_FILE_URL, API_URL, STATUS_CODE, STORAGE } from '../constants/common';
import AuthZApi from '@/services/authz/AuthZApi';
export class BaseService {
  private baseUrl;
  private withToken;
  public instance: AxiosInstance;

  constructor(baseUrl?: string, withToken: boolean = true) {
    this.baseUrl = baseUrl;
    this.withToken = withToken;

    this.instance = axios.create({
      timeout: 30000,
      timeoutErrorMessage: 'Request Timeout',
      baseURL: this.baseUrl,
    });

    const isProd = process.env.NODE_ENV !== 'development';

    this.instance.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem(STORAGE.TOKEN);
        config.headers.charset = 'utf-8';
        if (token && this.withToken) {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error) => {
        if (!isProd) {
          console.log(error);
        }
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response) => {
        const responseCode = Number(response.data?.code);
        // if (!isProd) {
        //   console.log('SUC Resp: ', response.data);
        // }
        if (!responseCode) {
          return response.data;
        }
        if (!STATUS_CODE.LIST_SUCCESS_CODE.includes(responseCode)) {
          HandleErrorCode(response?.data);
          return Promise.reject(response?.data);
        }
        return response.data;
      },
      async (error) => {
        const originalRequest = error.config;
        if (originalRequest && error?.toJSON()?.status === 401 && !originalRequest._retry) {
          const oldToken = localStorage.getItem(STORAGE.TOKEN);

          await AuthZApi.refreshToken(oldToken);

          originalRequest._retry = true;

          return this.instance(originalRequest);
        }
        if (!isProd) {
          console.log('Err: ', error);
        }

        return Promise.reject(error?.response?.data);
      },
    );
  }
}
const request = new BaseService(API_URL);
const fileRequest = new BaseService(API_FILE_URL);
const fileRequestClient = fileRequest.instance;
export { fileRequestClient };
export default request.instance;
