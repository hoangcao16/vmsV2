/* eslint-disable react-hooks/exhaustive-deps */
import { StyledDrawer, ProTableStyle } from './style';
import { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
const CameraListDrawer = ({ isOpenCameraListDrawer, dispatch, list, metadata, type }) => {
  const intl = useIntl();
  const [currentPage, setCurrentPage] = useState(metadata?.page);
  const currentSize = 16;
  useEffect(() => {
    setCurrentPage(metadata?.page);
  }, [list]);
  const columns = () => {
    if (type === 'adminisUnit') {
      return [{ title: '', dataIndex: 'name', key: 'name' }];
    } else {
      return [
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
    }
  };
  const onClose = () => {
    dispatch({
      type: 'maps/saveIsOpenCameraListDrawer',
      payload: false,
    });
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
        dataSource={list}
        columns={columns()}
        pagination={{
          showTotal: false,
          total: metadata?.total,
          pageSize: currentSize,
          current: currentPage,
          onChange: (page) => {
            setCurrentPage(page);
          },
        }}
      />
    </StyledDrawer>
  );
};
function mapStateToProps(state) {
  const { list, metadata, isOpenCameraListDrawer, type } = state.maps;
  return {
    list,
    metadata,
    isOpenCameraListDrawer,
    type,
  };
}
export default connect(mapStateToProps)(CameraListDrawer);
