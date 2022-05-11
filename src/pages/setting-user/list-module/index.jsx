import { GridContent, PageContainer } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { useState } from 'react';
import TableNVR from './components/nvr/TableNVR';
import TablePlayback from './components/playback/TablePlayback';
import TableZone from './components/zone/TableZone';
import styles from './style.less';

const { Item } = Menu;

const ModuleList = () => {
  const menuModule = {
    nvr: 'NVR',
    playback: 'Playback',
    zone: 'Zone',
    camproxy: 'Camproxy',
  };

  const [selectModule, setSelectModule] = useState('nvr');
  const renderModule = () => {
    switch (selectModule) {
      case 'nvr':
        return <TableNVR />;

      case 'playback':
        return <TablePlayback />;

      case 'zone':
        return <TableZone />;

      case 'camproxy':
        return;

      default:
        return null;
    }
  };

  const getMenu = () => {
    return Object.keys(menuModule).map((item) => <Item key={item}>{menuModule[item]}</Item>);
  };

  return (
    <PageContainer>
      <GridContent>
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu
              mode="inline"
              selectedKeys={selectModule}
              onClick={({ key }) => {
                setSelectModule(key);
              }}
            >
              {getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>{renderModule()}</div>
        </div>
      </GridContent>
    </PageContainer>
  );
};

export default ModuleList;
