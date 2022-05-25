import { isEmpty } from 'lodash';

export default {
  namespace: 'chartDisable',
  state: {
    isDisableBarChart: true,
    isDisablePieChart: false,
    currentTabKey: '1',
  },
  reducers: {
    save(state, { payload: { isDisableBarChart, isDisablePieChart, currentTabKey } }) {
      if (typeof isDisableBarChart == 'boolean') {
        state.isDisableBarChart = isDisableBarChart;
      }
      if (typeof isDisablePieChart == 'boolean') {
        state.isDisablePieChart = isDisablePieChart;
      }

      if (!isEmpty(currentTabKey)) {
        state.currentTabKey = currentTabKey;
      }
      return { ...state };
    },
  },
  effects: {
    *isDisableBarChart({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          isDisableBarChart: boolean,
        },
      });
    },
    *isDisablePieChart({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          isDisablePieChart: boolean,
        },
      });
    },
    *changeCurrentTab({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          currentTabKey: payload,
        },
      });
    },
  },
};
