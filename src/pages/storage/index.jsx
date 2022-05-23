import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { connect, useIntl } from 'umi';
import Captured from './components/Captured';
import TableDailyArchive from './components/DaiyArchive/TableDailyArchive';
import EventAI from './components/EventAI';

const { TabPane } = Tabs;

function Storage({ dispatch }) {
  const intl = useIntl();

  const init = (activeKey) => {
    if (!activeKey) {
      return null;
    }

    switch (activeKey) {
      case 'dailyArchive': {
        dispatch({
          type: 'dailyArchive/fetchAllDailyArchive',
          payload: {
            page: 1,
            size: 10,
          },
        });

        break;
      }

      case 'ai': {
        dispatch({
          type: 'eventAI/fetchAllEventsAI',
          payload: {
            page: 1,
            size: 10,
          },
        });

        break;
      }
      case 'captured': {
        break;
      }
      case 'event': {
        break;
      }
      case 'important': {
        break;
      }

      default:
        console.log('Not found Key');
    }
  };

  const onChange = (activeKey) => {
    init(activeKey);
  };

  useEffect(() => {
    init('dailyArchive');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Tabs defaultActiveKey="dailyArchive" onChange={onChange}>
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
