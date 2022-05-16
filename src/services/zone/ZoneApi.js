import request from '@/utils/request';
export const removeEmpty = (obj) => {
  Object.keys(obj).forEach((k) => !obj[k] && obj[k] !== undefined && delete obj[k]);
  return obj;
};
const ZoneApi = {
  getAllZones(dataSearch) {
    const data = {
      ...dataSearch,
      provinceId: dataSearch?.provinceId === undefined ? '' : dataSearch?.provinceId,
      districtId: dataSearch?.districtId === undefined ? '' : dataSearch?.districtId,
      id: dataSearch?.id === undefined ? '' : dataSearch?.id,
    };
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/zones?provinceId=${data?.provinceId}&districtId=${data?.districtId}&wardId=${data?.id}&name=${data?.name}`,
    });
  },
  getAllZonesWithTotal(dataSearch) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/zones`,
      data: removeEmpty(dataSearch),
    });
  },
  getZoneByUuid(uuid) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/zones/${uuid}`,
    });
  },
  addZone(zonePayload) {
    return request.request({
      method: 'POST',
      url: '/cctv-controller-svc/api/v1/zones',
      data: zonePayload,
    });
  },

  editZone(zoneId, zonePayload) {
    return request.request({
      method: 'PUT',
      url: `/cctv-controller-svc/api/v1/zones/${zoneId}`,
      data: zonePayload,
    });
  },
  delete(uuid) {
    return request.request({
      method: 'DELETE',
      url: `/cctv-controller-svc/api/v1/zones/${uuid}`,
    });
  },
};

export default ZoneApi;
