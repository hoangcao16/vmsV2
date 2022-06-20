import request from '@/utils/request';

const BOOKMARK_ENDPOINT = '/cctv-controller-svc/api/v1/bookmark';

const bookmarkService = {
  async list(queryParams) {
    return request.get(BOOKMARK_ENDPOINT, {
      params: queryParams,
    });
  },
  async detail(uuid) {
    return request.get(`${BOOKMARK_ENDPOINT}/${uuid}`);
  },
  async update(uuid, cam) {
    return request.put(`${BOOKMARK_ENDPOINT}/${uuid}`, cam);
  },
  async create(data) {
    return request.post(BOOKMARK_ENDPOINT, data);
  },
  async delete(uuid) {
    return request.delete(`${BOOKMARK_ENDPOINT}/${uuid}`);
  },
  async setDefault(uuid) {
    return request.put(`${BOOKMARK_ENDPOINT}/${uuid}`, {
      defaultBookmark: 1,
    });
  },
  async getDefault() {
    return request.get(BOOKMARK_ENDPOINT, {
      params: {
        defaultBookmark: 1,
      },
    });
  },
};

export default bookmarkService;
