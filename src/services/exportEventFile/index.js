import request, { fileRequestClient } from '@/utils/request';
import _uniqueId from 'lodash/uniqueId';
import { reactLocalStorage } from 'reactjs-localstorage';

const EVENT_FILE_ENDPOINT = '/cctv-controller-svc/api/v1/event-files';

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

const ExportEventFileApi = {
  uploadAvatar: async (avatarFileName, file) => {
    const fmData = new FormData();
    fmData.append(
      'fileInfo',
      new Blob(['{"fileName": "' + avatarFileName + '"}'], {
        type: 'application/json',
      }),
      'fileInfo.json',
    );
    fmData.append('files', file);
    return fileRequestClient.request({
      method: 'POST',
      url: '/api/v1/uploadAvatar',
      data: fmData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        requestId: _uniqueId('cctv'),
      },
    });
  },
  getAvatar: async (avatarFileName) => {
    return fileRequestClient.request({
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
  },

  downloadFile: async (fileId, fileType) => {
    return fileRequestClient.request({
      method: 'GET',
      url: '/api/v1/downloadFile',
      params: { fileId: fileId, fileType: fileType },
    });
  },

  downloadAIIntegrationFile: async (uuid, fileName) => {
    return fileRequestClient.request({
      method: 'GET',
      url: '/api/v1/downloadAIIntegrationFile',
      params: { uuid: uuid, fileName: fileName },

      headers: {
        ...getHeadersDownload(),
        requestId: _uniqueId('cctv'),
      },
      responseType: 'blob',
    });
  },

  uploadFile: async (fileName, file) => {
    const fmData = new FormData();
    fmData.append(
      'fileInfo',
      new Blob(['{"fileName": "' + fileName + '"}'], {
        type: 'application/json',
      }),
      'fileInfo.json',
    );
    fmData.append('files', file, fileName + '.jpeg');

    return fileRequestClient.post('/api/v1/uploadFile', fmData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        requestId: _uniqueId('cctv'),
      },
    });
  },

  downloadFileAI: async (cameraUuid, trackingId, uuid, fileName, fileType) => {
    return fileRequestClient.request({
      method: 'GET',
      url: '/api/v1/downloadAIFile',
      params: { cameraUuid: cameraUuid, trackingId: trackingId, uuid: uuid, fileName: fileName },
    });
  },

  createNewEventFile: async (record) => {
    return request.request({
      method: 'POST',
      url: EVENT_FILE_ENDPOINT,
      data: record,
    });
  },
};

export default ExportEventFileApi;
