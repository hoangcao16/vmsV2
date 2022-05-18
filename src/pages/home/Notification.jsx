import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { useIntl } from 'umi';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getLocale } from 'umi';
import NotiApi from '@/services/notification/NotiApi';
import './Notificaltion.less';
import { Badge, Typography } from 'antd';
import { isEmpty } from 'lodash';

const { Text } = Typography;

const Notification = (props) => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, lang: 'vn' });
  const [hasMore, setHasMore] = useState(true);
  const [badge, setBadge] = useState(0);
  const intl = useIntl();

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

  const formatDate = (date) => {
    let formatted_date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    return formatted_date;
  };

  const renderTitle = (type) => {
    if (!isEmpty(type)) {
      if (type === 'WARNING_DISK') {
        return (
          <Text>
            {intl.formatMessage({
              id: `pages.home.hardDriveFull`,
              defaultMessage: 'Hard drive full',
            })}
          </Text>
        );
      }
      return (
        <Text>
          {intl.formatMessage({
            id: `pages.home.camera`,
            defaultMessage: 'Camera',
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
              defaultMessage: 'Unknown Name',
            })}
      </Text>
    );
  };

  const renderContent = (type, name, percentUsed, estimatedTime, status) => {
    if (type === 'WARNING_DISK') {
      return (
        <Text>
          {intl.formatMessage({
            id: `pages.home.hardDrive`,
            defaultMessage: 'Hard drive',
          })}{' '}
          {!isEmpty(name)
            ? name
            : intl.formatMessage({
                id: `pages.home.unknownName`,
                defaultMessage: 'Unknown Name',
              })}{' '}
          {intl.formatMessage({
            id: `pages.home.wasUsed`,
            defaultMessage: 'was used',
          })}{' '}
          {!isEmpty(percentUsed)
            ? percentUsed
            : intl.formatMessage({
                id: `pages.home.unknown`,
                defaultMessage: 'unknown',
              })}
          %.{' '}
          {intl.formatMessage({
            id: `pages.home.estimatedRemaining`,
            defaultMessage: 'estimated remaining',
          })}{' '}
          {!isEmpty(estimatedTime)
            ? estimatedTime
            : intl.formatMessage({
                id: `pages.home.unknown`,
                defaultMessage: 'unknown',
              })}
          .
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
              defaultMessage: 'Unknown Name',
            })}{' '}
        {status
          ? intl.formatMessage({
              id: `pages.home.active`,
              defaultMessage: 'active',
            })
          : intl.formatMessage({
              id: `pages.home.inactive`,
              defaultMessage: 'inactive',
            })}
        .
      </Text>
    );
  };
  const renderTime = (createdTime) => {
    if (isEmpty(createdTime)) {
      return (
        <Text>
          {formatDate(new Date(createdTime))} | {new Date(createdTime).toLocaleTimeString()}
        </Text>
      );
    }
    return (
      <Text>
        {!isEmpty(estimatedTime)
          ? estimatedTime
          : intl.formatMessage({
              id: `pages.home.unknown`,
              defaultMessage: 'Hard drive',
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
    <div>
      <div className="wrapper">
        <Badge count={badge} className="wrapper-header">
          Thông báo
        </Badge>
        <InfiniteScroll
          dataLength={props?.list.length}
          next={handleNext}
          hasMore={hasMore}
          height={820}
        >
          {props?.list ? (
            <ul className="noti-list">
              {isEmpty(props?.list) ? (
                <div className="noti-list--empty">Không có thông tin</div>
              ) : (
                listItems
              )}
            </ul>
          ) : (
            <div className="noti-list-error">
              <b>Có lỗi khi tải thông báo</b>
            </div>
          )}
        </InfiniteScroll>
      </div>
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
