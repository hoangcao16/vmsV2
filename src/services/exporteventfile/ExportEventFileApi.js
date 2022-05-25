import { notify } from '@/components/Notify';
import { fileRequestClient } from '@/utils/request';
import _uniqueId from 'lodash/uniqueId';

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
};

export default ExportEventFileApi;
