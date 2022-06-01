import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: 0px 10px;
  .sendTicket-header {
    font-size: 24px;
    text-align: center;
  }

  .sendTicket-containerBtn {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 10px;
  }

  .sendTicket-btnCancel {
    margin-left: 8px;
  }

  .ant-form-item-label
    > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
    display: none;
  }
`;
