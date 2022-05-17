import DailyArchiveApi from '@/services/dailyArchive/DailyArchiveApi';

export default {
  namespace: 'dailyArchive',
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

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const metadata = {
          page: query.page || 1,
          size: query.size || 10,
        };
        if (pathname === '/storage') {
          dispatch({ type: 'fetchAllDailyArchive', payload: metadata });
        }
      });
    },
  },
};
