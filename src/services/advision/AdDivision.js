// import { responseCheckerErrorsController } from "../../function/MyUltil/ResponseChecker";
// import MyService from "../service";
import request from '@/utils/request';
const AdDivisionApi = {
  getAllAdDivision(data) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/administrative_units?name=${data?.name}${
        data?.size ? `&size=${data?.size}` : ''
      }`,
    });
  },
  getAdDivisionByUuid(uuid) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/administrative_units/${uuid}`,
    });
  },
  editAdDivision(uuid, advisionPayload) {
    return request.request({
      method: 'PUT',
      url: `/cctv-controller-svc/api/v1/administrative_units/${uuid}`,
      data: advisionPayload,
    });
  },

  addAdDivision(adDivisionPayload) {
    return request.request({
      method: 'POST',
      url: `/cctv-controller-svc/api/v1/administrative_units`,
      data: adDivisionPayload,
    });
  },
  delete(uuid) {
    return request.request({
      method: 'DELETE',
      url: `/cctv-controller-svc/api/v1/administrative_units/${uuid}`,
    });
  },
};

export default AdDivisionApi;
