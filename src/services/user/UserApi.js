import request from '@/utils/request';

const UserApi = {
  // User
  getAllUser: async (params) => {
    return request.get(`/authz/api/v0/users`, {
      params,
    });
  },

  getDetailUser: async (uuid) => {
    return request.get(`/authz/api/v0/users/${uuid}`);
  },

  createUser: async (values) => {
    return request.post('/authz/api/v0/users', values);
  },

  updateUser: async (id, values) => {
    return request.put(`/authz/api/v0/users/${id}`, values);
  },

  deleteUser: async (uuid) => {
    return request.delete(`/authz/api/v0/users/${uuid}`);
  },

  // UserGroup
  getAllUserGroup: async (params) => {
    return request.get(`/authz/api/v0/groups`, { params });
  },

  createUserGroup: async (params) => {
    return request.post(`/authz/api/v0/groups`, params);
  },

  updateUserGroup: async (id, values) => {
    return request.put(`/authz/api/v0/groups/${id}`, values);
  },

  resetPassWord: async (params) => {
    return request.post(`/authz/reset_password`, params);
  },

  deleteUserGroup: async (uuid) => {
    return request.delete(`/authz/api/v0/groups/${uuid}`);
  },

  //UserGroupById
  getUserGroupById: async (uuid) => {
    return request.get(`/authz/api/v0/groups/${uuid}`);
  },
  // getPermission
  getPermissions: async (params) => {
    return request.get(`/authz/api/v0/permissions`, { params });
  },
  //get all permission
  getAllPermission: async (params) => {
    return request.get(`/authz/api/v0/permission_groups`, { params });
  },

  //get all user in group user by group code
  getAllUserInGroupById: async (code, params) => {
    return request.get(`/authz/api/v0/authorization/get_permission?subject=user_g@${code}`, {
      params,
    });
  },

  //remove premission in group user
  removePermissionInGroup: async (dataRemove) => {
    return request.post('/authz/api/v0/authorization/remove_permission', dataRemove);
  },

  //remove premission other in group user
  removePermisionGroup: async (dataRemove) => {
    return request.post('/authz/api/v0/authorization/remove_permission', dataRemove);
  },

  //add premission other in group user
  setPermisionGroup: async (payloadAdd) => {
    return request.post('/authz/api/v0/authorization/add_permission', payloadAdd);
  },

  //remove user in group user
  removeUserInGroup: async (dataRemove) => {
    return request.post('/authz/api/v0/groups/remove', dataRemove);
  },

  //add member user into group user
  addMemberIntoGroups: async (dataAdd) => {
    return request.post('/authz/api/v0/groups/set', dataAdd);
  },

  // UserRole
  getAllUserRole: async (params) => {
    return request.get(`/authz/api/v0/roles`, { params });
  },

  updateUserRole: async (id, values) => {
    return request.put(`/authz/api/v0/roles/${id}`, values);
  },

  createRole: async (params) => {
    return request.post(`/authz/api/v0/roles`, params);
  },

  deleteRole: async (id) => {
    return request.delete(`/authz/api/v0/roles/${id}`);
  },

  // ==============================================================Permission

  getAllCameraGroups: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/camera_groups`, {
      params,
    });
  },

  getAllCamera: async (params) => {
    return request.get(`/cctv-controller-svc/api/v1/cameras`, {
      params,
    });
  },

  setPermisionCameraGroups: async (payloadAdd) => {
    return request.post('/authz/api/v0/authorization/add_permission', payloadAdd);
  },

  setMultiPermisionCameraGroups: async (payloadAdd) => {
    return request.post('/authz/api/v0/authorization/add_multi_permission', payloadAdd);
  },

  setMultiPermisionCameras: async (payloadAdd) => {
    return request.post('/authz/api/v0/authorization/add_multi_permission', payloadAdd);
  },

  removePermisionCameraGroups: async (dataRemove) => {
    return request.post('/authz/api/v0/authorization/remove_permission', dataRemove);
  },

  setPermisionCamera: async (payloadAdd) => {
    return request.post('/authz/api/v0/authorization/add_permission', payloadAdd);
  },

  removePermisionCamera: async (dataRemove) => {
    return request.post('/authz/api/v0/authorization/remove_permission', dataRemove);
  },

  getRoleByUuid: async (uuid) => {
    return request.get(`/authz/api/v0/roles/${uuid}`);
  },

  getRoleByRoleCode: async (code) => {
    return request.get(`/authz/api/v0/authorization/get_permission?subject=role@${code}`);
  },

  setPermisionRole: async (payloadAdd) => {
    return request.post('/authz/api/v0/authorization/add_permission', payloadAdd);
  },

  removePermisionRole: async (dataRemove) => {
    return request.post('/authz/api/v0/authorization/remove_permission', dataRemove);
  },

  removePermissionInRole: async (dataRemove) => {
    return request.post('/authz/api/v0/authorization/remove_permission', dataRemove);
  },

  // Setting User Data

  getAllGroups: async (params) => {
    return request.get(`/authz/api/v0/groups`, {
      params,
    });
  },
  getListPositionUnit: async () => {
    return request.get(`/cctv-controller-svc/api/v1/user/list_postion_unit`);
  },

  getAllRoles: async (params) => {
    return request.get(`/authz/api/v0/roles`, {
      params,
    });
  },
  getRolesByUser: async (uuid) => {
    return request.get(`/authz/api/v0/authorization/get_permission?subject=user@${uuid}`);
  },

  getGroupsByUser: async (uuid) => {
    return request.get(`/authz/api/v0/authorization/get_permission?subject=user@${uuid}`);
  },

  setRoleForUser: async (data) => {
    return request.post('/authz/api/v0/users/set_roles', data);
  },

  setGroupForUser: async (data) => {
    return request.post('/authz/api/v0/users/set_groups', data);
  },

  getGroupByUser: async (uuid) => {
    return request.get(`/authz/api/v0/authorization/get_permission?subject=user@${uuid}`);
  },
};

export default UserApi;
