import cameraApi from '@/services/controller-api/cameraService';
import { notify } from '@/components/Notify';
export default {
  namespace: 'camera',
  state: {
    list: [],
    metadata: {
      total: 0,
      page: 1,
      size: 10,
    },
    selectedUuidEdit: '',
    selectedCamera: {},
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
    selectUuidEdit(state, { payload: selectedUuidEdit }) {
      return { ...state, selectedUuidEdit };
    },
  },
  effects: {
    *fetchAllCamera({ payload }, { call, put }) {
      try {
        const request = yield call(cameraApi.getAll, payload);
        yield put({
          type: 'save',
          payload: {
            data: request?.payload,
            metadata: request?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *addCamera({ payload }, { call, put }) {
      try {
        const request = yield call(cameraApi.createNew, payload);
        console.log(request);
        notify('success', 'noti.success', 'noti.successfully_add_camera');
      } catch (error) {
        console.log(error);
      }
    },
  },
};
