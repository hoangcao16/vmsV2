import { notify } from '@/components/Notify';
import bookmarkService from '@/services/bookmark';
import { HeartOutlined, OrderedListOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect, FormattedMessage } from 'umi';
import { useDispatch } from 'react-redux';

import ActionGrid from './components/ActionGrid';
import CameraList from './components/CameraList';
import GridPanel from './components/GridPanel';
import { StyledTabs, StyledText } from './style';
import { GRID1X1, GRID2X2, GRID3X3, GRID4X4 } from '@/constants/grid';
import { LIVE_MODE } from '@/constants/common';

const Live = ({ availableList, screen }) => {
  const [visibleCameraList, setVisibleCameraList] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDefaultScreen();
  }, []);

  const fetchDefaultScreen = async () => {
    const { payload } = await bookmarkService.getDefault();
    initScreen(payload[0] || undefined);
  };

  const initScreen = (screen) => {
    if (screen) {
      const { cameraUuids = [], gridType, viewTypes = [] } = screen;

      const grids = cameraUuids.map((uuid, index) => ({
        uuid,
        type: viewTypes[index],
      }));

      dispatch({
        type: 'live/saveScreen',
        payload: {
          grids: grids,
          gridType: screen.gridType,
        },
      });
    } else {
      dispatch({
        type: 'live/saveScreen',
        payload: {
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
      uuid: '',
      type: '',
    }));
  };

  const onDragEnd = ({ destination, source }) => {
    if (!destination || !source) return;

    if (source.droppableId === LIVE_MODE.CAMERA_LIST_DROPPABLE_ID) {
      const draggableCam = availableList[source.index];
      screen.grids[destination.index] = {
        uuid: draggableCam?.uuid,
        type: 'live',
      };
      const newAvailableList = availableList.filter((_, index) => index !== source.index);

      dispatch({
        type: 'live/saveScreen',
        payload: {
          ...screen,
        },
      });

      dispatch({
        type: 'live/saveAvailableList',
        payload: newAvailableList,
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
        tabBarExtraContent={{
          right: [
            <Space size={8}>
              <StyledText id="pages.live-mode.action.favorite" />
              <Select placeholder={<FormattedMessage id="pages.live-mode.action.choose" />} />
              <Button icon={<SaveOutlined />} type="primary">
                <StyledText id="pages.live-mode.action.save" />
              </Button>
            </Space>,
            <ActionGrid grid={screen.gridType} onChange={changeScreen} />,
          ],
        }}
      >
        <StyledTabs.TabPane key={1} tab={<FormattedMessage id="pages.live-mode.mode.live" />} />
        <StyledTabs.TabPane key={2} tab={<FormattedMessage id="pages.live-mode.mode.review" />} />
      </StyledTabs>
      <DragDropContext onDragEnd={onDragEnd}>
        <GridPanel screen={screen} />
        <CameraList
          cameras={availableList}
          visible={visibleCameraList}
          onCancel={() => setVisibleCameraList(false)}
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
