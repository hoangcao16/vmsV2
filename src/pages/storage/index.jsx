import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useIntl } from 'umi';
import ExtraFilter from './components/extraFilter';
import TableStorage from './components/tableStorage';
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
        />
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.captured_files_list',
          })}`}
          key={CAPTURED_NAMESPACE}
        />
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.event_files_list',
          })}`}
          key={EVENT_FILES_NAMESPACE}
        />
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.important_files_list',
          })}`}
          key={IMPORTANT_NAMESPACE}
        />
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.ai_files_list',
          })}`}
          key={EVENT_AI_NAMESPACE}
        />
      </Tabs>
      <ExtraFilter nameSpace={nameSpace} />
      <TableStorage nameSpace={nameSpace} />
    </PageContainer>
  );
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Storage);
