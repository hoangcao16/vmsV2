// import { responseCheckerErrorsController } from "../../function/MyUltil/ResponseChecker";
// import MyService from "../service";
import request from '@/utils/request';
const AdDivisionApi = {
  getAllAdDivision(data) {
    return request.request({
      method: 'GET',
      url: `cctv-controller-svc/api/v1/administrative_units/v2`,
      params: data,
    });
  },

  getAll(params) {
    return request.get(`cctv-controller-svc/api/v1/administrative_units/v2`, { params: params });
  },

  getAdDivisionByUuid(uuid) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/administrative_units/${uuid}`,
    });
  },
  // editAdDivision(uuid, advisionPayload) {
  //   return request.request({
  //     method: 'PUT',
  //     url: `/cctv-controller-svc/api/v1/administrative_units/${uuid}`,
  //     data: advisionPayload,
  //   });
  // },

  // addAdDivision(adDivisionPayload) {
  //   return request.request({
  //     method: 'POST',
  //     url: `/cctv-controller-svc/api/v1/administrative_units`,
  //     data: adDivisionPayload,
  //   });
  // },
  addAdDivision: async (values) => {
    return request.post('/cctv-controller-svc/api/v1/administrative_units', values);
  },

  editAdDivision: async (uuid, values) => {
    return request.put(`/cctv-controller-svc/api/v1/administrative_units/${uuid}`, values);
  },
  deleteAdDivision: async (uuid) => {
    return request.delete(`/cctv-controller-svc/api/v1/administrative_units/${uuid}`);
  },

  delete(uuid) {
    return request.request({
      method: 'DELETE',
      url: `/cctv-controller-svc/api/v1/administrative_units/${uuid}`,
    });
  },
};

export default AdDivisionApi;
