import camLiveApi from '@/services/controllerApi/cameraLiveService';
import { notify } from '@/components/Notify';
export default {
  namespace: 'viewLiveCameras',
  state: {
    liveCameraList: [],
    listStreaming: [],
    liveCameraUuid: null,
  },
  reducers: {
    saveLiveCameraList(state, { payload, uuid }) {
      return {
        ...state,
        liveCameraList: payload || [],
        liveCameraUuid: uuid || null,
      };
    },
    saveListStreaming(state, { payload }) {
      return {
        ...state,
        listStreaming: payload,
      };
    },
  },
  effects: {
    *fetchLiveCameraList({ payload }, { call, put }) {
      try {
        const response = yield call(camLiveApi.getAll, payload);
        yield put({
          type: 'saveLiveCameraList',
          payload: response?.payload[0]?.cameraUuids,
          uuid: response?.payload[0]?.uuid,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *createLiveCameraList({ payload }, { call, put }) {
      try {
        const response = yield call(camLiveApi.createNew, payload);
        yield put({
          type: 'fetchLiveCameraList',
          payload: {
            page: 1,
            size: 10,
            type: '4x1',
          },
        });
        notify('success', 'noti.success', 'noti.save_live_camera_successfully');
      } catch (error) {
        console.log(error);
      }
    },
    *updateLiveCameraList({ payload, uuid }, { call, put }) {
      try {
        const response = yield call(camLiveApi.update, payload, uuid);
        notify('success', 'noti.success', 'noti.update_live_camera_successfully');
      } catch (error) {
        console.log(error);
      }
    },
    *deleteLiveCameraList({ uuid }, { call, put }) {
      try {
        const response = yield call(camLiveApi.delete, uuid);
        yield put({
          type: 'saveLiveCameraList',
          payload: [],
          uuid: null,
        });
        notify('success', 'noti.success', 'noti.delete_live_camera_successfully');
      } catch (error) {
        console.log(error);
      }
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname }) => {
    //     if (pathname === '/map') {
    //       dispatch({
    //         type: 'fetchLiveCameraList',
    //         payload: {
    //           page: 1,
    //           size: 10,
    //           type: '4x1',
    //         },
    //       });
    //     }
    //   });
    // },
  },
};
