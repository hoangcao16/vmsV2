import axios from 'axios/index';
import _uniqueId from 'lodash/uniqueId';
import { reactLocalStorage } from 'reactjs-localstorage';
import { notify } from '@/components/Notify';
const getHeaders = () => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  };
  let user = reactLocalStorage.getObject('user', null);
  if (user !== null) {
    let token = user.token;
    if (token) {
      headers.Authorization = token;
    }
  }
  return headers;
};

const getHeadersDownload = () => {
  let headers = {
    Accept: 'application/octet-stream',
    'Content-Type': 'application/octet-stream',
  };
  let user = reactLocalStorage.getObject('user', null);
  if (user !== null) {
    let token = user.token;
    if (token) {
      headers.Authorization = token;
    }
  }
  return headers;
};

const getHeadersUpload = () => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
  };
  let token = reactLocalStorage.get('token', null);
  if (token !== null) {
    if (token) {
      headers.Authorization = token;
    }
  }
  return headers;
};

const getAuth = () => {
  let user = reactLocalStorage.getObject('user', null);
  if (user !== null) {
    let token = user.token;
    if (token) {
      return token;
    }
  }
  return null;
};
const BASE_URL = REACT_APP_BASE_FILE_URL;
const KFileReserveProxyOk = 1600;
const FileService = {
  _checkResponse(response) {
    if (response && response.status) {
      if (response.status === 200) {
        if (
          response.data &&
          response.data.code &&
          response.data.code !== KFileReserveProxyOk + ''
        ) {
          notify(
            'error',
            {
              id: 'noti.error_code',
              params: {
                code: response.data.code.toString(),
              },
            },
            response.data.message,
          );
          return false;
        }
        return true;
      }
      return false;
    }
    return false;
  },
  _checkResponseUpload(response) {
    if (response && response.status) {
      if (response.status === 200) {
        if (
          response.data &&
          response.data.code &&
          response.data.code !== KFileReserveProxyOk + ''
        ) {
          notify(
            'error',
            {
              id: 'noti.error_code',
              params: {
                code: response.data.code.toString(),
              },
            },
            'noti.upload_failed',
          );
          return false;
        }
        return true;
      }
      return false;
    }
    return false;
  },

  async getRequestData(url, params) {
    return await axios({
      method: 'get',
      url: BASE_URL + url,
      headers: {
        ...getHeadersDownload(),
        requestId: _uniqueId('cctv'),
      },
      responseType: 'blob',
      params: {
        ...params,
      },
    })
      .then((response) => {
        let check = this._checkResponse(response);
        if (!check) {
          return {};
        }
        return response;
      })
      .catch((e) => {
        return {};
      });
  },

  async postRequestData(url, data) {
    return await axios
      .post(BASE_URL + url, data, {
        headers: {
          ...getHeadersUpload(),
          requestId: _uniqueId('cctv'),
        },
      })
      .then((response) => {
        let check = this._checkResponseUpload(response);
        if (!check) {
          return {};
        }
        return response;
      })
      .catch((e) => {
        notify('error', 'noti.ERROR', e.toString());
        return {};
      });
  },

  async putRequestData(url, data, token) {
    return await axios
      .put(BASE_URL + url, data, {
        headers: getHeaders(),
      })
      .then((response) => {
        let check = this._checkResponse(response);
        if (!check) {
          return null;
        }
        return response.data;
      })
      .catch((e) => {
        notify('error', 'noti.archived_file', e.toString());
        return null;
      });
  },

  async deleteRequestData(url, data) {
    return await axios
      .post(BASE_URL + url, data, {
        headers: {
          ...getHeaders(),
          requestId: _uniqueId('cctv'),
        },
      })
      .then((response) => {
        let check = this._checkResponse(response);
        if (!check) {
          return null;
        }
        return response.data;
      })
      .catch((e) => {
        notify('error', 'noti.archived_file', e.toString());
        return null;
      });
  },
};

export default FileService;
