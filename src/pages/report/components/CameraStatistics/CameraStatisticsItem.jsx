import { Card } from 'antd';
import styled from 'styled-components';
import { useIntl } from 'umi';

const CustomCard = styled(Card)`
  &.ant-card {
    color: white;
    background-color: ${(prop) => prop?.bgColor};
    border-radius: 10px;
  }
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
    <CustomCard bgColor={props?.color}>
      <CardTitle>
        {intl.formatMessage({
          id: `pages.report.cameraStatistics.${props.cameraName}`,
        })}
      </CardTitle>
      <CardInfo>{props.totalCamera}</CardInfo>
    </CustomCard>
  );
}
