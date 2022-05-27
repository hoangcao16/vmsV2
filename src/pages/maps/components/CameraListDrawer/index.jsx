import { StyledDrawer, ProTableStyle } from './style';
import { useState } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
const CameraListDrawer = ({
  isOpenCameraListDrawer,
  setIsOpenCameraListDrawer,
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
    setIsOpenCameraListDrawer(false);
  };
  const handleGetListCamera = (searchParam) => {
    dispatch({
      type: 'maps/fetchCameraList',
      payload: searchParam,
    });
  };
  return (
    <StyledDrawer
      openDrawer={isOpenCameraListDrawer}
      onClose={onClose}
      width={'26%'}
      zIndex={5}
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
          pageSize: 16,
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
export default connect(mapStateToProps)(CameraListDrawer);
