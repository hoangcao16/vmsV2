import { notify } from '@/components/Notify';
import ExportEventFileApi from '@/services/exporteventfile/ExportEventFileApi';
import getBase64 from '@/utils/getBase64';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

const useHandleUploadFile = (fileName) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgFileName, setImgFileName] = useState(fileName);

  useEffect(() => {
    setImgFileName(fileName);
    const loadImageFileHanler = (fileName) => {
      if (!isEmpty(fileName)) {
        ExportEventFileApi.getAvatar(fileName).then((result) => {
          if (result.data) {
            let blob = new Blob([result.data], { type: 'octet/stream' });
            let url = window.URL.createObjectURL(blob);
            setImageUrl(url);
          } else {
            setImageUrl('');
          }
        });
      } else {
        setImageUrl('');
      }
    };
    loadImageFileHanler(fileName);
  }, [fileName]);
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
    }
  };

  const uploadImage = async (options) => {
    const { file } = options;
    await ExportEventFileApi.uploadAvatar(uuidV4(), file).then((result) => {
      if (result.data && result.data.payload && result.data.payload.fileUploadInfoList.length > 0) {
        getBase64(file, (imageUrl) => {
          setLoading(false);
          setImageUrl(imageUrl);
          const fileName = result.data.payload.fileUploadInfoList[0].name;
          setImgFileName(fileName);
        });
      }
    });
  };

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notify('error', 'noti.ERROR', 'noti.upload_file_desc');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      notify('error', 'noti.ERROR', 'noti.size_file_desc');
    }
    return isJpgOrPng && isLt2M;
  }
  return [imageUrl, imgFileName, loading, handleChange, uploadImage, beforeUpload];
};

export default useHandleUploadFile;
