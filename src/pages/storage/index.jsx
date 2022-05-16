import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import Captured from './components/captured';
import TableDailyArchive from './components/dailyArchive/TableDailyArchive';

const { TabPane } = Tabs;

function Storage() {
  const intl = useIntl();

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.daily_archive_files_list',
          })}`}
          key="dailyArchive"
        >
          <TableDailyArchive />
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.captured_files_list',
          })}`}
          key="captured"
        >
          <Captured />
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.event_files_list',
          })}`}
          key="event"
        >
          tab3
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.important_files_list',
          })}`}
          key="important"
        >
          tab4
        </TabPane>
        <TabPane
          tab={`${intl.formatMessage({
            id: 'view.storage.ai_files_list',
          })}`}
          key="ai"
        >
          tab5
        </TabPane>
      </Tabs>
    </PageContainer>
  );
}

export default Storage;
