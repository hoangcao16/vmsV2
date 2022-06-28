import { FullscreenOutlined, SettingOutlined, SwapOutlined } from '@ant-design/icons';
import TabPane from '@ant-design/pro-card/lib/components/TabPane';
import { Divider, Tabs } from 'antd';
import { connect } from 'dva';
import { useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import { StyledDrawer } from '../style';
import PressetSetting from './setting-camera/PressetSetting';
import PressetView from './setting-camera/PressetView';
import TabsContentRender from './setting-camera/TabsContentRender';

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
                title={intl.formatMessage({ id: 'view.live.preset_setting' })}
                description={intl.formatMessage({
                  id: 'pages.live-mode.noti.choose-camera-to-preset',
                })}
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
                title={intl.formatMessage({ id: 'pages.live-mode.noti.manage-preset-presetour' })}

               
                description={intl.formatMessage({ id: 'pages.live-mode.noti.manage-preset-presetour-description' })}
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
                title={intl.formatMessage({ id: 'pages.live-mode.noti.control-panel' })}

                
                description={intl.formatMessage({ id: 'pages.live-mode.noti.control-panel-description' })}

                
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
    .ant-tabs-tab.ant-tabs-tab-active {
      /* background-color: red; */
    }
  }
`;
