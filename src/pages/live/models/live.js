import { GRID1X1 } from '@/constants/grid';
import PTZApi from '@/services/ptz/PTZApi';
import moment from 'moment';

export default {
  namespace: 'live',
  state: {
    availableList: [],
    currentSeekTime: moment(),
    mode: 'live',
    grids: [],
    gridType: GRID1X1,
    screen: {
      name: '',
    },
    showPresetSetting: false,
    cameraSelected: {},
    listPreset: [],
    listPresetTour: [],
    speedVideo: 1,
  },
  reducers: {
    saveAvailableList(state, { payload }) {
      return { ...state, availableList: payload };
    },
    saveMode(state, { payload }) {
      return { ...state, mode: payload };
    },
    saveGrids(state, { payload }) {
      return { ...state, grids: payload };
    },
    saveGridType(state, { payload }) {
      return { ...state, gridType: payload };
    },
    saveScreen(state, { payload }) {
      return { ...state, screen: payload };
    },
    saveCurrentSeekTime(state, { payload }) {
      return { ...state, currentSeekTime: payload };
    },
    saveSpeedVideo(state, { payload }) {
      return { ...state, speedVideo: payload };
    },
    closeCamera(state, { payload }) {
      const { uuid } = payload;

      const cameraIndex = state.grids.findIndex((grid) => grid.uuid === uuid);

      if (cameraIndex !== -1) {
        state.grids[cameraIndex] = {
          id: '',
          uuid: '',
          name: '',
        };
      }

      const newScreen = {
        ...state.grids,
      };

      return { ...state, grids: newScreen };
    },

    openDrawerSettingCamera(state, { payload: { cameraSelected, listPreset, listPresetTour } }) {
      return {
        ...state,
        showPresetSetting: true,
        cameraSelected,
        listPreset,
        listPresetTour,
      };
    },

    closeDrawerSettingCamera(state) {
      return {
        ...state,
        showPresetSetting: false,
        cameraSelected: {},
        listPreset: [],
        listPresetTour: [],
      };
    },
  },
  effects: {
    *openDrawerSettingCamera({ payload: { camera } }, { call, put, all }) {
      try {
        const [dataListPreset, dataListPresetTour] = yield all([
          call(PTZApi.getAllPreset, {
            cameraUuid: camera?.uuid,
            sortType: 'asc',
            sortField: 'name',
          }),
          call(PTZApi.getAllPresetTour, {
            cameraUuid: camera?.uuid,
            sortType: 'asc',
            sortField: 'name',
          }),
        ]);

        yield put({
          type: 'openDrawerSettingCamera',
          payload: {
            cameraSelected: camera,
            listPreset: dataListPreset?.payload?.data,
            listPresetTour: dataListPresetTour?.payload?.data,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    *addPreset({ payload: { body } }, { call, put, all }) {
      yield call(PTZApi.postSetPreset, body);

      try {
        yield put({
          type: 'reloadOpenDrawerSettingCamera',
        });
      } catch (error) {
        console.log(error);
      }
    },

    *reloadOpenDrawerSettingCamera(action, { put, select }) {
      const camera = yield select((state) => state.live.cameraSelected || {});
      yield put({ type: 'openDrawerSettingCamera', payload: { camera } });
    },
  },
};
