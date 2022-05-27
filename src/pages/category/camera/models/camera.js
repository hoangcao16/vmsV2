import { ExportFileDownload } from '@/components/ExportFileDownload';
import { notify } from '@/components/Notify';
import cameraApi from '@/services/controller-api/cameraService';
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
    closeDrawerState: false,
  },
  reducers: {
    save(state, { payload: { data: list, metadata } }) {
      return { ...state, list, metadata };
    },
    getOneCamera(state, { payload: { selectedCamera } }) {
      console.log('getOneCamera', selectedCamera);
      return { ...state, selectedCamera };
    },
    selectUuidEdit(state, { payload: selectedUuidEdit }) {
      return { ...state, selectedUuidEdit };
    },
    closeDrawer(state) {
      return { ...state, closeDrawerState: !state.closeDrawerState };
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
    *getCameraByUuid({ payload }, { call, put }) {
      try {
        const request = yield call(cameraApi.get, payload);
        yield put({
          type: 'getOneCamera',
          payload: {
            selectedCamera: request?.payload,
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
        if (request?.code === 700) {
          yield put({
            type: 'fetchAllCamera',
            payload: {
              page: 1,
              size: 10,
            },
          });
          yield put({
            type: 'closeDrawer',
          });
          notify('success', 'noti.success', 'noti.successfully_add_camera');
        }
      } catch (error) {
        console.log(error);
      }
    },
    *editCamera({ payload, uuid }, { call, put }) {
      try {
        const request = yield call(cameraApi.update, payload, uuid);
        console.log(request);
        if (request?.code === 700) {
          yield put({
            type: 'fetchAllCamera',
            payload: {
              page: 1,
              size: 10,
            },
          });
          yield put({
            type: 'closeDrawer',
          });
          notify('success', 'noti.success', 'noti.successfully_edit_camera');
        }
      } catch (error) {
        console.log(error);
      }
    },
    *deleteCamera({ payload: uuid }, { call, put }) {
      try {
        const request = yield call(cameraApi.delete, uuid);
        console.log(request);
        if (request?.code === 700) {
          yield put({
            type: 'fetchAllCamera',
            payload: {
              page: 1,
              size: 10,
            },
          });
          yield put({
            type: 'closeDrawer',
          });
          notify('success', 'noti.success', 'noti.successfully_delete_camera');
        }
      } catch (error) {
        console.log(error);
      }
    },
    *exportDataCamera({ payload }, { call, put }) {
      try {
        const request = yield call(cameraApi.exportData, payload);
        if (request?.type === 'application/octet-stream') {
          const data = new Blob([request], { type: 'application/vnd.ms-excel' });
          ExportFileDownload(data, 'view.user.detail_list.report_camera_info');
          notify('success', 'noti.success', 'noti.successfully_export_camera');
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
