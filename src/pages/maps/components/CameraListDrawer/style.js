import styled from 'styled-components';
import MSCustomizeDrawer from '@/components/Drawer';
import { EditableProTable } from '@ant-design/pro-table';

export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
  .ant-drawer-body {
    padding: 0 0 24px 0;
  }
`;
export const ProTableStyle = styled(EditableProTable)`
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
  .ant-table-cell {
    .ant-badge-status {
      display: flex;
      align-items: center;
      &-text {
        flex: 1;
      }
    }
  }
`;
export const TableRowStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .camera-name {
    max-width: 80%;
    overflow: hidden;
    /* white-space: nowrap; */
    text-overflow: ellipsis;
  }
`;
export const StyledTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  padding: 0 24px;
  margin-bottom: 8px;
`;
export const StyledSearch = styled.div`
  display: flex;
  padding: 0 24px;
  margin-bottom: 8px;
  .ant-input-search {
    margin-right: 10px;
  }
`;
export const StyledFilter = styled.div`
  padding: 0 24px;
  .ant-form-item {
    margin-bottom: 4px;
  }
`;
