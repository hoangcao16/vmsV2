import moment from 'moment';
import reportApi from '@/services/report/ReportApi';
import { isEmpty } from 'lodash';

export default {
  namespace: 'chart',
  state: {
    list: [],
    listPieChart: [],
    getData: true,
  },
  reducers: {
    save(state, { payload: { data: list, dataPieChart: listPieChart, getData } }) {
      console.log('getData', getData);
      if (!isEmpty(list)) {
        state.list = list;
      }
      if (!isEmpty(listPieChart)) {
        state.listPieChart = listPieChart;
      }
      return { ...state, getData };
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
    *getData({ boolean }, { put }) {
      console.log('boolean', boolean);
      yield put({
        type: 'save',
        payload: {
          getData: boolean,
        },
      });
    },
  },
};
