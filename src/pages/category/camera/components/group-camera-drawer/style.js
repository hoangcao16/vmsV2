import MSCustomizeDrawer from '@/components/Drawer';
import styled from 'styled-components';
export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
`;
