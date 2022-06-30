import { notify } from '@/components/Notify';
import FieldEventApi from '@/services/fieldEvent/FieldEventApi';

export default {
  namespace: 'eventType',
  state: {
    list: [],
    metadata: { page: 1, size: 10 },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
  },
  effects: {
    *fetchAllEventType({ payload }, { call, put }) {
      try {
        const response = yield call(FieldEventApi.getAllEventType, payload);
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

    *add({ payload }, { call, put }) {
      try {
        yield call(FieldEventApi.addEventType, payload);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.successfully_add');
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },

    *edit({ payload: { id, values } }, { call, put }) {
      try {
        yield call(FieldEventApi.editEventType, id, values);
        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'noti.successfully_edit_name',
        );
        yield put({ type: 'reload' });
      } catch (error) {
        console.log(error);
      }
    },

    *delete({ id }, { call, put }) {
      try {
        yield call(FieldEventApi.deleteEventType, id);
        notify('success', 'pages.setting-user.list-user.titleSuccess', 'noti.delete_successful');
        yield put({ type: 'reload' });
      } catch (error) {
        console.log('error', error);
      }
    },

    *reload(action, { put, select }) {
      const metadata = yield select((state) => state.eventType.metadata);
      yield put({
        type: 'fetchAllEventType',
        payload: { page: metadata?.page, size: metadata?.size },
      });
    },
  },
};
