/* eslint-disable react-hooks/exhaustive-deps */
import { StyledDrawer, ProTableStyle, TableRowStyle } from './style';
import { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { Button } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
const CameraListDrawer = ({
  isOpenCameraListDrawer,
  dispatch,
  list,
  metadata,
  type,
  listStreaming,
}) => {
  const intl = useIntl();
  const [currentPage, setCurrentPage] = useState(metadata?.page);
  const [dataSource, setDataSource] = useState([]);
  const currentSize = 16;
  useEffect(() => {
    setCurrentPage(metadata?.page);
  }, [list]);
  useEffect(() => {
    const listStreamingUuid = listStreaming.map((item) => item?.uuid);
    const convertData = list.map((item) => {
      return {
        ...item,
        isPlay: listStreamingUuid.includes(item.uuid),
      };
    });
    setDataSource(convertData);
  }, [list, listStreaming]);
  const handleClickPlay = (item) => {
    if (item?.isPlay) {
      const finded = listStreaming.findIndex((itemStreaming) => itemStreaming?.uuid === item.uuid);
      if (finded !== -1) {
        const newListStreaming = [...listStreaming];
        newListStreaming[finded] = undefined;
        dispatch({
          type: 'viewLiveCameras/saveListStreaming',
          payload: newListStreaming,
        });
      }
    } else {
      const newItem = { ...item, isPlay: true };
      const checkUndefined = listStreaming.findIndex((item) => item === undefined);
      if (checkUndefined === -1) {
        if (listStreaming.length < 4) {
          const newListStreaming = [...listStreaming, newItem];
          dispatch({
            type: 'viewLiveCameras/saveListStreaming',
            payload: newListStreaming,
          });
        } else {
          const newListStreaming = [...listStreaming];
          const nodeList = document.querySelectorAll('.map__live-card');
          nodeList[0].parentNode.insertBefore(nodeList[0], null);
          newListStreaming[nodeList[0]?.id] = newItem;
          dispatch({
            type: 'viewLiveCameras/saveListStreaming',
            payload: newListStreaming,
          });
        }
      } else {
        const newListStreaming = [...listStreaming];
        newListStreaming[checkUndefined] = newItem;
        dispatch({
          type: 'viewLiveCameras/saveListStreaming',
          payload: newListStreaming,
        });
      }
    }
  };
  const customEnumText = (item) => {
    return (
      <TableRowStyle>
        <span>{item?.name}</span>
        <Button
          icon={item?.isPlay ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          shape="circle"
          onClick={() => handleClickPlay(item)}
          size="small"
        />
      </TableRowStyle>
    );
  };
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
                text: customEnumText(text),
                status: 'Error',
              },
              1: {
                text: customEnumText(text),
                status: 'Success',
              },
              2: {
                text: customEnumText(text),
                status: 'Default',
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
        dataSource={dataSource}
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
  const { listStreaming } = state.viewLiveCameras;
  return {
    list,
    metadata,
    isOpenCameraListDrawer,
    type,
    listStreaming,
  };
}
export default connect(mapStateToProps)(CameraListDrawer);
