/* eslint-disable react-hooks/exhaustive-deps */
import { Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { useIntl } from 'umi';
import CameraList from './camera';
import GroupCamera from './groupCamera';
import { StyledTabs } from './style';
import TableCameraCategory from './components/cameraCategory/TableCameraCategory';
import { useState } from 'react';
const CameraDevice = ({}) => {
  const intl = useIntl();
  const [type, setType] = useState('camera');
  return (
    <PageContainer>
      <Tabs defaultActiveKey={type} onChange={(key) => setType(key)}>
        <StyledTabs
          tab={`${intl.formatMessage({
            id: 'camera',
          })}`}
          key="camera"
        >
          <CameraList />
        </StyledTabs>
        <StyledTabs
          tab={`${intl.formatMessage({
            id: 'view.camera.group_camera',
          })}`}
          key="group_camera"
        >
          <GroupCamera />
        </StyledTabs>
        <StyledTabs
          tab={`${intl.formatMessage(
            {
              id: 'view.category.camera_vendor',
            },
            {
              cam: intl.formatMessage({
                id: 'camera',
              }),
            },
          )}`}
          key="camera_vendor"
        >
          <TableCameraCategory type={type} />
        </StyledTabs>
        <StyledTabs
          tab={`${intl.formatMessage(
            {
              id: 'view.camera.camera_type',
            },
            {
              cam: intl.formatMessage({
                id: 'camera',
              }),
            },
          )}`}
          key="camera_type"
        >
          <TableCameraCategory type={type} />
        </StyledTabs>
        <StyledTabs
          tab={`${intl.formatMessage(
            {
              id: 'view.category.tags',
            },
            {
              cam: intl.formatMessage({
                id: 'camera',
              }),
            },
          )}`}
          key="camera_tags"
        >
          <TableCameraCategory type={type} />
        </StyledTabs>
      </Tabs>
    </PageContainer>
  );
};
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(CameraDevice);
