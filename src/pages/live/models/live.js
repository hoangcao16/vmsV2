import { GRID1X1 } from '@/constants/grid';
import moment from 'moment';

export default {
  namespace: 'live',
  state: {
    availableList: [],
    currentSeekTime: moment(),
    screen: {
      mode: 'live',
      grids: [],
      gridType: GRID1X1,
      name: '',
    },
    speedVideo: 1,
  },
  reducers: {
    saveAvailableList(state, { payload }) {
      return { ...state, availableList: payload };
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

      const cameraIndex = state.screen.grids.findIndex((grid) => grid.uuid === uuid);

      if (cameraIndex !== -1) {
        state.screen.grids[cameraIndex] = {
          id: '',
          uuid: '',
          name: '',
        };
      }

      const newScreen = {
        ...state.screen,
      };

      return { ...state, screen: newScreen };
    },
  },
  effects: {},
};
