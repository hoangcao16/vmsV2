export default {
  namespace: 'chartControl',
  state: {
    timeoutFieldData: false,
    timeoutEventData: false,
  },
  reducers: {
    save(state, { payload: { timeoutFieldData, timeoutEventData } }) {
      if (typeof timeoutFieldData == 'boolean') {
        state.timeoutFieldData = timeoutFieldData;
      }
      if (typeof timeoutEventData == 'boolean') {
        state.timeoutEventData = timeoutEventData;
      }
      return { ...state };
    },
  },
  effects: {
    *emptyFieldId({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          timeoutFieldData: boolean,
        },
      });
    },
    *emptyEventIds({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          timeoutEventData: boolean,
        },
      });
    },
  },
};
