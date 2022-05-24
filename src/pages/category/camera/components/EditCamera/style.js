import styled from 'styled-components';
import MSCustomizeDrawer from '@/components/Drawer';
import { Space } from 'antd';
export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
`;
export const StyledSpace = styled(Space)`
  width: 100%;
  align-items: center;
  .ant-space-item {
    &:first-child {
      flex: 1;
      margin-left: 11px;
    }
    &:last-child {
      margin-bottom: 24px;
    }
  }
  .ant-select.ant-select-in-form-item {
    /* width: calc(100% - 12px); */
  }
`;
export const SpaceAddAvatar = styled.div`
  width: 100%;
  display: flex;
  .avatarUser {
    margin-right: 12px;
  }
  .ant-upload-drag {
    min-width: 400px;
    background-color: rgb(0 0 0);
  }
`;
