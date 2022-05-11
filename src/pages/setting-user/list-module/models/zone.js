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
      const response = yield call(ModuleApi.getAllZone, payload);
      yield put({
        type: 'save',
        payload: {
          data: response?.payload,
          metadata: response?.metadata,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const metadata = {
          name: query.name || '',
          page: query.page || 1,
          size: query.size || 10,
          provinceId: query.provinceId || '',
          districtId: query.districtId || '',
          id: query.id || '',
        };
        if (pathname === '/setting-user/list-module') {
          dispatch({ type: 'fetchAllZone', payload: metadata });
        }
      });
    },
  },
};
