import MSCustomizeDrawer from '@/components/Drawer';
import styled from 'styled-components';

export const MSCustomizeDrawerStyled = styled(MSCustomizeDrawer)`
  .infoTicket {
    & table {
      width: 100%;
    }

    & tr {
      display: block;
      width: 100%;
      margin-bottom: 16px;
    }
    padding: 24px;
    background: #111111;
  }

  .infoTicket-label {
    width: 170px;
  }

  .fine {
    display: none;
  }

  .imageViolate {
    margin-top: 24px;
  }

  .imageViolate-img {
    width: 100%;
    /* max-width: 200px; */
    height: 130px;
  }

  .container-btnTicket {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40px;
  }

  .btnTicket {
    margin: 0px 4px;
  }
`;

export const WrapperPrint = styled.div`
  .displayOnPrint-img,
  .displayOnPrint {
    display: none !important;
  }

  @media print {
    height: 100%;
    padding: 24px;
    color: #000;

    font-size: 16px;
    background-color: #fff;

    table tr {
      display: block;
      margin-bottom: 16px;
    }

    .displayOnPrint {
      display: flex !important;
      flex-direction: column;
      align-items: center;
    }
    .displayOnPrint-img {
      display: flex !important;
      align-items: start;
    }

    .displayOnPrint-header {
      font-weight: bold;
      font-size: 28px;
    }

    .infoTicket-label {
      width: 200px;
      font-weight: bold;
    }

    .imageViolate-img {
      max-width: 200px;
      height: 130px;
    }

    .hideOnPrint {
      display: none;
    }
  }
`;

export const StyledInput = styled.input`
  @media screen {
    max-width: 140px;
    color: #d0e5ff;
    letter-spacing: 2px;
    background: transparent;
    border: none;
    outline: none;
  }
  @media print {
    display: none;
  }

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;
