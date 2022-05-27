import styled from 'styled-components';

export const TimeoutChart = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
  padding: ${(prop) => prop.paddingY || 128}px 32px;
  background-color: #1f1f1f;
`;

export const ChartBackground = styled.div`
  margin-bottom: 24px;
  padding: 20px 12px;
  background-color: #1f1f1f;
`;
