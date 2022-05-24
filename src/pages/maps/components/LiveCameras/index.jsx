import { StyledDrawer, ProTableStyle } from './style';
import { Space, Button } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
const LiveCameras = ({
  isOpenLiveCameras,
  setIsOpenLiveCameras,
  dispatch,
  cameraList,
  metadata,
}) => {
  const intl = useIntl();
  const searchCaptureFileParamDefault = {
    page: metadata?.page,
    size: metadata?.size,
  };
  const [searchParam, setSearchParam] = useState(searchCaptureFileParamDefault);
  const columns = [
    {
      title: '',
      dataIndex: 'recordingStatus',
      key: 'recordingStatus',
      valueEnum: (text) => {
        return {
          0: {
            text: text?.name,
            status: 'Default',
          },
          1: {
            text: text?.name,
            status: 'Success',
          },
          2: {
            text: text?.name,
            status: 'Error',
          },
        };
      },
    },
  ];
  const onClose = () => {
    setIsOpenLiveCameras(false);
  };
  const handleGetListCamera = (searchParam) => {
    dispatch({
      type: 'maps/fetchCameraList',
      payload: searchParam,
    });
  };
  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...searchParam, page, size });
    setSearchParam(dataParam);
    handleGetListCamera(dataParam);
  };
  return (
    <StyledDrawer
      openDrawer={isOpenLiveCameras}
      onClose={onClose}
      width={'26%'}
      zIndex={1001}
      placement="right"
      getContainer={false}
      closable={false}
    >
      <ProTableStyle
        rowKey="uuid"
        showHeader={false}
        search={false}
        options={false}
        dataSource={cameraList}
        columns={columns}
        pagination={{
          showTotal: false,
          total: metadata?.total,
          onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
    </StyledDrawer>
  );
};
function mapStateToProps(state) {
  const { cameraList, metadata } = state.maps;
  return {
    cameraList,
    metadata,
  };
}
export default connect(mapStateToProps)(LiveCameras);
