import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { connect } from 'dva';
import { useIntl } from 'umi';
import CleanSetting from './components/CleanSetting';
import EmailConfig from './components/EmailConfig';
import RecordSetting from './components/RecordSetting';
import WarningStoreSetting from './components/WarningStoreSetting';

const Setting = ({ listRecord, listClean, listDisk, loading, dispatch, allEmails, listEmail }) => {
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
      {!loading && (
        <>
          <RecordSetting list={listRecord} />
          <CleanSetting list={listClean} />
          <WarningStoreSetting list={listDisk} />
          <EmailConfig listAllEmail={allEmails} listEmail={listEmail} />
        </>
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  const { listRecord, listClean, listDisk, listEmail } = state.setting;
  const { list } = state.user;
  const allEmails = list.map((i) => i.email);
  return {
    loading: state.loading.models.setting && state.loading.models.user,
    listRecord,
    listClean,
    listDisk,
    allEmails,
    listEmail,
  };
}

export default connect(mapStateToProps)(Setting);
