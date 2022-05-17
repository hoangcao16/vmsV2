import moment from 'moment';
import reportApi from '@/services/report/ReportApi';

export default {
  namespace: 'chart',
  state: {
    list: {},
    listPieChart: {},
  },
  reducers: {
    save(state, { payload: { data: list, dataPieChart: listPieChart } }) {
      if (list) {
        state.list = list;
      }
      if (listPieChart) {
        state.listPieChart = listPieChart;
      }
      return { ...state };
    },
  },
  effects: {
    *changeReportHeaderData({ payload }, { call, put }) {
      const response = yield call(reportApi.getData, payload);
      yield put({
        type: 'save',
        payload: {
          data: response,
        },
      });
    },
    *changeReportHeaderDataPieChart({ payload }, { call, put }) {
      const response = yield call(reportApi.getDataPieChart, payload);
      yield put({
        type: 'save',
        payload: {
          dataPieChart: response,
        },
      });
    },
  },
};
