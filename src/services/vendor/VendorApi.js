// import { responseCheckerErrorsController } from "../../function/MyUltil/ResponseChecker";
// import MyService from "../service";
import request from '@/utils/request';

const VendorApi = {
  getAllVendor(data) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/vendors`,
      params: data,
    });
  },
  getVendorByUuid(uuid) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/vendors/${uuid}`,
    });
  },

  editVendor(uuid, vendorPayload) {
    return request.request({
      method: 'PUT',
      url: `/cctv-controller-svc/api/v1/vendors/${uuid}`,
      data: vendorPayload,
    });
  },

  addVendor(vendorPayload) {
    return request.request({
      method: 'POST',
      url: `/cctv-controller-svc/api/v1/vendors`,
      data: vendorPayload,
    });
  },

  delete(uuid) {
    return request.request({
      method: 'DELETE',
      url: `/cctv-controller-svc/api/v1/vendors/${uuid}`,
    });
  },
};

export default VendorApi;
