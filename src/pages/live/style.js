import { Button, Tabs, Tag } from 'antd';
import styled from 'styled-components';
import { FormattedMessage } from 'umi';

import MSCustomizeDrawer from '@/components/Drawer';

export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
  .ant-drawer-body {
    width: 100%;
    padding-top: 15px;
  }
`;

const Text = (props) => (
  <span>
    <FormattedMessage {...props} />
  </span>
);

export const StyledText = styled(Text)``;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    position: relative;
    padding: 16px;
    background-color: #1f1f1f;
  }

  .ant-tabs-tab-btn {
    font-size: 16px;
  }

  .ant-tabs-nav-wrap {
    flex: 1;
  }
  .ant-tabs-extra-content {
    display: flex;
    flex: 2;
    flex-flow: row;
    justify-content: end;
  }
`;

export const StyledTag = styled(Tag)`
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
  border-radius: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 5px 16px;
  .anticon svg {
    font-size: 14px;
  }
  span {
    font-size: 14px;
  }
`;
