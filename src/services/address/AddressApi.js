import request from '@/utils/request';
const AddressApi = {
  getAllProvinces() {
    return request.request({
      method: 'GET',
      url: '/cctv-controller-svc/api/v1/provinces',
    });
  },

  getDistrictByProvinceId(provinceId) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/districts/${provinceId}`,
    });
  },

  getWardByDistrictId(districtId) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/wards/${districtId}`,
    });
  },
};

export default AddressApi;
