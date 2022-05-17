import MSCustomizeDrawer from '@/components/Drawer';
import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';

export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
  .ant-drawer-body {
    padding: 0;
  }
  .ant-card-bordered {
    border: 0;
  }
`;

export const ProTableStyle = styled(ProTable)`
  .ant-pro-table-list-toolbar-title {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }
  .ant-table-row {
    cursor: pointer;
  }
`;
