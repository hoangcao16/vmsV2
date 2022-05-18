import AdDivisionApi from '@/services/advision/AdDivision';

export default {
  namespace: 'advision',
  state: {
    list: [],
    metadata: {
      name: '',
      size: 100,
    },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
  },
  effects: {
    *fetchAll({ payload }, { call, put }) {
      try {
        console.log('payload', payload);

        const response = yield call(AdDivisionApi.getAll, payload);
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

    *add({ payload }, { call, put }) {
      try {
        const res = yield call(AdDivisionApi.addAdDivision, payload);
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },

    *reload(action, { put, select }) {
      const size = yield select((state) => state.advision.size);
      yield put({ type: 'fetchAll', payload: { size } });
    },
  },
};
