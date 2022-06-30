import { notify } from '@/components/Notify';
import { STORAGE } from '@/constants/common';
import UserApi from '@/services/user/UserApi';
import { isEmpty } from 'lodash';

export default {
  namespace: 'cameraPermissionInUser',
  state: {
    listCameraPermission: [],
    listCameraNotPermission: [],
    metadata: {},
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
    *fetchAllPermissionCamera({ payload: { uuid } }, { call, put, select }) {
      try {
        const allCamera = yield call(UserApi.getAllCamera, {
          page: 0,
          size: 1000000,
        });

        const resDataPermision = yield call(UserApi.getGroupByUser, uuid);

        const listPermissionCameraGroups = resDataPermision?.payload;

        const convertDataWithRoles = (data) => {
          //Nhóm tất cả các bản ghi có cùng cam_uuid sau dó merge role name trong p_role_camera_groups
          var arr = [];
          var group_to_values1 = data.p_role_cameras.reduce(function (obj, item) {
            var data = {
              uuid: '',
              name_role: [],
              code_role: [],
              cam_uuid: '',
              cam_name: '',
              permissions: [],
            };

            obj[item.cam_uuid] = obj[item.cam_uuid] || data;

            obj[item.cam_uuid].uuid = item.uuid;

            obj[item.cam_uuid].cam_name = item.cam_name;

            obj[item.cam_uuid].name_role.push(item.name);
            obj[item.cam_uuid].code_role.push(item.code);

            item.permissions.forEach(function (e) {
              obj[item.cam_uuid].permissions.push(e);
            });

            return obj;
          }, {});
          Object.entries(group_to_values1).forEach(([key, value]) =>
            arr.push({
              cam_uuid: key,
              uuid: value.uuid,
              code_role: value.code_role,
              name_role: value.name_role,
              cam_name: value.cam_name,
              permissions: value.permissions,
            }),
          );

          //Nhóm tất cả các bản ghi có cùng cam_uuid sau dó merge role name trong p_user_g_camera_groups
          var arr2 = [];

          var group_to_values2 = data.p_user_g_cameras.reduce(function (obj, item) {
            var data = {
              uuid: '',
              name_group: [],
              code_group: [],
              cam_uuid: '',
              cam_name: '',
              permissions: [],
            };

            obj[item.cam_uuid] = obj[item.cam_uuid] || data;

            obj[item.cam_uuid].uuid = item.uuid;

            obj[item.cam_uuid].cam_name = item.cam_name;

            obj[item.cam_uuid].name_group.push(item.name);
            obj[item.cam_uuid].code_group.push(item.code);

            item.permissions.forEach(function (e) {
              obj[item.cam_uuid].permissions.push(e);
            });

            return obj;
          }, {});
          Object.entries(group_to_values2).forEach(([key, value]) =>
            arr2.push({
              cam_uuid: key,
              uuid: value.uuid,
              name_group: value.name_group,
              code_group: value.code_group,
              cam_name: value.cam_name,
              permissions: value.permissions,
            }),
          );

          //lặp qua 2 mảng để lấy ra data hiển thị

          let dataValue;

          //cả 2 mảng đều có giá trị

          if (!isEmpty(arr2) && !isEmpty(arr)) {
            if (!isEmpty(arr2) && !isEmpty(arr)) {
              dataValue = [];

              //nhóm 2 mảng lại với nhau

              const arrayData = arr2.concat(arr);

              var group_to_values3 = arrayData.reduce(function (obj, item) {
                var data = {
                  uuid: '',
                  code_role: [],
                  name_role: [],
                  name_group: [],
                  code_group: [],
                  cam_uuid: '',
                  cam_name: '',
                  permissions: [],
                };

                obj[item.cam_uuid] = obj[item.cam_uuid] || data;

                obj[item.cam_uuid].uuid = item.uuid;

                obj[item.cam_uuid].cam_name = item.cam_name;

                obj[item.cam_uuid].name_group.push(item.name_group);
                obj[item.cam_uuid].code_group.push(item.code_group);

                obj[item.cam_uuid].code_role.push(item.code_role);
                obj[item.cam_uuid].name_role.push(item.name_role);

                item.permissions.forEach(function (e) {
                  obj[item.cam_uuid].permissions.push(e);
                });

                return obj;
              }, {});
              Object.entries(group_to_values3).forEach(([key, value]) =>
                dataValue.push({
                  cam_uuid: key,
                  uuid: value.uuid,
                  name_group: value.name_group.flat().filter((el) => el !== undefined),
                  code_group: value.code_group.flat().filter((el) => el !== undefined),
                  name_role: value.name_role.flat().filter((el) => el !== undefined),
                  code_role: value.code_role.flat().filter((el) => el !== undefined),
                  cam_name: value.cam_name,
                  permissions: [...new Set([...value.permissions])].map((p) => {
                    return {
                      [p]: 1,
                    };
                  }),
                }),
              );
            }
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
              cam_uuid: camG.cam_uuid,
              cam_name: camG.cam_name,
              user_cam_group: camG.name_group,
              role_cam_group: camG.name_role,

              isDisableRow: true,
            };
            return t;
          });
        };

        const convertDataWithUserGroup = (data) => {
          return data.p_cameras.map((pc) => {
            const permision = pc.permissions.map((p) => {
              return {
                [p]: 1,
              };
            });

            const permisionConvert = Object.assign({}, ...permision);

            return {
              ...permisionConvert,
              cam_name: pc?.cam_name,
              cam_uuid: pc?.cam_uuid,
              // isDisableRow: checkDisable(pc.cam_group_uuid, data?.p_camera_groups), // đk để hiển thị là
            };
          });
        };

        let cameraPerRows = [];

        let cameraPerRowsWithRole = [];
        let cameraPerRowsWithUserGroup = [];

        if (!isEmpty(listPermissionCameraGroups) && !isEmpty(allCamera)) {
          cameraPerRowsWithRole = convertDataWithRoles(listPermissionCameraGroups);

          cameraPerRowsWithUserGroup = convertDataWithUserGroup(listPermissionCameraGroups);
          cameraPerRows = [...cameraPerRowsWithRole, ...cameraPerRowsWithUserGroup];
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
        console.log(error);
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
        console.log(error);
      }
    },
    // ==================================================================

    *reloadFetchAllPermissionCamera(action, { put, select }) {
      const uuid = yield select(
        (state) =>
          state.cameraPermissionInUser.roleCode || localStorage.getItem(STORAGE.USER_UUID_SELECTED),
      );
      yield put({ type: 'fetchAllPermissionCamera', payload: { uuid } });
    },
  },
};
