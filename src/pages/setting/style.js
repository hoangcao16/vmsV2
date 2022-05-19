import { Card } from 'antd';
import styled from 'styled-components';

export const StyledCard = styled(Card)`
  border: 0;
  margin-bottom: 24px;

  p {
    margin-bottom: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
  }

  .icon {
    display: flex;
    align-items: center;

    .anticon svg {
      font-size: 2.2rem;
    }
  }

  .title {
    h4 {
      margin-bottom: 2px;
    }

    p {
      color: rgba(255, 255, 255, 0.45);
    }
  }

  .setting-clean {
    .ant-select-selector {
      border-radius: 0 2px 2px 0;
    }
    .ant-input {
      border-right: 0;
      border-radius: 2px 0 0 2px;
    }
    .ant-checkbox-wrapper {
      margin-top: 34px;
    }
  }

  .ant-card-body {
    .ant-select {
      width: 100%;
    }

    p {
      color: rgba(255, 255, 255, 0.85);
    }

    .label {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
  }
`;
