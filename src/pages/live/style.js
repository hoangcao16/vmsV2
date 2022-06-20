import { Tabs } from 'antd';
import styled from 'styled-components';
import { FormattedMessage } from 'umi';

const Text = (props) => (
  <span>
    <FormattedMessage {...props} />
  </span>
);

export const StyledText = styled(Text)``;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
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

export const StyledLive = styled.div`
  display: flex;
  .ant-pro-page-container {
    flex-grow: 1 !important;
  }
`;
