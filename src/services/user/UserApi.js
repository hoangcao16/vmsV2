import request from '@/utils/request';

const UserApi = {
  // User
  getAllUser: async (params) => {
    return request.get(`/authz/api/v0/users`, {
      params,
    });
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

  deleteUserGroup: async (uuid) => {
    return request.delete(`/authz/api/v0/groups/${uuid}`);
  },

  //UserGroupById
  getUserGroupById: async (uuid) => {
    return request.get(`/authz/api/v0/groups/${uuid}`);
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

  setPermisionCameraGroups: async (payloadAdd) => {
    return request.post('/authz/api/v0/authorization/add_permission', payloadAdd);
  },
  removePermisionCameraGroups: async (payloadAdd) => {
    return request.post('/authz/api/v0/authorization/remove_permission', payloadAdd);
  },
};

export default UserApi;
