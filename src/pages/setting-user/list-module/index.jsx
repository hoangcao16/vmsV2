import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import TableCamproxy from './components/camproxy/TableCamproxy';
import TableNVR from './components/nvr/TableNVR';
import TablePlayback from './components/playback/TablePlayback';
import TableZone from './components/zone/TableZone';
import { useIntl } from 'umi';

const { TabPane } = Tabs;

const ModuleList = () => {
  const intl = useIntl();

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.common_device.nvr_list',
          })}`}
          key="nvr"
        >
          <TableNVR />
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.common_device.playback_list',
          })}`}
          key="playback"
        >
          <TablePlayback />
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.common_device.zone_list',
          })}`}
          key="zone"
        >
          <TableZone />
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.common_device.camproxy_list',
          })}`}
          key="camproxy"
        >
          <TableCamproxy />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default ModuleList;
