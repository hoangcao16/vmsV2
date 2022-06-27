import { LIVE_MODE } from '@/constants/common';
import { GRID1X1, GRID2X2, GRID3X3, GRID4X4 } from '@/constants/grid';
import bookmarkService from '@/services/bookmark';
import cameraService from '@/services/controllerApi/cameraService';
import { HeartOutlined, OrderedListOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Space, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { BsArrowsFullscreen, BsFullscreenExit } from 'react-icons/bs';
import { connect, FormattedMessage } from 'umi';
import ActionGrid from './components/ActionGrid';
import CameraList from './components/CameraList';
import FavoriteList from './components/FavoriteList';
import GridPanel from './components/GridPanel';
import PlaybackControl from './components/player/PlaybackControl';
import SaveFavorite from './components/SaveFavorite';
import SettingPresetDrawer from './components/SettingPresetDrawer';
import { StyledButtonFullScreen, StyledTabs, StyledTag, StyledText } from './style';
const Live = ({
  availableList,
  screen,
  dispatch,
  list,
  showPresetSetting,
  mode,
  grids,
  gridType,
  isFullScreen,
}) => {
  const [visibleCameraList, setVisibleCameraList] = useState(false);
  const [visibleFavoriteList, setVisibleFavoriteList] = useState(false);
  const [visibleSaveFavorite, setVisibleSaveFavorite] = useState(false);

  useEffect(() => {
    fetchDefaultScreen();
  }, []);

  const fetchDefaultScreen = async () => {
    const { payload } = await bookmarkService.getDefault();
    initScreen(payload[0] || undefined);
  };

  const initScreen = async (screen) => {
    if (screen) {
      const { cameraUuids = [], gridType, viewTypes = [], name = '' } = screen;
      const cameraNameWithUuids = {};

      const { payload } = await cameraService.searchCamerasWithUuids({
        uuids: cameraUuids.filter(Boolean),
      });

      if (payload && payload.length) {
        payload.forEach((camera) => {
          cameraNameWithUuids[camera.uuid] = camera;
        });
      }

      const grids = cameraUuids.map((uuid, index) => {
        return {
          id: cameraNameWithUuids[uuid] ? cameraNameWithUuids[uuid].id : '',
          uuid,
          type: viewTypes[index],
          name: cameraNameWithUuids[uuid] ? cameraNameWithUuids[uuid].name : '',
        };
      });

      dispatch({
        type: 'live/saveMode',
        payload: 'live',
      });
      dispatch({
        type: 'live/saveGrids',
        payload: grids,
      });
      dispatch({
        type: 'live/saveGridType',
        payload: gridType,
      });
      dispatch({
        type: 'live/saveScreen',
        payload: {
          name: name,
        },
      });
    } else {
      dispatch({
        type: 'live/saveMode',
        payload: 'live',
      });
      dispatch({
        type: 'live/saveGrids',
        payload: initEmptyGrid(1),
      });
      dispatch({
        type: 'live/saveGridType',
        payload: GRID1X1,
      });
      dispatch({
        type: 'live/saveScreen',
        payload: {
          name: '',
        },
      });
    }
  };

  const changeScreen = (gridType) => {
    dispatch({
      type: 'live/saveGridType',
      payload: gridType,
    });
    dispatch({
      type: 'live/saveScreen',
      payload: {
        name: '',
      },
    });
  };

  const initEmptyGrid = (number) => {
    return Array.from(new Array(number)).map((_, index) => ({
      id: '',
      uuid: '',
      name: '',
    }));
  };
  const onDragEnd = (result, type) => {
    const { destination, source, draggableId } = result;
    if (!destination || !source) return;
    if (source.droppableId === LIVE_MODE.CAMERA_LIST_DROPPABLE_ID) {
      const draggableCam = availableList[source.index];

      grids[destination.index] = {
        id: draggableCam.id,
        uuid: draggableCam?.uuid,
        type: 'live',
        name: draggableCam?.name,
      };

      let maxCam = 99;

      if (gridType === GRID1X1) {
        maxCam = 1;
      } else if (gridType === GRID2X2) {
        maxCam = 4;
      } else if (gridType === GRID3X3) {
        maxCam = 9;
      } else if (gridType === GRID4X4) {
        maxCam = 16;
      }

      if (grids.length > maxCam) {
        grids.pop();
        grids[maxCam - 1] = {
          id: draggableCam.id,
          uuid: draggableCam?.uuid,
          type: 'live',
          name: draggableCam?.name,
        };

        dispatch({
          type: 'live/saveGrids',
          payload: grids,
        });
      } else {
        dispatch({
          type: 'live/saveGrids',
          payload: grids,
        });
      }
      dispatch({
        type: 'live/saveGrids',
        payload: grids,
      });
    } else {
      const camObj = grids[source.index];
      grids[source.index] = grids[destination.index];
      grids[destination.index] = camObj;

      dispatch({
        type: 'live/saveGrids',
        payload: grids,
      });
    }
  };

  const getGrid = (gridType) => {
    switch (gridType) {
      case GRID1X1:
        return 1;
      case GRID2X2:
        return 4;
      case GRID3X3:
        return 9;
      case GRID4X4:
        return 16;
    }
  };

  const handleChangeMode = (mode) => {
    dispatch({
      type: 'live/saveMode',
      payload: mode,
    });
  };

  const handleCloseDrawer = () => {
    dispatch({ type: 'live/closeDrawerSettingCamera' });
  };
  const handleChangeFullScreen = () => {
    dispatch({
      type: 'globalstore/saveIsFullScreen',
      payload: !isFullScreen,
    });
  };

  return (
    <>
      <PageContainer
        extra={[
          <Button key="0" icon={<HeartOutlined />} onClick={() => setVisibleFavoriteList(true)}>
            <StyledText id="pages.live-mode.list.favorite" />
          </Button>,
          <Button
            key="1"
            type="primary"
            icon={<OrderedListOutlined />}
            onClick={() => setVisibleCameraList(true)}
          >
            <StyledText id="pages.live-mode.list.camera" />
          </Button>,
        ]}
      >
        <StyledTabs
          onChange={handleChangeMode}
          tabBarExtraContent={{
            right: [
              <React.Fragment key="right">
                {screen?.name !== '' && (
                  <StyledTag icon={<SaveOutlined />} color="#292929">
                    {screen?.name}
                  </StyledTag>
                )}
                <Space size={16}>
                  <Button
                    icon={<SaveOutlined />}
                    type="primary"
                    onClick={() => setVisibleSaveFavorite(true)}
                  >
                    <StyledText id="pages.live-mode.action.save-favorite" />
                  </Button>
                  <ActionGrid grid={screen.gridType} onChange={changeScreen} />
                </Space>
              </React.Fragment>,
            ],
          }}
        >
          <StyledTabs.TabPane
            key="live"
            tab={<FormattedMessage id="pages.live-mode.mode.live" />}
          />
          <StyledTabs.TabPane
            key="play"
            tab={<FormattedMessage id="pages.live-mode.mode.review" />}
          >
            <PlaybackControl />
          </StyledTabs.TabPane>
        </StyledTabs>
        <DragDropContext onDragEnd={onDragEnd}>
          <GridPanel screen={screen} mode={mode} grids={grids} gridType={gridType} />
          <CameraList
            title={<FormattedMessage id="pages.live-mode.list.camera" />}
            cameras={availableList}
            visible={visibleCameraList}
            onClose={() => setVisibleCameraList(false)}
          />
        </DragDropContext>
        {showPresetSetting && (
          <SettingPresetDrawer
            showPresetSetting={showPresetSetting}
            onCloseDrawer={handleCloseDrawer}
          />
        )}
        <Tooltip
          placement="topLeft"
          title={
            <FormattedMessage
              id={
                !isFullScreen
                  ? 'page.live-mode.action.view-fullscreen'
                  : 'page.live-mode.action.exit-view-fullscreen'
              }
            />
          }
        >
          <StyledButtonFullScreen onClick={handleChangeFullScreen}>
            {!isFullScreen ? <BsArrowsFullscreen /> : <BsFullscreenExit />}
          </StyledButtonFullScreen>
        </Tooltip>
      </PageContainer>
      <FavoriteList
        title={<FormattedMessage id="pages.live-mode.list.favorite" />}
        visible={visibleFavoriteList}
        onClose={() => setVisibleFavoriteList(false)}
        initScreen={initScreen}
        screen={screen}
      />
      {visibleSaveFavorite && (
        <SaveFavorite
          visible={visibleSaveFavorite}
          onClose={() => {
            setVisibleSaveFavorite(false);
          }}
          dispatch={dispatch}
          list={list}
          grids={grids}
          gridType={gridType}
        />
      )}
    </>
  );
};

const mapStateToProps = ({ live, globalstore, favorite }) => {
  const {
    availableList = [],
    screen = {},
    mode,
    grids,
    gridType,
    showPresetSetting = false,
  } = live;
  const { isFullScreen } = globalstore;
  const { list } = favorite;
  return {
    availableList,
    screen,
    isFullScreen,
    showPresetSetting,
    list,
    mode,
    grids,
    gridType,
  };
};

export default connect(mapStateToProps)(Live);
