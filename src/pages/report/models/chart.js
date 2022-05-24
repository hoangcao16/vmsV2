import moment from 'moment';
import reportApi from '@/services/report/ReportApi';
import { isEmpty } from 'lodash';

export default {
  namespace: 'chart',
  state: {
    list: [],
    listPieChart: [],
    timeoutData: false,
  },
  reducers: {
    save(state, { payload: { data: list, dataPieChart: listPieChart, ...rest } }) {
      if (!isEmpty(list)) {
        state.list = list;
      }
      if (!isEmpty(listPieChart)) {
        state.listPieChart = listPieChart;
      }
      return { ...state, ...rest };
    },
  },
  effects: {
    *changeReportHeaderData({ payload }, { call, put }) {
      try {
        const response = yield call(reportApi.getData, payload);
        yield put({
          type: 'save',
          payload: {
            data: response?.payload?.events,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *changeReportHeaderDataPieChart({ payload }, { call, put }) {
      try {
        const response = yield call(reportApi.getDataPieChart, payload);
        yield put({
          type: 'save',
          payload: {
            dataPieChart: response?.payload?.events,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *timeoutData({ boolean }, { put }) {
      yield put({
        type: 'save',
        payload: {
          timeoutData: boolean,
        },
      });
    },
  },
};
