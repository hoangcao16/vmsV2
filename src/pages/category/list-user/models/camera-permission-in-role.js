import { notify } from '@/components/Notify';
import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';
import { isEmpty } from 'lodash';

export default {
  namespace: 'cameraPermissionInRole',
  state: {
    listCameraPermission: [],
    listCameraNotPermission: [],
    metadata: {},
    roleCode: null,
  },
  reducers: {
    save(
      state,
      { payload: { data: listCameraPermission, metadata, roleCode, listCameraNotPermission } },
    ) {
      return { ...state, listCameraPermission, metadata, roleCode, listCameraNotPermission };
    },
  },
  effects: {
    *fetchAllPermissionCamera({ payload: { code } }, { call, put, select }) {
      try {
        const resDataPermision = yield call(UserApi.getRoleByRoleCode, code);

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

        const checkedGroup = cameraPerRows.map((t) => t.cam_uuid);
        const listCameraNotPermission = allCamera?.payload?.filter(
          (r) => !checkedGroup.includes(r.uuid),
        );

        yield put({
          type: 'save',
          payload: {
            data: cameraPerRows,
            metadata: { ...resDataPermision?.metadata },
            roleCode:
              resDataPermision?.payload?.role_code ||
              localStorage.getItem(STORAGE.ROLE_CODE_SELECTED),
            listCameraNotPermission,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    *removePermisionCamera({ payload: dataRM }, { call, put }) {
      try {
        yield call(UserApi.removePermisionCamera, dataRM);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.removePermisionCameraSuccess',
        );

        yield put({ type: 'reloadFetchAllPermissionCamera' });
      } catch (error) {
        console.log(error);
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *setPermisionCamera({ payload: payloadAdd }, { call, put }) {
      try {
        yield call(UserApi.setPermisionCamera, payloadAdd);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.setPermisionCameraSuccess',
        );

        yield put({ type: 'reloadFetchAllPermissionCamera' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *setMultiPermisionCameras({ payload: payloadAdd }, { call, put }) {
      try {
        yield call(UserApi.setMultiPermisionCameras, payloadAdd);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.setPermisionCameraSuccess',
        );

        yield put({ type: 'reloadFetchAllPermissionCamera' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },
    // ==================================================================

    *reloadFetchAllPermissionCamera(action, { put, select }) {
      const code = yield select(
        (state) =>
          state.cameraPermissionInRole.roleCode || localStorage.getItem(STORAGE.ROLE_CODE_SELECTED),
      );
      yield put({ type: 'fetchAllPermissionCamera', payload: { code } });
    },
  },
};
