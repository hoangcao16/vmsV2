import { notify } from '@/components/Notify';
import request, { fileRequestClient } from '@/utils/request';
import _uniqueId from 'lodash/uniqueId';

import { reactLocalStorage } from 'reactjs-localstorage';

const getHeadersDownload = () => {
  let headers = {
    Accept: 'application/octet-stream',
    'Content-Type': 'application/octet-stream',
  };
  let user = reactLocalStorage.getObject('user_permissions', null);
  if (user !== null) {
    let token = user.token;
    if (token) {
      headers.Authorization = token;
    }
  }
  return headers;
};

const EVENT_FILE_ENDPOINT = '/cctv-controller-svc/api/v1/event-files';

const ExportEventFileApi = {
  uploadAvatar: async (avatarFileName, file) => {
    let result;
    const fmData = new FormData();
    fmData.append(
      'fileInfo',
      new Blob(['{"fileName": "' + avatarFileName + '"}'], {
        type: 'application/json',
      }),
      'fileInfo.json',
    );
    fmData.append('files', file);
    try {
      result = await fileRequestClient.request({
        method: 'POST',
        url: '/api/v1/uploadAvatar',
        data: fmData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          requestId: _uniqueId('cctv'),
        },
      });
    } catch (e) {
      console.log(e);
      // notify('error', 'noti.archived_file', e.toString());
      return {};
    }
    return result;
  },
  getAvatar: async (avatarFileName) => {
    let result;
    try {
      result = await fileRequestClient.request({
        method: 'GET',
        url: '/api/v1/viewAvatar',
        params: { fileId: avatarFileName },
        headers: {
          Accept: 'application/octet-stream',
          'Content-Type': 'application/octet-stream',
          requestId: _uniqueId('cctv'),
        },
        responseType: 'blob',
      });
    } catch (e) {
      return {};
    }
    return result;
  },

  downloadFile: async (fileId, fileType) => {
    let result;
    try {
      result = await fileRequestClient.request({
        method: 'GET',
        url: '/api/v1/downloadFile',
        params: { fileId: fileId, fileType: fileType },
      });
    } catch (e) {
      return null;
    }
    return result;
  },

  downloadAIIntegrationFile: async (uuid, fileName) => {
    let result;
    try {
      result = await fileRequestClient.request({
        method: 'GET',
        url: '/api/v1/downloadAIIntegrationFile',
        params: { uuid: uuid, fileName: fileName },

        headers: {
          ...getHeadersDownload(),
          requestId: _uniqueId('cctv'),
        },
        responseType: 'blob',
      });
    } catch (e) {
      console.log(e);
      // notify('error', 'noti.archived_file', e.toString());

      return {};
    }
    return result;
  },

  uploadFile: async (fileName, file) => {
    let result;
    const fmData = new FormData();
    fmData.append(
      'fileInfo',
      new Blob(['{"fileName": "' + fileName + '"}'], {
        type: 'application/json',
      }),
      'fileInfo.json',
    );
    fmData.append('files', file);
    try {
      result = await fileRequestClient.request({
        method: 'POST',
        url: '/api/v1/uploadFile',
        data: fmData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          requestId: _uniqueId('cctv'),
        },
      });
    } catch (e) {
      console.log(e);
      // notify('error', 'noti.archived_file', e.toString());
      return {};
    }
    return result;
  },

  downloadFileAI: async (cameraUuid, trackingId, uuid, fileName, fileType) => {
    let result;
    try {
      result = await fileRequestClient.request({
        method: 'GET',
        url: '/api/v1/downloadAIFile',
        params: { cameraUuid: cameraUuid, trackingId: trackingId, uuid: uuid, fileName: fileName },
      });
    } catch (e) {
      console.log(e);
      // notify('error', 'noti.archived_file', e.toString());

      return {};
    }
    return result;
  },

  createNewEventFile: async (record) => {
    let result;
    try {
      result = await request.request({
        method: 'POST',
        url: EVENT_FILE_ENDPOINT,
        data: record,
      });
    } catch (e) {
      console.log(e);
      // notify('error', 'noti.archived_file', e.toString());
      return {};
    }
    return result;
  },
};

export default ExportEventFileApi;
