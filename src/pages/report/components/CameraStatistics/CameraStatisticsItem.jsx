import React from 'react';
import { Card } from 'antd';
import './CameraStatisticsItem.less';
import { useIntl } from 'umi';

export default function CameraStatisticsItem(props) {
  const intl = useIntl();
  return (
    <div className="cameraStatisticsItem">
      <Card className={`card ${props?.color}`}>
        <div className="card--title">
          {intl.formatMessage({
            id: `pages.report.cameraStatistics.${props.cameraName}`,
          })}
        </div>
        <div className="card--info">{props.totalCamera}</div>
      </Card>
    </div>
  );
}
