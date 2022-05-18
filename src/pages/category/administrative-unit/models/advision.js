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
  },
};
