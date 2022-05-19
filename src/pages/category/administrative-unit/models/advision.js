import { notify } from '@/components/Notify';
import AdDivisionApi from '@/services/advision/AdDivision';

export default {
  namespace: 'advision',
  state: {
    list: [],
    metadata: {
      name: '',
      size: 100,
    },
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
  },
  effects: {
    *fetchAll({ payload }, { call, put }) {
      try {
        console.log('payload', payload);

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

    *add({ payload }, { call, put }) {
      try {
        const res = yield call(AdDivisionApi.addAdDivision, payload);
        if (res?.code === 700 || res?.code === 800) {
          notify('success', 'noti.success', 'noti.successfully_add_administrative');
        }
        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${res?.code}`,
        );
      }
    },

    *edit({ payload: { id, values } }, { call, put }) {
      try {
        const res = yield call(AdDivisionApi.editAdDivision, id, values);
        if (res?.code === 700 || res?.code === 800) {
          notify('success', 'noti.success', 'noti.successfully_edit_administrative_unit');
        }

        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${res?.code}`,
        );
      }
    },

    *delete({ id }, { call, put }) {
      try {
        const res = yield call(AdDivisionApi.deleteAdDivision, id);
        if (res?.code === 700 || res?.code === 800) {
          notify('success', 'noti.success', 'noti.successfully_delete_administrative');
        }

        yield put({ type: 'reload' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${res?.code}`,
        );
      }
    },

    *reload(action, { put, select }) {
      const size = yield select((state) => state.advision.size);
      yield put({ type: 'fetchAll', payload: { size } });
    },
  },
};
