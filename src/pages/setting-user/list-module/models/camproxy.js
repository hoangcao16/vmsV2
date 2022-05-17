import ModuleApi from '@/services/module-api/ModuleApi';

export default {
  namespace: 'camproxy',
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
    *fetchAllCamproxy({ payload }, { call, put }) {
      try {
        const response = yield call(ModuleApi.getAllCamproxy, payload);
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
    *editCamproxy({ payload: { id, values } }, { call, put }) {
      try {
        const res = yield call(ModuleApi.editCamproxy, id, values);

        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },
    *reload(action, { put, select }) {
      const page = yield select((state) => state.camproxy.page);
      yield put({ type: 'fetchAllCamproxy', payload: { page } });
    },
  },
};
