import styled from 'styled-components';
import MSCustomizeDrawer from '@/components/Drawer';
export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }
  .ant-drawer-header-title {
    flex: none;
  }
  .ant-drawer-body {
    height: 100%;
    /* overflow: hidden; */
    video {
      height: calc(100vh - 80px) !important;
      margin-top: 20px;
      /* object-fit: cover; */
    }
  }
  .ant-spin-nested-loading {
    height: calc(100vh - 80px) !important;
    overflow: hidden;
    .ant-spin-spinning {
      max-height: unset;
    }
  }
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  height: 30px;
  .close-icon {
    margin-right: 10px;
  }
  .title {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
  }
  .select-ant {
    min-width: 300px;
    margin-left: 1rem;
  }
`;
