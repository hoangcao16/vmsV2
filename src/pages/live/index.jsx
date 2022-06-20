import { LIVE_MODE } from '@/constants/common';
import { GRID1X1, GRID2X2, GRID3X3, GRID4X4 } from '@/constants/grid';
import bookmarkService from '@/services/bookmark';
import cameraService from '@/services/controllerApi/cameraService';
import { HeartOutlined, OrderedListOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect, FormattedMessage } from 'umi';

import ActionGrid from './components/ActionGrid';
import CameraList from './components/CameraList';
import GridPanel from './components/GridPanel';
import PlaybackControl from './components/player/PlaybackControl';
import { StyledTabs, StyledText } from './style';

const Live = ({ availableList, screen, dispatch }) => {
  const [visibleCameraList, setVisibleCameraList] = useState(false);

  useEffect(() => {
    fetchDefaultScreen();
  }, []);

  const fetchDefaultScreen = async () => {
    try {
      const { payload } = await bookmarkService.getDefault();
      initScreen(payload[0]);
    } catch (error) {
      initScreen();
    }
  };

  const initScreen = async (screen) => {
    if (screen) {
      const { cameraUuids = [], gridType, viewTypes = [] } = screen;
      const cameraNameWithUuids = {};

      const { payload } = await cameraService.searchCamerasWithUuids({
        uuids: cameraUuids.filter(Boolean),
      });

      if (payload && payload.length) {
        payload.forEach((camera) => {
          cameraNameWithUuids[camera.uuid] = camera;
        });
      }

      const grids = cameraUuids.map((uuid, index) => ({
        id: cameraNameWithUuids[uuid] ? cameraNameWithUuids[uuid].id : '',
        uuid,
        type: viewTypes[index],
        name: cameraNameWithUuids[uuid] ? cameraNameWithUuids[uuid].name : '',
      }));

      dispatch({
        type: 'live/saveScreen',
        payload: {
          mode: 'live',
          grids: grids,
          gridType: gridType,
        },
      });
    } else {
      dispatch({
        type: 'live/saveScreen',
        payload: {
          mode: 'live',
          grids: initEmptyGrid(1),
          gridType: GRID1X1,
        },
      });
    }
  };

  const changeScreen = (gridType) => {
    dispatch({
      type: 'live/saveScreen',
      payload: {
        ...screen,
        grids: initEmptyGrid(getGrid(gridType)),
        gridType: gridType,
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

  const onDragEnd = ({ destination, source }) => {
    if (!destination || !source) return;

    if (source.droppableId === LIVE_MODE.CAMERA_LIST_DROPPABLE_ID) {
      const draggableCam = availableList[source.index];
      screen.grids[destination.index] = {
        id: draggableCam.id,
        uuid: draggableCam?.uuid,
        type: 'live',
        name: draggableCam?.name,
      };

      dispatch({
        type: 'live/saveScreen',
        payload: {
          ...screen,
        },
      });
    } else {
      const camObj = screen.grids[source.index];
      screen.grids[source.index] = screen.grids[destination.index];
      screen.grids[destination.index] = camObj;

      dispatch({
        type: 'live/saveScreen',
        payload: {
          ...screen,
        },
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
      type: 'live/saveScreen',
      payload: {
        ...screen,
        mode,
      },
    });
  };

  return (
    <PageContainer
      extra={[
        <Button key="2" icon={<HeartOutlined />}>
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
            <Space size={8} key="space">
              <StyledText id="pages.live-mode.action.favorite" />
              <Select placeholder={<FormattedMessage id="pages.live-mode.action.choose" />} />
              <Button icon={<SaveOutlined />} type="primary">
                <StyledText id="pages.live-mode.action.save" />
              </Button>
            </Space>,
            <ActionGrid key="action" grid={screen.gridType} onChange={changeScreen} />,
          ],
        }}
      >
        <StyledTabs.TabPane key="live" tab={<FormattedMessage id="pages.live-mode.mode.live" />} />
        <StyledTabs.TabPane key="play" tab={<FormattedMessage id="pages.live-mode.mode.review" />}>
          <PlaybackControl />
        </StyledTabs.TabPane>
      </StyledTabs>
      <DragDropContext onDragEnd={onDragEnd}>
        <GridPanel screen={screen} />
        <CameraList
          title={<FormattedMessage id="pages.live-mode.list.camera" />}
          cameras={availableList}
          visible={visibleCameraList}
          onClose={() => setVisibleCameraList(false)}
        />
      </DragDropContext>
    </PageContainer>
  );
};

const mapStateToProps = ({ live }) => {
  const { availableList = [], screen = {} } = live;

  return {
    availableList,
    screen,
  };
};

export default connect(mapStateToProps)(Live);
