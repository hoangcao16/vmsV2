import request from '@/utils/request';

const ReportApi = {
  // getExportData: async (body) => {
  //   let result;
  //   try {
  //     result = await MyService.getRequestDataBlob('/owl/api/v1/export-excel-data', body);
  //   } catch (error) {
  //     console.log(JSON.stringify(error));
  //   }
  //   return result;
  // },

  // getExportDataToMail: async (body) => {
  //   let result;
  //   try {
  //     result = await MyService.getRequestData('/owl/api/v1/send-export-excel-data', body);
  //   } catch (error) {
  //     console.log(JSON.stringify(error));
  //   }
  //   return result;
  // // },

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
};

export default ReportApi;
