import styled from 'styled-components';

export const GridViewTableStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .card-event {
    display: flex;
    width: 49%;
    margin-top: 12px;
    background: #1f2020;
  }

  .card-img {
    width: 40%;

    .imageFile {
      width: 100%;
      height: 100%;
    }
  }

  .card-content {
    width: 60%;

    .event-type {
      margin-bottom: 8px;
      padding: 10px 16px;
      font-weight: 500;
      font-size: 16px;
      border-bottom: 1px solid #2a2c2c;
    }

    .card-info {
      display: flex;
      align-items: center;
      padding: 0px 16px 8px;
    }

    .card-info__icon {
      margin-right: 10px;
    }

    .card-info__value {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;

      border-top: 1px solid #2a2c2c;

      .card-footer-left {
        width: 50%;
        margin: 8px 16px;
        border-right: 1px solid #2a2c2c;
      }

      .card-footer-right {
        width: 50%;
        margin: 8px 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .gridView-pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    margin-top: 16px;
    padding: 10px;
    background: #1f2020;
  }
`;
