import { Popconfirm, Upload } from 'antd';
import styled from 'styled-components';
const { Dragger } = Upload;

export const StyledDragger = styled(Dragger)`
  img.avatar__image {
    height: 100px;
    object-fit: cover;
  }
`;

export const StyledPopconfirm = styled(Popconfirm)`
  .ant-popover-inner-content {
    min-width: 218px;
  }
`;
