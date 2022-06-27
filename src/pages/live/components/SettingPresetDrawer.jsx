import {
  CloseOutlined,
  FullscreenOutlined,
  SaveOutlined,
  SettingOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Button, Divider, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import PressetView from './setting-camera/PressetView';
import TabsContentRender from './setting-camera/TabsContentRender';
import { StyledDrawer } from '../style';
import { connect } from 'dva';
import PressetSetting from './setting-camera/PressetSetting';

export const TABS = {
  SETTING: '1',
  CHANGE_PRESET: '2',
  CONTROL: '3',
};

function SettingPresetDrawer({ showPresetSetting, onCloseDrawer, cameraSelected }) {
  const [tabActive, setTabActive] = useState(TABS.SETTING);
  const intl = useIntl();

  const onChange = (key) => {
    setTabActive(key);
  };

  return (
    <StyledDrawer
      openDrawer={showPresetSetting}
      onClose={onCloseDrawer}
      width={'100%'}
      zIndex={1001}
      placement="right"
      // extra={
      //   <Space>
      //     <Button
      //       type="primary"
      //       htmlType="submit"
      //       onClick={() => {
      //         // form.submit();
      //       }}
      //     >
      //       <SaveOutlined />
      //       {intl.formatMessage({ id: 'view.map.button_save' })}
      //     </Button>

      //     <Button onClick={onCloseDrawer}>
      //       <CloseOutlined />
      //       {intl.formatMessage({ id: 'view.map.cancel' })}
      //     </Button>
      //   </Space>
      // }
    >
      <h3> {intl.formatMessage({ id: 'pages.live-mode.list.setting-camera' })}</h3>
      <h4>{cameraSelected?.name}</h4>
      <StyledDivider />
      <StyledTabs tabPosition="left" onChange={onChange} defaultActiveKey={TABS.SETTING}>
        <TabPane
          tab={
            <>
              <TabsContentRender
                icon={<SettingOutlined style={{ fontSize: '25px' }} />}
                title="Cài đặt preset"
                description="Chọn và cài đặt Preset để xem Camera"
              />
            </>
          }
          key={TABS.SETTING}
        >
          <PressetView tabActive={tabActive} />
        </TabPane>
        <TabPane
          tab={
            <>
              <TabsContentRender
                icon={<SwapOutlined style={{ fontSize: '25px' }} />}
                title="Quản lí preset, preset tour"
                description="Chuyển từ Preset qua Preset tour"
              />
            </>
          }
          key={TABS.CHANGE_PRESET}
        >
          <PressetSetting />
        </TabPane>
        <TabPane
          tab={
            <>
              <TabsContentRender
                icon={<FullscreenOutlined style={{ fontSize: '25px' }} />}
                title="Bảng điểu khiển"
                description="Điều chỉnh góc quay Camera"
              />
            </>
          }
          key={TABS.CONTROL}
        >
          <PressetView tabActive={tabActive} />
        </TabPane>
      </StyledTabs>
    </StyledDrawer>
  );
}

function mapStateToProps(state) {
  const { cameraSelected } = state.live;

  return {
    cameraSelected,
  };
}

export default connect(mapStateToProps)(SettingPresetDrawer);

const StyledDivider = styled(Divider)`
  margin-bottom: 0px;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    width: 25%;
    .ant-tabs-tab {
      padding: 20px 0 0 0;
    }
  }
`;