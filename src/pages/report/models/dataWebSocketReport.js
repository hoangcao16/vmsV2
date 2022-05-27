export default {
  namespace: 'dataWebSocketReport',
  state: {
    dataWebSocketAiEventList: [],
  },
  reducers: {
    save(state, { payload: { data } }) {
      if (state.dataWebSocketAiEventList.find((item) => item.uuid === data.uuid)) {
        return state;
      } else {
        state.dataWebSocketAiEventList.unshift(data);
      }
      if (state.dataWebSocketAiEventList.length > 100) {
        state.dataWebSocketAiEventList.pop();
      }
      return state;
    },
  },
  effects: {
    *pushData({ payload }, { put }) {
      try {
        yield put({
          type: 'save',
          payload: {
            data: payload,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
