import { Card } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';

const CustomCard = styled(Card)`
  color: white !important;
  border-radius: 10px !important;
  background-color: ${(prop) => prop?.backgroundColor} !important;
`;

const CardTitle = styled.div`
  font-size: 12px;
`;

const CardInfo = styled.div`
  font-weight: 600;
  font-size: 30px;
  font-family: 'Roboto';
`;

export default function CameraStatisticsItem(props) {
  const intl = useIntl();
  return (
    <CustomCard backgroundColor={props?.color}>
      <CardTitle>
        {intl.formatMessage({
          id: `pages.report.cameraStatistics.${props.cameraName}`,
        })}
      </CardTitle>
      <CardInfo>{props.totalCamera}</CardInfo>
    </CustomCard>
  );
}
