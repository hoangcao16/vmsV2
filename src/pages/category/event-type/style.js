import MSCustomizeDrawer from '@/components/Drawer';
import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';

export const ProTableStyle = styled(ProTable)
`
  .ant-pro-table-list-toolbar-title {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }
  .ant-table-row {
    cursor: pointer;
  }

  .ant-input-search {
    width: 360px !important;
  }
  .ant-pro-table-list-toolbar-extra-line {
    max-width: 433px;
  }
  .ant-select-auto-complete {
    width: 100%;
  }
`;

export const StyledDrawer = styled(MSCustomizeDrawer)
`
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