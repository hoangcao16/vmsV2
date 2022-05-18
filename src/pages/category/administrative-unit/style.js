import MSCustomizeDrawer from '@/components/Drawer';
import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';

export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
  .ant-drawer-body {
    width: 100%;
    padding: 0;
  }
  .ant-card-bordered {
    border: 0;
  }

  .custom_wrapper {
    padding-bottom: 4px;
    .custom_required_feild_red {
      color: #ff4d4f;
    }
  }
  .PhoneInput {
    .PhoneInputInput {
      padding: 4px 11px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;

      &:hover {
        border-color: #40a9ff;
      }
    }
    &--focus {
      .PhoneInputInput {
        border-color: #40a9ff;
        outline: 0;
      }
    }
  }
`;

export const ProTableStyle = styled(ProTable)`
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
