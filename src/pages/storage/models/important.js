import importantFilesApi from '@/services/storage-api/importantFilesApi';
import { IMPORTANT_NAMESPACE } from '../constants';

export const initSearchImportants = {
  startRecordTime: -1,
  endRecordTime: -1,
  address: '',
  provinceId: '',
  districtId: '',
  wardId: '',
  administrativeUnitUuid: '',
  fileType: 0,
  cameraGroupUuid: '',
  cameraUuid: '',
  type: -1,
  eventUuid: '',
  searchType: 'all',
  searchValue: '',
};

export default {
  namespace: IMPORTANT_NAMESPACE,
  state: {
    list: [],
    metadata: {
      page: 1,
      size: 10,
      total: 0,
      ...initSearchImportants,
    },
  },

  reducers: {
    resetSearchParam(state) {
      return { ...state, metadata: { ...state.metadata, ...initSearchImportants } };
    },

    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata: { ...state.metadata, ...metadata } };
    },

    saveSearchParam(state, { payload }) {
      return { ...state, metadata: { ...state.metadata, ...payload } };
    },
  },

  effects: {
    *fetchAll({ payload }, { call, put }) {
      try {
        const response = yield call(importantFilesApi.getAllFiles, payload);
        yield put({
          type: 'save',
          payload: {
            data: response.payload,
            metadata: response.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
