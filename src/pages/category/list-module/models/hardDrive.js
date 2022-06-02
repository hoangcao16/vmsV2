import ModuleApi from '@/services/module-api/ModuleApi';

export default {
  namespace: 'hardDrive',
  state: {
    list: [],
    metadata: {
      page: 1,
      size: 10,
    },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
  },
  effects: {
    *fetchAllHardDrive({ payload }, { call, put }) {
      try {
        const response = yield call(ModuleApi.getAllHardDrive, payload);
        yield put({
          type: 'save',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
