import { notify } from '@/components/Notify';
import bookmarkService from '@/services/bookmark';

export default {
  namespace: 'favorite',
  state: {
    list: [],
    metadata: {
      size: 15,
      page: 1,
      total: 0,
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
        const response = yield call(bookmarkService.list, payload);
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

    *update({ payload: { id, values } }, { call, put }) {
      try {
        yield call(bookmarkService.update, id, values);
        notify('success', 'noti.success', 'pages.live-mode.noti.name-favorite');

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
        yield call(bookmarkService.delete, id);
        notify('success', 'noti.success', 'noti.delete_successful');

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
      const metadata = yield select((state) => state.favorite.metadata);
      yield put({ type: 'fetchAll', payload: { ...metadata, sort_by: 'name', order_by: 'asc' } });
    },
  },
};
