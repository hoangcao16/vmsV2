import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useIntl } from 'umi';
import Captured from './components/Captured';
import TableDailyArchive from './components/DaiyArchive/TableDailyArchive';
import EventFiles from './components/EventFiles';
import EventAI from './components/EventAI';
import ExtraFilter from './components/extraFilter';
import {
  CAPTURED_NAMESPACE,
  DAILY_ARCHIVE_NAMESPACE,
  EVENT_AI_NAMESPACE,
  EVENT_FILES_NAMESPACE,
  IMPORTANT_NAMESPACE,
} from './constants';

const { TabPane } = Tabs;

function Storage({ dispatch }) {
  const intl = useIntl();
  const [nameSpace, setNameSpace] = useState(DAILY_ARCHIVE_NAMESPACE);

  const init = (activeKey) => {
    if (!activeKey) {
      return null;
    }

    if (activeKey === EVENT_FILES_NAMESPACE) {
      dispatch({
        type: `${activeKey}/fetchAll`,
        payload: {
          page: 1,
          size: 10,
          eventUuid: 'notnull',
        },
      });
      return;
    }

    dispatch({
      type: `${activeKey}/fetchAll`,
      payload: {
        page: 1,
        size: 10,
      },
    });
  };

  const onChange = (activeKey) => {
    init(activeKey);
    setNameSpace(activeKey);
  };

  useEffect(() => {
    init(nameSpace);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Tabs defaultActiveKey={nameSpace} onChange={onChange}>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.daily_archive_files_list',
          })}`}
          key={DAILY_ARCHIVE_NAMESPACE}
        >
          <ExtraFilter nameSpace={DAILY_ARCHIVE_NAMESPACE} />
          <TableDailyArchive />
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.captured_files_list',
          })}`}
          key={CAPTURED_NAMESPACE}
        >
          <ExtraFilter nameSpace={CAPTURED_NAMESPACE} />
          <Captured />
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.event_files_list',
          })}`}
          key={EVENT_FILES_NAMESPACE}
        >
          <ExtraFilter nameSpace={EVENT_FILES_NAMESPACE} />
          <EventFiles />
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.important_files_list',
          })}`}
          key={IMPORTANT_NAMESPACE}
        >
          <ExtraFilter nameSpace={IMPORTANT_NAMESPACE} />
          tab4
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.ai_files_list',
          })}`}
          key={EVENT_AI_NAMESPACE}
        >
          <ExtraFilter nameSpace={EVENT_AI_NAMESPACE} />
          <EventAI />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Storage);
