import NotiApi from '@/services/notification/NotiApi';
import { isEmpty } from 'lodash';

export default {
  namespace: 'home',
  state: {
    timeoutDataPieChart: false,
    timeoutDataLineChart: false,
  },
  reducers: {
    save(state, { payload: { timeoutDataLineChart, timeoutDataPieChart } }) {
      if (typeof timeoutDataLineChart == 'boolean') {
        state.timeoutDataLineChart = timeoutDataLineChart;
      }
      if (typeof timeoutDataPieChart == 'boolean') {
        state.timeoutDataPieChart = timeoutDataPieChart;
      }
      return { ...state };
    },
  },
  effects: {
    *timeoutDataPieChart({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          timeoutDataPieChart: boolean,
        },
      });
    },
    *timeoutDataLineChart({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          timeoutDataLineChart: boolean,
        },
      });
    },
  },
};
