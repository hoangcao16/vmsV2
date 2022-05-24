import styled from 'styled-components';

export const MapContainer = styled.div`
  height: calc(100vh - 140px);
  position: relative;
  #map {
    height: calc(100vh - 140px);
  }
  .ant-drawer {
    position: absolute;
  }
`;
export const MapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  .map-header-left {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }
  .map-header-right {
    .middle-button {
      margin: 0 8px;
    }
  }
`;
