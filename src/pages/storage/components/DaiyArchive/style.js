import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';

export const CellCreateTime = styled.div`
  color: #177ddc !important;
`;

export const ContainerFilterDailyArchive = styled.div`
  margin-bottom: 2px;
  width: 100%;

  .collapse-filter {
    display: flex;
    align-items: center;

    padding: 16px 24px;
    background: #1f2020;

    .ant-row.ant-form-item {
      width: 400px;
      margin-bottom: 0px;
    }
  }

  .extra-filter {
    margin-top: 2px;
    padding: 16px 24px;
    background: #1f2020;
  }
`;

export const ProTableStyled = styled(ProTable)`
  .ant-table-container {
    padding-top: 16px;
  }
  .ant-table-row {
    cursor: pointer;
  }
`;
