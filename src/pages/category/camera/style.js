import styled from 'styled-components';
import ProTable from '@ant-design/pro-table';

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
