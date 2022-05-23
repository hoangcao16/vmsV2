import DailyArchiveApi from '@/services/storage-api/dailyArchiveApi';

export const initSearchCaptureFileParam = {
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
  searchType: '',
  searchValue: '',
};

export default {
  namespace: 'dailyArchive',
  state: {
    list: [],
    metadata: {
      page: 1,
      size: 10,
      total: 0,
      ...initSearchCaptureFileParam,
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
    *fetchAllDailyArchive({ payload }, { call, put }) {
      try {
        const response = yield call(DailyArchiveApi.getAllDailyArchive, payload);
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
