/* eslint-disable react-hooks/exhaustive-deps */
import { Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { useIntl } from 'umi';
import CameraList from './camera';
import GroupCamera from './groupCamera';
import { StyledTabs } from './style';
const CameraDevice = ({}) => {
  const intl = useIntl();
  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <StyledTabs
          tab={`${intl.formatMessage({
            id: 'camera',
          })}`}
          key="nvr"
        >
          <CameraList />
        </StyledTabs>
        <StyledTabs
          tab={`${intl.formatMessage({
            id: 'view.camera.group_camera',
          })}`}
          key="playback"
        >
          <GroupCamera />
        </StyledTabs>
      </Tabs>
    </PageContainer>
  );
};
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(CameraDevice);
