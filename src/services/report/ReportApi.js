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

  // getExportDataToMail: async (body) => {
  //   let result;
  //   try {
  //     result = await MyService.getRequestData('/owl/api/v1/send-export-excel-data', body);
  //   } catch (error) {
  //     console.log(JSON.stringify(error));
  //   }
  //   return result;
  // // },

  getExportDataToMail: async (params) => {
    return request.get(`/owl/api/v1/send-export-excel-data`, {
      params,
    });
  },

  // getTableData: async (body) => {
  //   let result;
  //   try {
  //     result = await MyService.getRequestData('/owl/api/v1/get-data-table', body);
  //   } catch (error) {
  //     console.log(JSON.stringify(error));
  //   }
  //   if (handleErrCodeReport(result) === null) {
  //     return [];
  //   }
  //   return result;
  // },

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
