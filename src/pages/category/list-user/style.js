import MSCustomizeDrawer from '@/components/Drawer';
import styled from 'styled-components';

export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
`;

export const CellCreateTime = styled.div`
  color: #177ddc !important;
`;

export const ContainerFilter = styled.div`
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
