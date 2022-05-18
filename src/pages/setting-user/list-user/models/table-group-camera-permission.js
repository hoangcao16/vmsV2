import { notify } from '@/components/Notify';
import UserApi from '@/services/user/UserApi';
import { isEmpty } from 'lodash';

export default {
  namespace: 'groupCameraPermissionInGroupUser',
  state: {
    listCameraGroupPermission: [],
    listCameraGroupNotPermission: [],
    metadata: {},
    groupCode: null,
  },
  reducers: {
    save(
      state,
      {
        payload: {
          data: listCameraGroupPermission,
          metadata,
          groupCode,
          listCameraGroupNotPermission,
        },
      },
    ) {
      return {
        ...state,
        listCameraGroupPermission,
        metadata,
        groupCode,
        listCameraGroupNotPermission,
      };
    },

    savePremissionNotInCameraGroup(state, { payload: { data: listCameraGroupNotPermission } }) {
      return { ...state, listCameraGroupNotPermission };
    },
  },
  effects: {
    *fetchAllPermissionCameraGroups({ payload: { code } }, { call, put, select }) {
      try {
        const allCameraGroups = yield call(UserApi.getAllCameraGroups, { page: 0, size: 10000 });
        const resDataPermision = yield call(UserApi.getAllUserInGroupById, code);

        const listPermissionCameraGroups = resDataPermision?.payload?.p_camera_groups;

        const convertDataRows = (data) => {
          const result = data.filter((p) => isEmpty(p.parent));

          return result.map((camG) => {
            const permision = camG?.permissions.map((p) => {
              return {
                [p]: 1,
              };
            });

            const permisionConvert = Object.assign({}, ...permision);

            return {
              ...permisionConvert,
              cam_group_uuid: camG?.cam_group_uuid,
              cam_group_name: camG?.cam_group_name,
              isDisableRow: false,
            };
          });
        };

        let cameraGroupsPerRows = [];

        if (!isEmpty(listPermissionCameraGroups)) {
          cameraGroupsPerRows = convertDataRows(listPermissionCameraGroups);
        }

        const checkedGroup = cameraGroupsPerRows.map((t) => t.cam_group_uuid);
        const listCameraGroupNotPermission = allCameraGroups?.payload?.filter(
          (r) => !checkedGroup.includes(r.uuid),
        );

        yield put({
          type: 'save',
          payload: {
            data: cameraGroupsPerRows,
            metadata: { ...resDataPermision?.metadata },
            groupCode: resDataPermision?.payload?.group_code,
            listCameraGroupNotPermission,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    *removePermisionCameraGroups({ payload: dataRM }, { call, put }) {
      try {
        const res = yield call(UserApi.removePermisionCameraGroups, dataRM);
        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.removePermisionCameraGroupSuccess',
          );
          yield put({ type: 'reloadFetchAllPermissionCameraGroups' });
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    },

    *setMultiPermisionCameraGroups({ payload: payloadAdd }, { call, put }) {
      try {
        const res = yield call(UserApi.setMultiPermisionCameraGroups, payloadAdd);

        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.setPermisionCameraGroupSuccess',
          );
          yield put({ type: 'reloadFetchAllPermissionCameraGroups' });
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    },

    *setPermisionCameraGroups({ payload: payloadAdd }, { call, put }) {
      try {
        const res = yield call(UserApi.setPermisionCameraGroups, payloadAdd);
        if (res?.code === 600) {
          notify(
            'success',
            'pages.setting-user.list-user.titleSuccess',
            'pages.setting-user.list-user.setPermisionCameraGroupSuccess',
          );
          yield put({ type: 'reloadFetchAllPermissionCameraGroups' });
        } else {
          notify(
            'error',
            'pages.setting-user.list-user.titleErrors',
            `pages.setting-user.list-user.${res?.code}`,
          );
        }
      } catch (error) {}
    },
    // ==================================================================

    *reloadFetchAllPermissionCameraGroups(action, { put, select }) {
      const code = yield select((state) => state.groupCameraPermissionInGroupUser.groupCode);
      yield put({ type: 'fetchAllPermissionCameraGroups', payload: { code } });
    },
  },
};
