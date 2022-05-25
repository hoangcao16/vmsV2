import { isEmpty } from 'lodash';

export default {
  namespace: 'chartDisable',
  state: {
    barChartDisable: true,
    pieChartDisable: false,
    currentTabKey: '1',
  },
  reducers: {
    save(state, { payload: { barChartDisable, pieChartDisable, currentTabKey } }) {
      if (typeof barChartDisable == 'boolean') {
        state.barChartDisable = barChartDisable;
      }
      if (typeof pieChartDisable == 'boolean') {
        state.pieChartDisable = pieChartDisable;
      }

      if (!isEmpty(currentTabKey)) {
        state.currentTabKey = currentTabKey;
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
    *chooseCurrentTabWhenChangeChartControl({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          currentTabKey: payload,
        },
      });
    },
  },
};
