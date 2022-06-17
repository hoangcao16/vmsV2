import MSCustomizeDrawer from '@/components/Drawer';
import styled from 'styled-components';

export const MSCustomizeDrawerStyled = styled(MSCustomizeDrawer)`
  .sendTicket-header {
    padding-bottom: 20px;
    font-weight: 700;
    font-size: 16px;
  }

  .ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
    display: none;
  }
`;
