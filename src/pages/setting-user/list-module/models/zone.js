import ModuleApi from '@/services/module-api/ModuleApi';

export default {
  namespace: 'zone',
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
    *fetchAllZone({ payload }, { call, put }) {
      try {
        const response = yield call(ModuleApi.getAllZone, payload);
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
    *addZone({ payload }, { call, put }) {
      try {
        const res = yield call(ModuleApi.addZone, payload);
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },
    *editZone({ payload: { id, values } }, { call, put }) {
      try {
        const res = yield call(ModuleApi.editZone, id, values);
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },
    *reload(action, { put, select }) {
      const page = yield select((state) => state.zone.page);
      yield put({ type: 'fetchAllZone', payload: { page } });
    },
  },
};
