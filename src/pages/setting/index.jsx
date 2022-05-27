import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { useIntl } from 'umi';
import CleanSetting from './components/CleanSetting';
import EmailConfig from './components/EmailConfig';
import RecordSetting from './components/RecordSetting';
import WarningStoreSetting from './components/WarningStoreSetting';

const Setting = ({ listRecord, listClean, listDisk, loading, dispatch, allEmails, listEmail }) => {
  const intl = useIntl();

  return (
    <PageContainer>
      <>
        <RecordSetting list={listRecord} dispatch={dispatch} loading={loading} />
        <CleanSetting list={listClean} dispatch={dispatch} loading={loading} />
        <WarningStoreSetting list={listDisk} />
        <EmailConfig listAllEmail={allEmails} listEmail={listEmail} />
      </>
    </PageContainer>
  );
};

function mapStateToProps(state) {
  const { listRecord, listClean, listDisk, listEmail } = state.setting;
  const { list } = state.user;
  const allEmails = list.map((i) => i.email);
  return {
    loading: state.loading.models.setting,
    listRecord,
    listClean,
    listDisk,
    allEmails,
    listEmail,
  };
}

export default connect(mapStateToProps)(Setting);
