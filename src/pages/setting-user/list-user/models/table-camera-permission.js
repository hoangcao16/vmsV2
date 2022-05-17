import UserApi from '@/services/user/UserApi';
import { isEmpty } from 'lodash';

export default {
  namespace: 'cameraPermissionInGroupUser',
  state: {
    listCameraPermission: [],
    metadata: {},
    groupCode: null,
  },
  reducers: {
    save(state, { payload: { data: listCameraPermission, metadata, groupCode } }) {
      return { ...state, listCameraPermission, metadata, groupCode };
    },
  },
  effects: {
    *fetchAllPermissionCamera({ payload: { code } }, { call, put, select }) {
      try {
        const resDataPermision = yield call(UserApi.getAllUserInGroupById, code);

        const allCamera = yield call(UserApi.getAllCamera, {
          name: '',
          provinceId: '',
          districtId: '',
          id: '',
          administrativeUnitUuid: '',
          vendorUuid: '',
          status: '',
          page: 0,
          size: 1000000,
        });

        const listPermissionCamera = resDataPermision?.payload?.p_cameras;

        const convertDataRows = (data) => {
          return data.map((pc) => {
            const cam = allCamera?.payload?.find((c) => c.uuid === pc.cam_uuid);

            const permision = pc.permissions.map((p) => {
              return {
                [p]: 1,
              };
            });

            const permisionConvert = Object.assign({}, ...permision);

            return {
              ...permisionConvert,
              cam_name: cam?.name,
              cam_uuid: pc?.cam_uuid,
              isDisableRow: false, // đk để hiển thị là
            };
          });
        };

        let cameraPerRows = [];

        if (!isEmpty(listPermissionCamera)) {
          cameraPerRows = convertDataRows(listPermissionCamera);
        }

        yield put({
          type: 'save',
          payload: {
            data: cameraPerRows,
            metadata: { ...resDataPermision?.metadata },
            groupCode: resDataPermision?.payload?.group_code,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    *removePermisionCamera({ payload: dataRM }, { call, put }) {
      try {
        const res = yield call(UserApi.removePermisionCamera, dataRM);
        yield put({ type: 'reloadFetchAllPermissionCamera' });
      } catch (error) {}
    },

    *setPermisionCamera({ payload: payloadAdd }, { call, put }) {
      try {
        const res = yield call(UserApi.setPermisionCamera, payloadAdd);
        yield put({ type: 'reloadFetchAllPermissionCamera' });
      } catch (error) {}
    },
    // ==================================================================

    *reloadFetchAllPermissionCamera(action, { put, select }) {
      const code = yield select((state) => state.cameraPermissionInGroupUser.groupCode);
      yield put({ type: 'fetchAllPermissionCamera', payload: { code } });
    },
  },
};
