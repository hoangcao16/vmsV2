import { notify } from '@/components/Notify';
import cameraApi from '@/services/controller-api/cameraService';
export default {
  namespace: 'scanCamera',
  state: {
    list: [],
    selectedIp: null,
  },
  reducers: {
    save(state, { payload: { data: list } }) {
      return { ...state, list };
    },
    saveSelectedIp(state, { payload }) {
      return { ...state, selectedIp: payload };
    },
  },
  effects: {
    *scanAllCamera({ payload }, { call, put }) {
      try {
        yield put({
          type: 'save',
          payload: {
            data: [],
          },
        });
        const request = yield call(cameraApi.scanCameraByIp, payload);
        yield put({
          type: 'save',
          payload: {
            data: request?.payload?.data,
          },
        });
        notify('success', 'noti.success', 'view.camera.scannable_successfully');
      } catch (error) {
        console.log(error);
      }
    },
  },
};
