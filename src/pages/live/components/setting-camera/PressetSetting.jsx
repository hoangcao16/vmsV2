import { connect } from 'dva';
import { useEffect } from 'react';
import styled from 'styled-components';
import TablePreset from './TablePreset';
import TablePresetTour from './TablePresetTour';
const TYPE = { CREATE: 1, UPDATE: 2 };
function PressetSetting({ cameraSelected, listPreset, listPresetTour, dispatch }) {


  useEffect(() => {}, []);


  return (
    <LayoutPreset>
      <div className="table-preset">
        <TablePreset />
      </div>
      <div className="table-preset-tour">
        <TablePresetTour />
      </div>
    </LayoutPreset>
  );
}

const LayoutPreset = styled.div`
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
  .table-preset,
  .table-preset-tour {
    width: 45%;
  }
  .control {
    padding-top: 100px;
  }
`;



function mapStateToProps(state) {
  const { cameraSelected, listPreset, listPresetTour } = state.live;

  return {
    cameraSelected,
    listPreset,
    listPresetTour,
  };
}

export default connect(mapStateToProps)(PressetSetting);
