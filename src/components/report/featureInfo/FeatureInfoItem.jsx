import React from 'react';
import { Card } from 'antd';
import './FeatureInfoItem.less';
import { useIntl } from 'umi';

export default function FeatureInfoItem(props) {
  const intl = useIntl();
  return (
    <Card className={`card ${props?.color}`}>
      <div className="card--title">
        {intl.formatMessage({
          id: `pages.report.featureInfo.${props.cameraName}`,
          defaultMessage: 'name',
        })}
      </div>
      <div className="card--info">{props.totalCamera}</div>
    </Card>
  );
}
