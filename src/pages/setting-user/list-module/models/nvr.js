import ModuleApi from '@/services/module-api/ModuleApi';

export default {
  namespace: 'nvr',
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
    *fetchAllNVR({ payload }, { call, put }) {
      const response = yield call(ModuleApi.getAllNVR, payload);
      yield put({
        type: 'save',
        payload: {
          data: response?.payload,
          metadata: response?.metadata,
        },
      });
    },
    *editNVR({ nvrId, payload }, { call, put }) {
      yield call(ModuleApi.editNVR, nvrId, payload);
      yield put({ type: 'reload' });
    },

    *reload(action, { put, select }) {
      const page = yield select((state) => state.user.page);
      yield put({ type: 'fetchAllNVR', payload: { page } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const metadata = {
          name: query.name || '',
          page: query.page || 1,
          size: query.size || 10,
        };
        if (pathname === '/setting-user/list-module') {
          dispatch({ type: 'fetchAllNVR', payload: metadata });
        }
      });
    },
  },
};
