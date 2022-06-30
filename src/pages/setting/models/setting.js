import { notify } from '@/components/Notify';
import settingApi from '@/services/setting/SettingApi';

export default {
  namespace: 'setting',
  state: {
    listRecord: {},
    listClean: {},
    listDisk: {},
    listEmail: {},
  },
  reducers: {
    saveRecord(state, { payload: { data: listRecord } }) {
      return { ...state, listRecord };
    },
    saveClean(state, { payload: { data: listClean } }) {
      return { ...state, listClean };
    },
    saveDisk(state, { payload: { data: listDisk } }) {
      return { ...state, listDisk };
    },
    saveEmail(state, { payload: { data: listEmail } }) {
      return { ...state, listEmail };
    },
  },
  effects: {
    *fetchRecordSetting({ payload }, { call, put }) {
      try {
        const response = yield call(settingApi.getRecordingVideo, payload);

        yield put({
          type: 'saveRecord',
          payload: {
            data: response?.payload,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    *fetchCleanSetting({ payload }, { call, put }) {
      try {
        const response = yield call(settingApi.getDataCleanFile, payload);

        yield put({
          type: 'saveClean',
          payload: {
            data: response?.payload,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchWarningStoreSetting({ payload }, { call, put }) {
      try {
        const response = yield call(settingApi.getDataWarningDisk, payload);

        yield put({
          type: 'saveDisk',
          payload: {
            data: response?.payload,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchEmailConfig({ payload }, { call, put }) {
      try {
        const response = yield call(settingApi.getEmailConfig, payload);

        yield put({
          type: 'saveEmail',
          payload: {
            data: response?.payload,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *postRecordSetting({ payload }, { call, put }) {
      try {
        yield call(settingApi.postRecordingVideo, payload);
        notify('success', 'noti.success', 'noti.successful_setting');
      } catch (error) {
        console.log(error);
      }
    },
    *postCleanSetting({ payload }, { call, put }) {
      try {
        yield call(settingApi.postDataCleanFile, payload);
        notify('success', 'noti.success', 'noti.successful_setting');
      } catch (error) {
        console.log(error);
      }
    },
    *postDataWarningDisk({ payload }, { call, put }) {
      try {
        yield call(settingApi.postDataWarningDisk, payload);
        notify('success', 'noti.success', 'noti.successful_setting');
        yield put({ type: 'fetchWarningStoreSetting' });
      } catch (error) {
        console.log(error);
      }
    },
    *updateEmail({ payload }, { call, put }) {
      try {
        yield call(settingApi.updateEmail, payload);
        notify('success', 'noti.success', 'noti.successful_setting');
        yield put({ type: 'fetchEmailConfig' });
      } catch (error) {
        console.log(error);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/setting-user') {
          dispatch({ type: 'fetchRecordSetting' });
          dispatch({ type: 'fetchCleanSetting' });
          dispatch({ type: 'fetchWarningStoreSetting' });
          dispatch({ type: 'fetchEmailConfig' });
          dispatch({
            type: 'user/fetchAllUser',
            payload: {
              page: 1,
              size: 1000,
            },
          });
        }
      });
    },
  },
};
