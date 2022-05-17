import FileService from './fileservice';
import { notify } from '@/components/Notify';

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
      result = await FileService.postRequestData('/api/v1/uploadAvatar', fmData);
    } catch (e) {
      notify('error', 'noti.archived_file', e.toString());
      return {};
    }
    return result;
  },
};

export default ExportEventFileApi;
