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
  },
  effects: {},
};
