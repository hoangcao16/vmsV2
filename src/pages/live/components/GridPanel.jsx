import { GRID1X1, GRID2X2, GRID3X3, GRID4X4 } from '@/constants/grid';
import { useEffect, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { connect } from 'umi';
import CameraSlot from './CameraSlot';

const GridPanel = ({ dispatch, selectedCamera, mode, grids, gridType }) => {
  const [layoutGrid, setLayoutGrid] = useState([]);
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
  useEffect(() => {
    if (gridType) {
      initEmptyGrid(getGrid(gridType));
    }
  }, [gridType]);
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
  const initEmptyGrid = (number) => {
    return setLayoutGrid(
      Array.from(new Array(number)).map((_, index) => ({
        id: '',
        uuid: '',
        name: '',
      })),
    );
  };
  return (
    <StyledGrid>
      {layoutGrid.map((camera, index) => (
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
                  draggableId={`draggable-${index}`}
                  index={index}
                  disableInteractiveElementBlocking
                >
                  {(provided, snapshot) => (
                    <GridItemContent
                      ref={provided.innerRef}
                      data-type={
                        selectedCamera?.data?.uuid === grids[index]?.uuid &&
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
                        camera={grids[index]}
                        slotIndex={index}
                      />
                      {/* )} */}
                    </GridItemContent>
                  )}
                </Draggable>
              </GridItemWrapper>
            </GridItem>
          )}
        </Droppable>
      ))}
    </StyledGrid>
  );
};

const StyledGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
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
const mapStateToProps = (state) => {
  return {
    selectedCamera: state?.playMode?.selectedCamera,
  };
};
export default connect(mapStateToProps)(GridPanel);
