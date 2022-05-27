import NotiApi from '@/services/notification/NotiApi';
import { Badge, Typography } from 'antd';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getLocale, useIntl } from 'umi';
import './Notificaltion.less';

const { Text } = Typography;

const Notification = (props) => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, lang: 'vn' });
  const [hasMore, setHasMore] = useState(true);
  const [badge, setBadge] = useState(0);
  const intl = useIntl();
  const warningDisk = 'WARNING_DISK';

  useEffect(() => {
    fetchData();
  }, [pagination]);

  useEffect(() => {
    if (getLocale() == 'en-US') {
      setPagination({ ...pagination, lang: 'en' });
    } else {
      setPagination({ ...pagination, lang: 'vn' });
    }
  }, []);

  useEffect(() => {
    try {
      NotiApi.getBagde().then((result) => {
        setBadge(result?.payload);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchData = () => {
    props.dispatch({
      type: 'noti/fetchData',
      payload: pagination,
    });
  };

  const handleNext = () => {
    if (props?.list.length >= props.count) {
      setHasMore(false);
      return;
    }
    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  const formatDate = (time) => {
    if (time < 10) {
      return `0${time}`;
    }
    return time;
  };

  const dateForm = (date) => {
    let formatted_date =
      formatDate(date.getDate()) + '-' + formatDate(date.getMonth() + 1) + '-' + date.getFullYear();
    return formatted_date;
  };

  const renderTitle = (type) => {
    if (!isEmpty(type)) {
      if (type === warningDisk) {
        return (
          <Text>
            {intl.formatMessage({
              id: `pages.home.hardDriveFull`,
            })}
          </Text>
        );
      }
      return (
        <Text>
          {intl.formatMessage({
            id: `pages.home.camera`,
          })}
        </Text>
      );
    }
    return (
      <Text>
        {!isEmpty(estimatedTime)
          ? estimatedTime
          : intl.formatMessage({
              id: `pages.home.unknownName`,
            })}
      </Text>
    );
  };

  const renderContent = (type, name, percentUsed, estimatedTime, status) => {
    if (type === warningDisk) {
      return (
        <Text>
          {intl.formatMessage(
            {
              id: `pages.home.hardDriveWarning`,
            },
            {
              name: `${
                !isEmpty(name)
                  ? name
                  : `${intl.formatMessage({
                      id: `pages.home.unknownName`,
                    })}`
              }`,
              percentUsed: `${
                !isEmpty(percentUsed)
                  ? percentUsed
                  : `${intl.formatMessage({
                      id: `pages.home.unknown`,
                    })}`
              }`,
              estimatedTime: `${
                !isEmpty(estimatedTime)
                  ? estimatedTime
                  : `${intl.formatMessage({
                      id: `pages.home.unknown`,
                    })}`
              }`,
            },
          )}
        </Text>
      );
    }
    return (
      <Text>
        Camera{' '}
        {!isEmpty(name)
          ? name
          : intl.formatMessage({
              id: `pages.home.unknownName`,
            })}{' '}
        {status
          ? intl.formatMessage({
              id: `pages.home.active`,
            })
          : intl.formatMessage({
              id: `pages.home.inactive`,
            })}
        .
      </Text>
    );
  };
  const renderTime = (createdTime) => {
    if (isEmpty(createdTime)) {
      return (
        <Text>
          {dateForm(new Date(createdTime))} | {new Date(createdTime).toLocaleTimeString()}
        </Text>
      );
    }
    return (
      <Text>
        {!isEmpty(estimatedTime)
          ? estimatedTime
          : intl.formatMessage({
              id: `pages.home.unknown`,
            })}
      </Text>
    );
  };

  const listItems = props?.list.map((item, index) => (
    <li key={index} className={`noti-item ${item?.isSeen ? 'seen' : ''}`}>
      <div className="noti-item--title">{renderTitle(item?.type)}</div>
      <div className="noti-item--content">
        {renderContent(
          item?.type,
          item?.name,
          item?.percentUsed,
          item?.estimatedTime,
          item?.status,
        )}
      </div>
      <div className="noti-item--time">{renderTime(item?.createdTime)}</div>
      <></>
    </li>
  ));

  return (
    <div className="home-notification">
      <div className="home-notification-header">
        <h3>
          {intl.formatMessage({
            id: `pages.home.notification`,
          })}
        </h3>
        <Badge count={badge} />
      </div>
      <InfiniteScroll
        dataLength={props?.list.length}
        next={handleNext}
        hasMore={hasMore}
        height={820}
      >
        {props?.list ? (
          <ul className="noti-list">
            {isEmpty(props?.list) ? (
              <div className="noti-list--empty">
                {' '}
                {intl.formatMessage({
                  id: `pages.home.noInfo`,
                })}
              </div>
            ) : (
              listItems
            )}
          </ul>
        ) : (
          <div className="noti-list-error">
            <b>
              {' '}
              {intl.formatMessage({
                id: `pages.home.errorLoadingNoti`,
              })}
            </b>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    list: state.noti.list || [],
    count: state.noti.count || 0,
  };
}

export default connect(mapStateToProps)(Notification);
