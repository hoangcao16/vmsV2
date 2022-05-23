import request from '@/utils/request';

const EVENT_ENDPOINT = '/cctv-controller-svc/api/v1/events';
const eventApi = {
  getAll(queryParams) {
    return request.request({
      method: 'GET',
      url: EVENT_ENDPOINT,
      params: queryParams,
    });
  },

  get(uuid) {
    return request.request({
      method: 'GET',
      url: `${EVENT_ENDPOINT}/${uuid}`,
    });
  },

  createNew(cam) {
    return request.request({
      method: 'POST',
      url: EVENT_ENDPOINT,
      data: cam,
    });
  },

  update(record, uuid) {
    return request.request({
      method: 'PUT',
      url: `${EVENT_ENDPOINT}/${uuid}`,
      data: record,
    });
  },

  delete(uuid) {
    return request.request({
      method: 'DELETE',
      url: `${EVENT_ENDPOINT}/${uuid}`,
    });
  },
};

export default eventApi;
