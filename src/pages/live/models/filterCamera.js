import AdDivisionApi from '@/services/advisionApi';
import cameraApi from '@/services/controllerApi/cameraService';
import TagApi from '@/services/tagApi';

function compare(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

export default {
  namespace: 'filterCamera',
  state: {
    listCameraGroups: [],
    listAdministrativeUnits: [],
    listTags: [],
    filters: {},
  },
  reducers: {
    save(state, { payload: { listCameraGroups, listAdministrativeUnits, listTags } }) {
      return { ...state, listCameraGroups, listAdministrativeUnits, listTags };
    },
    saveFilter(state, { payload: { filters } }) {
      return { ...state, filters };
    },
  },
  effects: {
    *fetchInitData({ payload }, { call, put, all }) {
      try {
        const [dataListCameraGroups, dataListAdministrativeUnits, dataListTags] = yield all([
          call(cameraApi.getAllGroupCamera, { page: 0, size: 10000 }),
          call(AdDivisionApi.getAllAdDivision),
          call(TagApi.getAllTags, { page: 0, size: 10000 }),
        ]);

        yield put({
          type: 'save',
          payload: {
            listCameraGroups: dataListCameraGroups?.payload?.sort(compare),
            listAdministrativeUnits: dataListAdministrativeUnits?.payload?.sort(compare),
            listTags: dataListTags?.payload?.sort(compare),
          },
        });
      } catch (error) {
        console.log(error);
      }
    },

    *setFilter({ payload: { filters } }, { put }) {
      try {
        yield put({
          type: 'saveFilter',
          payload: { filters },
        });
      } catch (error) {}
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/map' || pathname === '/live') {
          dispatch({ type: 'fetchInitData' });
        }
      });
    },
  },
};
