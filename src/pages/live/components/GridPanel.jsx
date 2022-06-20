import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { connect } from 'umi';
import CameraSlot from './CameraSlot';

const GridPanel = ({ screen, dispatch, selectedCamera }) => {
  const handleSelectCamera = (index) => {
    if (screen?.mode === 'play') {
      if (
        selectedCamera?.data?.uuid === screen?.grids[index]?.uuid &&
        selectedCamera?.index === index
      ) {
        dispatch({
          type: 'playMode/saveSelectedCamera',
          payload: null,
        });
      } else {
        dispatch({
          type: 'playMode/saveSelectedCamera',
          payload: {
            index: index,
            data: screen?.grids[index],
          },
        });
      }
      dispatch({
        type: 'playMode/saveIsPlay',
        payload: false,
      });
    }
  };
  return (
    <StyledGrid>
      {screen.grids.map((camera, index) => (
        <Droppable droppableId={`droppabled-${index}`} key={index}>
          {(dropProvided, dropSnapshot) => (
            <GridItem
              grid={screen.grids}
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
                      {camera?.uuid && (
                        <CameraSlot
                          isDraggingOver={dropSnapshot.isDraggingOver}
                          camera={camera}
                          slotIndex={index}
                        />
                      )}
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
  flex: 1 1 ${(props) => 100 / Math.sqrt(props.grid.length)}%;
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
