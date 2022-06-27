import { Spin } from 'antd';
import styled from 'styled-components';

// Return value should be component
const CustomLoading = () => <StyledSpin size="large" />;

const StyledSpin = styled(Spin)`
  margin-top: 25%;
  margin-left: 50%;
  transform: translate(-50%, -50%);
`;

export default CustomLoading;
