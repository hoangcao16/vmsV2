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
      try {
        const response = yield call(reportApi.getData, payload);
        console.log('line', response);
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
        console.log('pie', response);
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
  },
};
