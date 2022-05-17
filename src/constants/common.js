export const API_URL = process.env.REACT_APP_BASE_URL || 'http://10.0.0.62:10001';
// export const API_IMAGE_URL = (fileName) => API_URL + '/posts/files/upload/' + fileName;
// export const API_URL = "http://192.168.50.160:3001/v1";

export const STORAGE = {
  TOKEN: 'token',
  USER: 'user',
  USER_PERMISSIONS: 'user_permissions',
  REFRESH_TOKEN: 'refreshToken',
  GROUP_CODE_SELECTED: 'group_code_selected',
  GROUP_UUID_SELECTED: 'group_uuid_selected',
};

// export const IS_SERVER = typeof window === 'undefined';
