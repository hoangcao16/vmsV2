import { Col, Upload } from 'antd';
import styled from 'styled-components';
const { Dragger } = Upload;

export const StyledDragger = styled(Dragger)
`
  height: 100px !important;
  img.avatar__image {
    max-height: 100px;
    object-fit: cover;
  }
  .ant-upload.ant-upload-btn {
    padding: 0 !important;
  }
`;

export const StyledPhone = styled(Col)
`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
`;