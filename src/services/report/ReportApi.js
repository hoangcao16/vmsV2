import { STORAGE } from '@/constants/common';
import request from '@/utils/request';
import _uniqueId from 'lodash/uniqueId';

const exportHeader = () => {
  const token = localStorage.getItem(STORAGE.TOKEN);
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  };
  if (token) {
    headers.Authorization = token;
  }
  return headers;
};
const ReportApi = {
  getExportData(data) {
    return request.request({
      method: 'GET',
      url: '/owl/api/v1/export-excel-data',
      params: data,
      headers: {
        ...exportHeader(),
        requestId: _uniqueId('cctv'),
      },
      responseType: 'blob',
    });
  },

  getExportDataToMail: async (params) => {
    return request.get(`/owl/api/v1/send-export-excel-data`, {
      params,
    });
  },

  getTableData: async (params) => {
    return request.get(`/owl/api/v1/get-data-table`, {
      params,
    });
  },

  getData: async (params) => {
    return request.get(`/owl/api/v2/get-data-line`, {
      params,
    });
  },

  getDataPieChart: async (params) => {
    return request.get(`/owl/api/v2/get-data-pie`, {
      params,
    });
  },

  getDataDetailChart: async (params) => {
    return request.get(`/owl/api/v2/get-list-event`, {
      params,
    });
  },
};

export default ReportApi;
