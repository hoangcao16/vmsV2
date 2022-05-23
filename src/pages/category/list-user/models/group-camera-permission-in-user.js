import { notify } from '@/components/Notify';
import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';
import { isEmpty } from 'lodash';

export default {
  namespace: 'groupCameraPermissionInUser',
  state: {
    listCameraGroupPermission: [],
    listCameraGroupNotPermission: [],
    metadata: {},
    roleCode: null,
  },
  reducers: {
    save(
      state,
      {
        payload: {
          data: listCameraGroupPermission,
          metadata,
          roleCode,
          listCameraGroupNotPermission,
        },
      },
    ) {
      return {
        ...state,
        listCameraGroupPermission,
        metadata,
        roleCode,
        listCameraGroupNotPermission,
      };
    },

    savePremissionNotInCameraGroup(state, { payload: { data: listCameraGroupNotPermission } }) {
      return { ...state, listCameraGroupNotPermission };
    },
  },
  effects: {
    *fetchAllPermissionCameraGroups({ payload: { uuid } }, { call, put, select }) {
      try {
        const allCameraGroups = yield call(UserApi.getAllCameraGroups, { page: 0, size: 10000 });
        const resDataPermision = yield call(UserApi.getGroupByUser, uuid);

        const listPermissionCameraGroups = resDataPermision?.payload;

        const convertDataWithRoles = (data) => {
          //Nhóm tất cả các bản ghi có cùng cam_group_uuid sau dó merge role name trong p_role_camera_groups
          var arr = [];
          var group_to_values1 = data.p_role_camera_groups.reduce(function (obj, item) {
            var data = {
              uuid: '',
              name_role: [],
              code_role: [],
              cam_group_uuid: '',
              cam_group_name: '',
              permissions: [],
            };

            obj[item.cam_group_uuid] = obj[item.cam_group_uuid] || data;

            obj[item.cam_group_uuid].uuid = item.uuid;

            obj[item.cam_group_uuid].cam_group_name = item.cam_group_name;

            obj[item.cam_group_uuid].name_role.push(item.name);
            obj[item.cam_group_uuid].code_role.push(item.code);

            item.permissions.forEach(function (e) {
              obj[item.cam_group_uuid].permissions.push(e);
            });

            return obj;
          }, {});

          Object.entries(group_to_values1).forEach(([key, value]) =>
            arr.push({
              cam_group_uuid: key,
              uuid: value.uuid,
              code_role: value.code_role,
              name_role: value.name_role,
              cam_group_name: value.cam_group_name,
              permissions: value.permissions,
            }),
          );

          //Nhóm tất cả các bản ghi có cùng cam_group_uuid sau dó merge role name trong p_user_g_camera_groups
          var arr2 = [];

          var group_to_values2 = data.p_user_g_camera_groups.reduce(function (obj, item) {
            var data = {
              uuid: '',
              name_group: [],
              code_group: [],
              cam_group_uuid: '',
              cam_group_name: '',
              permissions: [],
            };

            obj[item.cam_group_uuid] = obj[item.cam_group_uuid] || data;

            obj[item.cam_group_uuid].uuid = item.uuid;

            obj[item.cam_group_uuid].cam_group_name = item.cam_group_name;

            obj[item.cam_group_uuid].name_group.push(item.name);
            obj[item.cam_group_uuid].code_group.push(item.code);

            item.permissions.forEach(function (e) {
              obj[item.cam_group_uuid].permissions.push(e);
            });

            return obj;
          }, {});
          Object.entries(group_to_values2).forEach(([key, value]) =>
            arr2.push({
              cam_group_uuid: key,
              uuid: value.uuid,
              name_group: value.name_group,
              code_group: value.code_group,
              cam_group_name: value.cam_group_name,
              permissions: value.permissions,
            }),
          );

          //lặp qua 2 mảng để lấy ra data hiển thị

          let dataValue;

          //cả 2 mảng đều có giá trị

          if (!isEmpty(arr2) && !isEmpty(arr)) {
            dataValue = [];

            //nhóm 2 mảng lại với nhau()

            const arrayData = arr2.concat(arr);

            var group_to_values3 = arrayData.reduce(function (obj, item) {
              var data = {
                uuid: '',
                code_role: [],
                name_role: [],
                name_group: [],
                code_group: [],
                cam_group_uuid: '',
                cam_group_name: '',
                permissions: [],
              };

              obj[item.cam_group_uuid] = obj[item.cam_group_uuid] || data;

              obj[item.cam_group_uuid].uuid = item.uuid;

              obj[item.cam_group_uuid].cam_group_name = item.cam_group_name;

              obj[item.cam_group_uuid].name_group.push(item.name_group);
              obj[item.cam_group_uuid].code_group.push(item.code_group);

              obj[item.cam_group_uuid].code_role.push(item.code_role);
              obj[item.cam_group_uuid].name_role.push(item.name_role);

              item.permissions.forEach(function (e) {
                obj[item.cam_group_uuid].permissions.push(e);
              });

              return obj;
            }, {});
            Object.entries(group_to_values3).forEach(([key, value]) =>
              dataValue.push({
                cam_group_uuid: key,
                uuid: value.uuid,
                name_group: value.name_group.flat().filter((el) => el !== undefined),
                code_group: value.code_group.flat().filter((el) => el !== undefined),
                name_role: value.name_role.flat().filter((el) => el !== undefined),
                code_role: value.code_role.flat().filter((el) => el !== undefined),
                cam_group_name: value.cam_group_name,
                permissions: [...new Set([...value.permissions])].map((p) => {
                  return {
                    [p]: 1,
                  };
                }),
              }),
            );
          }

          //cả  mảng có mảng không giá trị
          if (!isEmpty(arr2) && isEmpty(arr)) {
            dataValue = arr2.map((a2) => {
              return {
                ...a2,
                permissions: [...new Set([...a2.permissions])].map((p) => {
                  return {
                    [p]: 1,
                  };
                }),
              };
            });
          }

          //cả  mảng có mảng không giá trị
          if (isEmpty(arr2) && !isEmpty(arr)) {
            dataValue = arr.map((a2) => {
              return {
                ...a2,
                permissions: [...new Set([...a2.permissions])].map((p) => {
                  return {
                    [p]: 1,
                  };
                }),
              };
            });
          }

          //cả 2 mảng không có giá trị

          if (isEmpty(arr2) && isEmpty(arr)) {
            dataValue = [];
          }

          return dataValue.map((camG) => {
            const permisionConvert = Object.assign({}, ...camG.permissions);

            const t = {
              ...permisionConvert,
              cam_group_uuid: camG.cam_group_uuid,
              cam_group_name: camG.cam_group_name,
              user_cam_group: camG.name_group,
              role_cam_group: camG.name_role,

              isDisableRow: true,
            };

            return t;
          });
        };

        const convertDataWithUserGroup = (data) => {
          const result = data.p_camera_groups.filter((p) => isEmpty(p.parent));
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

        let cameraGroupsPerRowsWithRole = [];
        let cameraGroupsPerRowsWithUserGroup = [];

        if (!isEmpty(listPermissionCameraGroups) && !isEmpty(allCameraGroups)) {
          cameraGroupsPerRowsWithRole = convertDataWithRoles(listPermissionCameraGroups);

          cameraGroupsPerRowsWithUserGroup = convertDataWithUserGroup(listPermissionCameraGroups);
          cameraGroupsPerRows = [
            ...cameraGroupsPerRowsWithRole,
            ...cameraGroupsPerRowsWithUserGroup,
          ];
        }

        const checkedGroup = cameraGroupsPerRowsWithUserGroup.map((t) => t.cam_group_uuid);
        const listCameraGroupNotPermission = allCameraGroups?.payload?.filter(
          (r) => !checkedGroup.includes(r.uuid),
        );

        yield put({
          type: 'save',
          payload: {
            data: cameraGroupsPerRows,
            listCameraGroupNotPermission,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    *removePermisionCameraGroups({ payload: dataRM }, { call, put }) {
      try {
        yield call(UserApi.removePermisionCameraGroups, dataRM);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.removePermisionCameraGroupSuccess',
        );
        yield put({ type: 'reloadFetchAllPermissionCameraGroups' });
      } catch (error) {
        console.log(error);
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *setMultiPermisionCameraGroups({ payload: payloadAdd }, { call, put }) {
      try {
        yield call(UserApi.setMultiPermisionCameraGroups, payloadAdd);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.setPermisionCameraGroupSuccess',
        );
        yield put({ type: 'reloadFetchAllPermissionCameraGroups' });
      } catch (error) {
        console.log(error);
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },

    *setPermisionCameraGroups({ payload: payloadAdd }, { call, put }) {
      try {
        yield call(UserApi.setPermisionCameraGroups, payloadAdd);

        notify(
          'success',
          'pages.setting-user.list-user.titleSuccess',
          'pages.setting-user.list-user.setPermisionCameraGroupSuccess',
        );
        yield put({ type: 'reloadFetchAllPermissionCameraGroups' });
      } catch (error) {
        notify(
          'error',
          'pages.setting-user.list-user.titleErrors',
          `pages.setting-user.list-user.${error?.code}`,
        );
      }
    },
    // ==================================================================

    *reloadFetchAllPermissionCameraGroups(action, { put, select }) {
      const uuid = yield select((state) => localStorage.getItem(STORAGE.USER_UUID_SELECTED));
      yield put({ type: 'fetchAllPermissionCameraGroups', payload: { uuid } });
    },
  },
};
