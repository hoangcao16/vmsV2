import cameraApi from '@/services/controller-api/cameraService';
import { notify } from '@/components/Notify';
export default {
  namespace: 'groupcamera',
  state: {
    groupCameraParentOptions: [],
    selectedGroupCamera: {},
    closeDrawerState: false,
    cameraGroupExistsed: [],
    metadataCameraGroupExistsed: {
      total: 0,
      page: 1,
      size: 10,
    },
  },
  reducers: {
    saveGroupCameraParent(state, { payload }) {
      return {
        ...state,
        groupCameraParentOptions: payload,
      };
    },
    saveSelectedGroupCamera(state, { payload }) {
      return {
        ...state,
        selectedGroupCamera: payload,
      };
    },
    saveCameraGroupExistsed(
      state,
      { payload: { cameraGroupExistsed, metadataCameraGroupExistsed } },
    ) {
      return {
        ...state,
        cameraGroupExistsed,
        metadataCameraGroupExistsed,
      };
    },
    closeDrawer(state) {
      console.log(state);
      return { ...state, closeDrawerState: !state.closeDrawerState };
    },
  },
  effects: {
    *fetchAllGroupCameraParent({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.getAllGroupCamera, payload);
        yield put({
          type: 'saveGroupCameraParent',
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchGroupCameraByUuid({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.getGroupCameraByUuid, payload);
        yield put({
          type: 'saveSelectedGroupCamera',
          payload: response?.payload,
        });
      } catch (error) {
        console.log(error);
      }
    },
    *fetchCameraGroupExistsed({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.getAll, payload);
        yield put({
          type: 'saveCameraGroupExistsed',
          payload: {
            cameraGroupExistsed: response?.payload,
            metadataCameraGroupExistsed: response?.metadata,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *createNewGroupCamera({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.createNewGroupCamera, payload);
        if (response?.code === 700) {
          yield put({
            type: 'fetchAllGroupCameraParent',
            payload: {
              parent: 'all',
              name: '',
              page: 0,
              size: 1000,
            },
          });
          yield put({
            type: 'closeDrawer',
          });
          notify('success', 'noti.success', 'noti.successfully_add_camera_group');
        }
      } catch (error) {
        console.log(error);
      }
    },
    *updateGroupCamera({ payload, uuid }, { call, put }) {
      try {
        const response = yield call(cameraApi.updateGroupCamera, payload, uuid);
        // if (response?.code === 700) {
        yield put({
          type: 'fetchAllGroupCameraParent',
          payload: {
            parent: 'all',
            name: '',
            page: 0,
            size: 1000,
          },
        });
        yield put({
          type: 'closeDrawer',
        });
        notify('success', 'noti.success', 'noti.successfully_edit_camera_group');
        // }
      } catch (error) {
        console.log(error);
      }
    },
    *deleteGroupCamera({ payload }, { call, put }) {
      try {
        const response = yield call(cameraApi.deleteGroupCamera, payload);
        // if (response?.code === 700) {
        yield put({
          type: 'fetchAllGroupCameraParent',
          payload: {
            parent: 'all',
            name: '',
            page: 0,
            size: 1000,
          },
        });
        notify('success', 'noti.success', 'noti.successfully_delete_camera_group');
        // }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
