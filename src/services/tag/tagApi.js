// import { responseCheckerErrorsController } from "../../function/MyUltil/ResponseChecker";
// import MyService from "../service";
import request from '@/utils/request';
const TagApi = {
  getAllTags(data) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/tags_key?key=${data?.name}${
        data?.size ? `&size=${data?.size}` : ''
      }`,
    });
  },
  getTagById(tagId) {
    return request.request({
      method: 'GET',
      url: `/cctv-controller-svc/api/v1/tags_key/${tagId}`,
    });
  },

  updateTagById(tagId, payload) {
    return request.request({
      method: 'PUT',
      url: `/cctv-controller-svc/api/v1/tags_key/${tagId}`,
      data: payload,
    });
  },

  deleteTagById(uuid) {
    return request.request({
      method: 'DELETE',
      url: `/cctv-controller-svc/api/v1/tags_key/${uuid}`,
    });
  },
  addTag(payload) {
    return request.request({
      method: 'POST',
      url: `/cctv-controller-svc/api/v1/tags_key`,
      data: payload,
    });
  },
};

export default TagApi;
