/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyledDrawer,
  ProTableStyle,
  TableRowStyle,
  StyledSearch,
  StyledFilter,
  StyledTitle,
} from './style';
import { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { Button, Input, Form } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined, FilterFilled } from '@ant-design/icons';
import FilterDrawer from '../FilterDrawer';
import AddCamera from '@/pages/category/camera/components/AddCamera';

const CameraListDrawer = ({
  onRowClick,
  isOpenCameraListDrawer,
  dispatch,
  list,
  metadata,
  type,
  listStreaming,
  closeDrawerState,
}) => {
  const intl = useIntl();
  const [currentPage, setCurrentPage] = useState(metadata?.page);
  const [dataSource, setDataSource] = useState([]);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [isAddNewDrawer, setIsAddNewDrawer] = useState(false);
  const [form] = Form.useForm();
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
  useEffect(() => {
    setIsAddNewDrawer(false);
  }, [closeDrawerState]);
  const handleClickPlay = (item, event) => {
    event.stopPropagation();
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
        <span className="camera-name">{item?.name}</span>
        <Button
          icon={item?.isPlay ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          shape="circle"
          onClick={(event) => handleClickPlay(item, event)}
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
  const handleAdd = () => {
    if (type === 'camera') {
      setIsAddNewDrawer(true);
    }
  };
  const handleSearch = (dataForm) => {
    const data = {
      page: 1,
      size: 10000,
      ...dataForm,
    };
    if (type === 'camera') {
      dispatch({
        type: 'maps/fetchCameraList',
        payload: data,
      });
    } else if (type === 'adminisUnit') {
      dispatch({
        type: 'maps/fetchAllAdDivisions',
        payload: data,
      });
    } else {
      dispatch({
        type: 'maps/fetchAllCameraAI',
        payload: data,
      });
    }
  };
  return (
    <>
      <StyledDrawer
        openDrawer={isOpenCameraListDrawer}
        onClose={onClose}
        width={'20%'}
        zIndex={5}
        placement="right"
        getContainer={false}
        closable={false}
      >
        <Form form={form} onFinish={handleSearch} layout="vertical">
          <StyledTitle>
            {intl.formatMessage({
              id: type === 'adminisUnit' ? 'view.category.administrative_unit' : 'camera',
            })}
          </StyledTitle>
          <StyledSearch size={8}>
            <Form.Item name="name" noStyle>
              <Input.Search
                placeholder={intl.formatMessage(
                  {
                    id: 'view.maps.please_text_placeholder',
                  },
                  {
                    plsEnter: intl.formatMessage({
                      id: 'please_enter',
                    }),
                    txt: intl.formatMessage({
                      id: type === 'adminisUnit' ? 'view.department.administrative' : 'camera',
                    }),
                  },
                )}
                onSearch={form.submit}
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<FilterFilled />}
              onClick={() => setVisibleFilter(!visibleFilter)}
            />
          </StyledSearch>

          {visibleFilter && (
            <StyledFilter>
              <FilterDrawer form={form} />
            </StyledFilter>
          )}
        </Form>

        <ProTableStyle
          rowKey="uuid"
          showHeader={false}
          search={false}
          options={false}
          value={dataSource}
          columns={columns()}
          onRow={(record) => {
            return {
              onClick: (event) => {
                onRowClick(record);
              },
            };
          }}
          recordCreatorProps={{
            creatorButtonText: intl.formatMessage({
              id:
                type === 'adminisUnit'
                  ? 'view.category.add_administrative_unit'
                  : 'view.camera.add_camera',
            }),
            onClick: () => handleAdd(),
          }}
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
      <AddCamera isAddNewDrawer={isAddNewDrawer} setIsAddNewDrawer={setIsAddNewDrawer} />
    </>
  );
};
function mapStateToProps(state) {
  const { list, metadata, isOpenCameraListDrawer, type } = state.maps;
  const { listStreaming } = state.viewLiveCameras;
  const { closeDrawerState } = state.camera;
  return {
    list,
    metadata,
    isOpenCameraListDrawer,
    type,
    listStreaming,
    closeDrawerState,
  };
}
export default connect(mapStateToProps)(CameraListDrawer);
