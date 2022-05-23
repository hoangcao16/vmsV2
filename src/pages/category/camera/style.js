import styled from 'styled-components';
import ProTable from '@ant-design/pro-table';
import { Tabs, Tree, Row } from 'antd';
import MSCustomizeDrawer from '@/components/Drawer';
const { TabPane } = Tabs;

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
  .search-camera-category {
    width: 360px;
  }
`;
export const SpanCode = styled.span`
  color: #1890ff;
`;
export const ContainerFilterDailyArchive = styled.div`
  width: 100%;
  padding-top: 16px;

  .collapse-filter {
    display: flex;
    align-items: center;

    .ant-row.ant-form-item {
      width: 400px;
      margin-bottom: 0px;
    }
  }

  .extra-filter {
    padding-top: 16px;
  }
`;
export const StyledTabs = styled(TabPane)`
  background-color: #fff;
`;
export const GroupCameraContainer = styled(Row)`
  padding: 2rem;
`;
export const TreeStyle = styled(Tree)`
  .ant-tree-treenode {
    width: 100%;
    .ant-tree-switcher {
      display: flex;
      align-items: center;
    }
    .ant-tree-node-content-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      .ant-tree-title {
        flex: 1;
      }
    }
  }
`;
export const TreeNodeStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  &[data-type='parent'] {
    height: 56px;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 1) !important;
  }
  .parent {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
  .actionsGroup {
    .middle-btn {
      margin: 0 8px;
    }
  }
`;
export const CameraGroupSearch = styled.div`
  display: flex;
  margin-bottom: 40px;
  .btnAddUser {
    margin-left: 12px;
  }
`;

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
