import { notify } from '@/components/Notify';
import AdDivisionApi from '@/services/advisionApi';

export default {
  namespace: 'advision',
  state: {
    list: [],
    recordId: {},
    metadata: {
      total: 0,
      size: 10,
      page: 1,
    },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
    saveRecord(state, { payload: { recordId } }) {
      return { ...state, recordId };
    },
  },
  effects: {
    *fetchAll({ payload }, { call, put }) {
      try {
        const response = yield call(AdDivisionApi.getAll, payload);
        yield put({
          type: 'save',
          payload: {
            data: response?.payload,
            metadata: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    *getByUuid({ id }, { call, put }) {
      try {
        const response = yield call(AdDivisionApi.getAdDivisionByUuid, id);
        yield put({
          type: 'saveRecord',
          payload: {
            recordId: response?.payload,
          },
        });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *add({ payload }, { call, put }) {
      try {
        yield call(AdDivisionApi.addAdDivision, payload);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_add_administrative',
        );
        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *edit({ payload: { id, values } }, { call, put }) {
      try {
        yield call(AdDivisionApi.editAdDivision, id, values);
        notify('success', 'noti.success', 'noti.successfully_edit_administrative_unit');

        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *delete({ id }, { call, put }) {
      try {
        yield call(AdDivisionApi.deleteAdDivision, id);
        notify('success', 'noti.success', 'noti.successfully_delete_administrative');

        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *reload(action, { put, select }) {
      const metadata = yield select((state) => state.advision.metadata);
      yield put({ type: 'fetchAll', payload: { page: metadata?.page, size: metadata?.size } });
    },
  },
};
