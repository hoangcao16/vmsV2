import { FolderOutlined, LinkOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Pagination, Spin } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect, useIntl } from 'umi';
import { GridViewTableStyled } from './style';

function GridViewTable({ state, dispatch, nameSpace }) {
  const intl = useIntl();
  const { list, metadata } = state[nameSpace];
  const loading = state.loading.models[nameSpace] ? state.loading.models[nameSpace] : false;

  if (loading) {
    return <Spin />;
  }

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...metadata, page, size });

    dispatch({
      type: `${nameSpace}/fetchAll`,
      payload: dataParam,
    });
  };

  return (
    <GridViewTableStyled>
      {list.map((item, index) => {
        return (
          <div className="card-event" key={item.id}>
            <div className="card-img">
              <img
                className="imageFile"
                src={
                  'data:image/jpeg;base64,' +
                  (item.thumbnailData && item.thumbnailData.length > 0 ? item.thumbnailData : '')
                }
                alt="Thumbnail OverView Img"
              />
            </div>

            <div className="card-content">
              <div className="event-type">
                {intl.formatMessage({
                  id: 'view.ai_events.' + item.eventType,
                })}
              </div>

              <div className="card-info">
                <VideoCameraOutlined className="card-info__icon" />
                <div className="card-info__value">{item.cameraName}</div>
              </div>
              <div className="card-info">
                <FolderOutlined className="card-info__icon" />
                <div className="card-info__value">{item.cameraName}</div>
              </div>
              <div className="card-info">
                <LinkOutlined className="card-info__icon" />
                <div className="card-info__value">{item.overViewVmsUrl}</div>
              </div>

              <div className="card-footer">
                <div className="card-footer-left">
                  {moment(item.createdTime).format('DD/MM/YYYY HH:mm')}
                </div>

                <div className="card-footer-right">{item.address}</div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="gridView-pagination">
        <Pagination
          showSizeChanger
          showQuickJumper
          showTotal={(total) =>
            `${intl.formatMessage({
              id: 'pages.storage.dailyArchive.total',
            })} ${total} ${intl.formatMessage({
              id: 'pages.storage.dailyArchive.camera',
            })}`
          }
          total={metadata?.total}
          onChange={onPaginationChange}
          pageSize={metadata?.size}
          current={metadata?.page}
        />
      </div>
    </GridViewTableStyled>
  );
}

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps)(GridViewTable);
