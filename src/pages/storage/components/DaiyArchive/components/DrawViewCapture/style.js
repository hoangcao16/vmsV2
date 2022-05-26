import styled from 'styled-components';
import MSCustomizeDrawer from '@/components/Drawer';
import { Collapse } from 'antd';

// $vms-status-07: rgba(208, 229, 255, 0.7);
// $vms-bg-sub: #333333;
// $vms-bg-3: #232323;
// $vms-blue: #1380ff;
// $vms-main-blue-primary: #1380ff;

export const MSCustomizeDrawerStyled = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }

  .headerCapture {
    padding: 20px 32px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 700;
  }
  .ant-drawer-body {
    padding: 0px;
  }
`;

export const CollapseStyled = styled(Collapse)`
  .ant-collapse-item {
    border-top: 1px solid #e8e8e8;

    .ant-collapse-header,
    .ant-collapse-content-box {
      padding-left: 24px;
    }
  }

  .detailInfo {
    display: flex;
    align-items: flex-start;

    margin-bottom: 16px;
  }

  .detailInfo-title {
    min-width: 130px;
  }
`;

export const HeaderPanelStyled = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

export const ContainerCapture = styled.div`
  border-top: 1px solid #e8e8e8;
  padding: 24px;
`;
