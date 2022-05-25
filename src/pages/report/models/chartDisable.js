export default {
  namespace: 'chartDisable',
  state: {
    barChartDisable: true,
    pieChartDisable: false,
  },
  reducers: {
    save(state, { payload: { barChartDisable, pieChartDisable } }) {
      if (typeof barChartDisable == 'boolean') {
        state.barChartDisable = barChartDisable;
      }
      if (typeof pieChartDisable == 'boolean') {
        state.pieChartDisable = pieChartDisable;
      }
      return { ...state };
    },
  },
  effects: {
    *barChartDisable({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          barChartDisable: boolean,
        },
      });
    },
    *pieChartDisable({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          pieChartDisable: boolean,
        },
      });
    },
  },
};
