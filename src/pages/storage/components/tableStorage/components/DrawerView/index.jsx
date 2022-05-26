import { DeleteOutlined, DownloadOutlined, SaveOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row, Space } from 'antd';
import React, { useState } from 'react';
import { CollapseStyled, HeaderPanelStyled, MSCustomizeDrawerStyled } from './style';
import { useIntl } from 'umi';
const { Panel } = Collapse;
import moment from 'moment';
import PreviewMap from '../PreviewMap/PreviewMap';
import VideoPlayer from '../VideoPlayer';

import { DAILY_ARCHIVE_NAMESPACE, EVENT_AI_NAMESPACE } from '../../../../constants';

let defaultEventFile = {
  id: '',
  uuid: '',
  eventUuid: '',
  eventName: '',
  name: '',
  violationTime: -1,
  createdTime: -1,
  note: '',
  cameraUuid: '',
  cameraName: '',
  type: -1,
  length: 0,
  address: '',
  rootFileUuid: '',
  pathFile: '',
  isImportant: false,
  thumbnailData: [''],
  nginx_host: '',
  blob: null,
  isSaved: false,
  tBlob: null,
};

function DrawerView({ isOpenView, data, onClose, nameSpace }) {
  const intl = useIntl();

  const [detailAI, setDetailAI] = useState(defaultEventFile);
  const [fileCurrent, setFileCurrent] = useState(null);
  const [listLongLat, setListLongLat] = useState([]);

  const renderTitle = () => {
    if (nameSpace === DAILY_ARCHIVE_NAMESPACE) {
      return (
        <>
          {intl.formatMessage({
            id: 'view.storage.detail_file',
          })}
        </>
      );
    }

    if (nameSpace === EVENT_AI_NAMESPACE) {
      return (
        <>
          {intl.formatMessage({
            id: 'view.storage.detail_file_AI',
          })}
        </>
      );
    }

    return <></>;
  };

  return (
    <MSCustomizeDrawerStyled
      title={renderTitle()}
      extra={
        <Space>
          <Button icon={<SaveOutlined />} type="primary">
            {intl.formatMessage({
              id: 'view.storage.save_note',
            })}
          </Button>
          <Button icon={<DownloadOutlined />}>
            {intl.formatMessage({
              id: 'view.storage.download_file',
            })}
          </Button>
          <Button icon={<DeleteOutlined />}>
            {intl.formatMessage({
              id: 'view.storage.delete',
            })}
          </Button>
          <Button icon={<StarOutlined />}>
            {intl.formatMessage({
              id: 'view.storage.tick',
            })}
          </Button>
        </Space>
      }
      width={'90%'}
      onClose={onClose}
      openDrawer={isOpenView}
    >
      <div className="headerCapture">
        {intl.formatMessage({
          id: 'view.storage.detail_file',
        })}
      </div>

      <CollapseStyled
        expandIconPosition={'right'}
        ghost={true}
        bordered={false}
        defaultActiveKey={['1', '2']}
      >
        <Panel
          header={
            <HeaderPanelStyled>
              {intl.formatMessage({
                id: 'view.storage.detail_information',
              })}
            </HeaderPanelStyled>
          }
          key="1"
        >
          <Row justify="space-between">
            <Col span={11}>
              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage({
                    id: 'view.storage.file_name',
                  })}
                  :
                </div>
                <div className="detailInfo-content">{data?.name}</div>
              </div>

              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage({
                    id: 'view.storage.file_type',
                  })}
                  :
                </div>
                <div className="detailInfo-content">{data?.fileType === 0 && 'Video'}</div>
                <div className="detailInfo-content">{data?.fileType === 1 && 'Ảnh'}</div>
              </div>

              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage(
                    {
                      id: 'view.storage.camera_name',
                    },
                    {
                      cam: intl.formatMessage({ id: 'camera' }),
                    },
                  )}
                  :
                </div>
                <div className="detailInfo-content">{data?.cameraName}</div>
              </div>

              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage({
                    id: 'view.storage.violation_time',
                  })}
                  :
                </div>
                <div className="detailInfo-content">
                  {moment(data?.createdTime * 1000).format('DD/MM/YYYY HH:mm')}
                </div>
              </div>

              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage({
                    id: 'view.storage.address',
                  })}
                  :
                </div>
                <div className="detailInfo-content">{data?.address}</div>
              </div>
            </Col>

            <Col span={11}>
              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage({
                    id: 'view.storage.length',
                  })}
                  :
                </div>
                <div className="detailInfo-content">
                  {moment().startOf('day').seconds(parseInt(data?.length)).format('H:mm:ss')}
                </div>
              </div>

              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage({
                    id: 'view.storage.path',
                  })}
                  :
                </div>
                <div className="detailInfo-content">{data?.path}</div>
              </div>

              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage({
                    id: 'view.storage.created_time',
                  })}
                  :
                </div>
                <div className="detailInfo-content">
                  {moment(data?.createdTime * 1000).format('DD/MM/YYYY')}
                </div>
              </div>

              <div className="detailInfo">
                <div className="detailInfo-title">
                  {intl.formatMessage({
                    id: 'view.storage.note',
                  })}
                  :
                </div>
                <div className="detailInfo-content">
                  <Input.TextArea />
                </div>
              </div>
            </Col>
          </Row>
        </Panel>

        <Panel
          header={
            <HeaderPanelStyled>
              {intl.formatMessage({
                id: 'view.map.map',
              })}
            </HeaderPanelStyled>
          }
          key="2"
        >
          <Row>
            <Col span={24}>
              <PreviewMap data={detailAI} listLongLat={listLongLat} />
            </Col>
          </Row>
        </Panel>
      </CollapseStyled>

      <VideoPlayer data={data} />
    </MSCustomizeDrawerStyled>
  );
}

export default DrawerView;
