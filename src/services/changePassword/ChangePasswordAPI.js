import request from '@/utils/request';

const ChangePass = {
  changePass: async (uuid, record) => {
    return request.request({
      method: 'PUT',
      url: `/authz/api/v0/users/${uuid}`,
      data: record,
    });
  },
};

export default ChangePass;
