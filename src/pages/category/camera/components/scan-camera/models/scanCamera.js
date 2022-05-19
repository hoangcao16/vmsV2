import { notify } from '@/components/Notify';
import cameraApi from '@/services/controller-api/cameraService';
export default {
  namespace: 'scanCamera',
  state: {
    list: null,
  },
  reducers: {
    save(state, { payload: { data: list } }) {
      return { ...state, list };
    },
  },
  effects: {
    *scanAllCamera({ payload }, { call, put }) {
      try {
        yield put({
          type: 'save',
          payload: {
            data: null,
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
