import { GRID1X1, GRID2X2, GRID3X3, GRID4X4 } from '@/constants/grid';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { connect } from 'umi';
import CameraSlot from './CameraSlot';
import { useEffect, useState } from 'react';
import { BsArrowsFullscreen, BsFullscreenExit } from 'react-icons/bs';
const GridPanel = ({
  layoutGrid,
  dispatch,
  selectedCamera,
  mode,
  grids,
  gridType,
  isFullScreen,
}) => {
  const handleSelectCamera = (index) => {
    if (mode === 'play') {
      if (selectedCamera?.data?.uuid === grids[index]?.uuid && selectedCamera?.index === index) {
        dispatch({
          type: 'playMode/saveSelectedCamera',
          payload: null,
        });
      } else {
        dispatch({
          type: 'playMode/saveSelectedCamera',
          payload: {
            index: index,
            data: grids[index],
          },
        });
      }
      dispatch({
        type: 'playMode/saveIsPlay',
        payload: false,
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
  useEffect(() => {
    if (isFullScreen === true) {
      const zoom = document.getElementById('ZoomCam');
      document.body.appendChild(zoom);
      zoom.style.width = '100%';
      zoom.style.position = 'fixed';
      zoom.style.top = '0';
      zoom.style.left = '0';
      zoom.style.bottom = '0';
      zoom.style.right = '0';
      zoom.style.zIndex = '9999';
    } else {
      const closeZoom = document.getElementById('closeZoomCam');
      closeZoom && closeZoom.appendChild(document.getElementById('ZoomCam'));
    }
  }, [isFullScreen]);
  const handleChangeFullScreen = () => {
    dispatch({
      type: 'globalstore/saveIsFullScreen',
      payload: !isFullScreen,
    });
  };
  return (
    <>
      <StyledGrid>
        {layoutGrid.map((camera, index) => {
          return (
            <Droppable droppableId={`droppabled-${index}`} key={index}>
              {(dropProvided, dropSnapshot) => (
                <GridItem
                  grid={getGrid(gridType)}
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  onClick={() => handleSelectCamera(index)}
                >
                  <GridItemWrapper isDraggingOver={dropSnapshot.isDraggingOver}>
                    <Draggable
                      key={`draggable-${index}`}
                      id={`draggable-map-${index}`}
                      draggableId={`draggable-${index}`}
                      index={index}
                      disableInteractiveElementBlocking
                    >
                      {(provided, snapshot) => (
                        <GridItemContent
                          ref={provided.innerRef}
                          data-type={
                            selectedCamera?.data?.uuid === camera?.uuid &&
                            selectedCamera?.index === index
                              ? 'selected'
                              : ''
                          }
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={provided.draggableProps.style}
                          isDragging={snapshot.draggingOver}
                        >
                          {/* {grids[index]?.uuid && ( */}
                          <CameraSlot
                            isDraggingOver={dropSnapshot.isDraggingOver}
                            camera={camera}
                            slotIndex={camera?.slot}
                            uuid={camera?.uuid}
                          />
                          {/* )} */}
                        </GridItemContent>
                      )}
                    </Draggable>
                  </GridItemWrapper>
                </GridItem>
              )}
            </Droppable>
          );
        })}
      </StyledGrid>

      {/* <StyledButtonFullScreen onClick={handleChangeFullScreen}>
          {!isFullScreen ? <BsArrowsFullscreen /> : <BsFullscreenExit />}
        </StyledButtonFullScreen> */}
    </>
  );
};

const StyledGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  height: 100vh;
`;

const GridItem = styled.div`
  flex: 1 1 ${(props) => 100 / Math.sqrt(props.grid)}%;
  border: 2px solid #1f1f1f;
`;

const GridItemWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background-color: ${(prop) => (prop.isDraggingOver ? '#222' : '#ccc')};
`;

const GridItemContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: ${(prop) => (prop.isDragging ? '#ffff64' : '')};
  &[data-type='selected'] {
    border: 2px solid #bee71c;
  }
`;
// export const StyledButtonFullScreen = styled(Button)`
//   position: fixed;
//   bottom: 0;
//   margin-bottom: 20px;
//   padding: 5px 10px;
//   z-index: 1500;
//   margin-left: 20px;
// `;
const mapStateToProps = (state) => {
  return {
    selectedCamera: state?.playMode?.selectedCamera,
    isFullScreen: state?.globalstore?.isFullScreen,
  };
};
export default connect(mapStateToProps)(GridPanel);
