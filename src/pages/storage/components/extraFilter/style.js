import styled from 'styled-components';

export const ContainerExtraFilter = styled.div`
  width: 100%;
  margin-bottom: 2px;

  .collapse-filter {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 16px 24px;
    background: #1f2020;
  }

  .collapse-filter__left {
    display: flex;
    align-items: center;

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

  .btn-viewType {
    border: none;
  }
`;
