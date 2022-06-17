/* eslint-disable react-hooks/exhaustive-deps */
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { useState } from 'react';
import { useIntl } from 'umi';
import CameraList from './camera';
import TableTags from './components/cameraCategory/TableTags';
import TableType from './components/cameraCategory/TableType';
import TableVendor from './components/cameraCategory/TableVendor';
import GroupCamera from './groupCamera';
import { StyledTabs, TabsStyle } from './style';
const CameraDevice = () => {
  const intl = useIntl();
  const [type, setType] = useState('camera');
  return (
    <PageContainer>
      <TabsStyle defaultActiveKey={type} onChange={(key) => setType(key)}>
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
          <TableVendor type={type} />
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
          <TableType type={type} />
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
          <TableTags type={type} />
        </StyledTabs>
      </TabsStyle>
    </PageContainer>
  );
};
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(CameraDevice);
