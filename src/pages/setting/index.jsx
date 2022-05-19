import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import CleanSetting from './components/CleanSetting';
import RecordSetting from './components/RecordSetting';
import WarningStoreSetting from './components/WarningStoreSetting';

const Setting = () => {
  const intl = useIntl();

  return (
    <PageContainer
      header={{
        extra: [
          <Button key="close">
            <CloseOutlined />
            {intl.formatMessage({ id: 'view.map.cancel' })}
          </Button>,
          <Button type="primary" key="save">
            <SaveOutlined />
            {intl.formatMessage({ id: 'view.map.button_save' })}
          </Button>,
        ],
      }}
    >
      <RecordSetting />
      <CleanSetting />
      <WarningStoreSetting />
    </PageContainer>
  );
};

export default Setting;
