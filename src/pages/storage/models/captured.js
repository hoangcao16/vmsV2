import capturedApi from '../../../services/storage-api/capturedApi';
import { CAPTURED_NAMESPACE } from '../constants';

export const initSearchCaptured = {
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
  namespace: CAPTURED_NAMESPACE,
  state: {
    list: [],
    metadata: {
      page: 1,
      size: 10,
      total: 0,
      ...initSearchCaptured,
    },
  },

  reducers: {
    resetSearchParam(state) {
      return { ...state, metadata: { ...state.metadata, ...initSearchCaptured } };
    },

    save(state, { payload: { data: danhsach, metadata } }) {
      console.log('❗TuanHQ🐞 💻 save 💻 danhsach', danhsach);
      return { ...state, list: danhsach, metadata: { ...state.metadata, ...metadata } };
    },

    saveSearchParam(state, { payload }) {
      return { ...state, metadata: { ...state.metadata, ...payload } };
    },
  },

  effects: {
    *fetchAll({ payload }, { call, put }) {
      try {
        const response = yield call(capturedApi.getAllCaptured, payload);
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
