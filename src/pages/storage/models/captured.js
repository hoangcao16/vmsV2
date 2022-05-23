import capturedApi from '../../../services/storage-api/capturedApi';

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
  namespace: 'captured',
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
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata: { ...state.metadata, ...metadata } };
    },

    saveSearchParam(state, { payload }) {
      return { ...state, metadata: { ...state.metadata, ...payload } };
    },
  },

  effects: {
    *fetchAllCaptured({ payload }, { call, put }) {
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
