import styled from 'styled-components';
import MSCustomizeDrawer from '@/components/Drawer';
export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }
  .ant-drawer-header-title {
    flex: none;
  }
  .ant-form {
    .ant-row {
      .ant-col-3 {
        display: flex;
        align-items: flex-end;
      }
    }
  }
  .plusIcon {
    color: #1890ff;
    font-size: 20px;
  }
`;
