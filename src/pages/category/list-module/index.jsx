import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import TableCamproxy from './components/Camproxy/TableCamproxy';
import TableNVR from './components/NVR/TableNVR';
import TablePlayback from './components/Playback/TablePlayback';
import TableZone from './components/Zone/TableZone';
import { useIntl } from 'umi';
import { TabsStyle } from './style';
import TableHardDrive from './components/HardDrive/TableHardDrive';

const { TabPane } = Tabs;

const ModuleList = () => {
  const intl = useIntl();

  return (
    <PageContainer>
      <TabsStyle defaultActiveKey="hard-drive">
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.user.hard_drive_list',
          })}`}
          key="hard-drive"
        >
          <TableHardDrive />
        </TabPane>
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
      </TabsStyle>
    </PageContainer>
  );
};

export default ModuleList;
