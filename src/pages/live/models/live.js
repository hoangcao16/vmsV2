import { GRID1X1 } from '@/constants/grid';

export default {
  namespace: 'live',
  state: {
    availableList: [],
    screen: {
      grids: [],
      gridType: GRID1X1,
    },
  },
  reducers: {
    saveAvailableList(state, { payload }) {
      return { ...state, availableList: payload };
    },
    saveScreen(state, { payload }) {
      return { ...state, screen: payload };
    },
    closeCamera(state, { payload }) {
      const { uuid } = payload;

      const cameraIndex = state.screen.grids.findIndex((grid) => grid.uuid === uuid);

      if (cameraIndex !== -1) {
        state.screen.grids[cameraIndex] = {
          id: '',
          uuid: '',
          type: '',
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
