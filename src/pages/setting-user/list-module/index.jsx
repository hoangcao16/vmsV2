import { Tabs } from 'antd';
import TableCamproxy from './components/camproxy/TableCamproxy';
import TableNVR from './components/nvr/TableNVR';
import TablePlayback from './components/playback/TablePlayback';
import TableZone from './components/zone/TableZone';

const { TabPane } = Tabs;

const ModuleList = () => {
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Danh sách NVR" key="nvr">
          <TableNVR />
        </TabPane>
        <TabPane tab="Danh sách Playback" key="playback">
          <TablePlayback />
        </TabPane>
        <TabPane tab="Danh sách Zone" key="zone">
          <TableZone />
        </TabPane>
        <TabPane tab="Danh sách Camproxy" key="camproxy">
          <TableCamproxy />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ModuleList;
