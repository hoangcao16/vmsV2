import styled from 'styled-components';
import MSCustomizeDrawer from '@/components/Drawer';
import ProTable from '@ant-design/pro-table';
export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
  .ant-drawer-body {
    padding: 24px 0;
  }
`;
export const ProTableStyle = styled(ProTable)`
  .ant-pro-table-list-toolbar-title {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
  }

  .ant-pro-table-list-toolbar-extra-line {
    margin-bottom: 42px;
  }

  /* .ant-pro-table-list-toolbar-extra-line {
    max-width: 433px;
  } */
  .ant-table-row {
    cursor: pointer;
  }
  .ant-pagination {
    justify-content: center;
  }
`;
