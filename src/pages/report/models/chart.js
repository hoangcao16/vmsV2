import moment from 'moment';
import reportApi from '@/services/report/ReportApi';

export default {
  namespace: 'chart',
  state: {
    list: {},
  },
  reducers: {
    save(state, { payload: { data: list } }) {
      return { ...state, list };
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
  },
};
