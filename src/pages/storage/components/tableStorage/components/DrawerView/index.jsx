import { AI_SOURCE } from '@/constants/common';
import ExportEventFileApi from '@/services/exportEventFile';
import EventAiAPI from '@/services/storage-api/eventAI-api';
import {
  CloseOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  StarOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Button, Col, Collapse, Input, Row, Space, Spin } from 'antd';
import Popconfirm from 'antd/es/popconfirm';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useIntl, connect } from 'umi';
import {
  DAILY_ARCHIVE_NAMESPACE,
  EVENT_AI_NAMESPACE,
  PROCESSING_STATUS_OPTIONS,
} from '../../../../constants';
import PreviewMap from '../PreviewMap/PreviewMap';
import VideoPlayer from '../VideoPlayer';
import {
  CollapseStyled,
  HeaderPanelStyled,
  MSCustomizeDrawerStyled,
  StyledEventFileDetail,
  VideoOverlay,
} from './style';
import DrawerTicket from './components/DrawerTicket';

const { Panel } = Collapse;

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

function DrawerView({ isOpenView, data, onClose, state, nameSpace, dispatch }) {
  const intl = useIntl();

  const [detailAI, setDetailAI] = useState(defaultEventFile);

  const [listLongLat, setListLongLat] = useState([]);
  const [tracingList, setTracingList] = useState([]);

  const [processState, setProcessState] = useState(PROCESSING_STATUS_OPTIONS[0]);

  const [imageViolate, setImageViolate] = useState(null);
  const [plateNumber, setPlateNumber] = useState(null);
  const [imageVehicle, setImageVehicle] = useState(null);

  const [imageAICurrent, setImageAICurrent] = useState(null);

  const [currNode, setCurrNode] = useState('');
  const [objectType, setObjectType] = useState(null);
  const [imageOther, setImageOther] = useState([]);

  const [videoErrorURL, setVideoErrorURL] = useState(null);

  const [loading, setLoading] = useState(false);

  const [openDrawerTicket, setOpenDrawerTicket] = useState(false);

  const hasVideo = detailAI?.videoUrl ? true : false;

  const handleOpenDrawerTicket = () => {
    setOpenDrawerTicket(true);
  };

  const handleCloseDrawerTicket = () => {
    setOpenDrawerTicket(false);
  };

  const handleRefresh = () => {
    const { metadata } = state[EVENT_AI_NAMESPACE];
    const dataParam = Object.assign({ ...metadata });
    dispatch({
      type: `${EVENT_AI_NAMESPACE}/fetchAll`,
      payload: dataParam,
    });
  };

  const getTracingEvents = () => {
    const payload = {
      page: 0,
      size: 15,
    };
    EventAiAPI.getTracingEvents(data.uuid, payload)
      .then((data) => {
        setTracingList(data?.payload);
        const longLats = data.map((item) => {
          return [item.lat_, item.long_];
        });
        setListLongLat(longLats);
      })
      .catch((err) => {
        console.log('getTracingEvents err', err);
      });
  };

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

  const renderDailyArchiveNameSpace = () => {
    return (
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
            <div className="detailInfo-content">
              {data?.fileType === 0 &&
                intl.formatMessage({
                  id: 'view.storage.type_video',
                })}
            </div>
            <div className="detailInfo-content">
              {data?.fileType === 1 &&
                intl.formatMessage({
                  id: 'view.storage.type_image',
                })}
            </div>
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
    );
  };

  const renderEventAiNameSpace = () => {
    return (
      <StyledEventFileDetail className="eventDetail4">
        <Col span={14}>
          <div className="err_image">
            {REACT_APP_AI_SOURCE !== AI_SOURCE.PHILONG ? (
              <ul>
                {imageOther
                  ? imageOther.map((item, index) => (
                      <VideoOverlay key={item.uuid}>
                        <div className="imageOther-container">
                          <div className="imageOther-item">
                            {item.uuid !== detailAI.uuid ? (
                              <Popconfirm
                                title={intl.formatMessage({ id: 'noti.sure_to_delete' })}
                                onCancel={(event) => {
                                  event.stopPropagation();
                                }}
                                onConfirm={(event) => {
                                  event.stopPropagation();
                                  // deleteImageHandler(item.uuid);
                                }}
                              >
                                <Button
                                  className="imageOther-btn"
                                  size="small"
                                  type="danger"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                  }}
                                >
                                  <CloseOutlined style={{}} />
                                </Button>
                              </Popconfirm>
                            ) : null}

                            <img
                              onClick={(event) => {
                                event.stopPropagation();
                                // viewImageAIHandler(item);
                              }}
                              className="videoErrorURL-img"
                              src={'data:image/jpeg;base64,' + item.image}
                              alt="Avatar"
                            />
                          </div>
                        </div>
                      </VideoOverlay>
                    ))
                  : null}

                {hasVideo && (
                  <>
                    {videoErrorURL ? (
                      <VideoOverlay>
                        <div className="videoErrorURL-container">
                          <div className="videoErrorURL-item">
                            <div
                              className="img__item"
                              onClick={(event) => {
                                event.stopPropagation();
                                // viewImageAIHandler(videoErrorURL);
                              }}
                            >
                              {videoErrorURL && (
                                <video className="videoErrorURL-video" loop autoPlay>
                                  <source src={videoErrorURL.url} type="video/mp4" />{' '}
                                </video>
                              )}
                            </div>
                          </div>
                        </div>
                      </VideoOverlay>
                    ) : (
                      <VideoOverlay
                      // onClick={downloadVideo}
                      >
                        <div className="videoErrorURL-container">
                          <div className="videoErrorURL-item">
                            <Spin spinning={loading}>
                              <img
                                className="videoErrorURL-img"
                                src={imageOther[0]?.image}
                                alt="Avatar"
                              />
                            </Spin>
                            <PlayCircleOutlined className="play_icon" />
                          </div>
                        </div>
                      </VideoOverlay>
                    )}
                  </>
                )}
              </ul>
            ) : (
              <ul>
                {imageOther
                  ? imageOther.map((item, index) => (
                      <VideoOverlay key={item.id}>
                        <div className="imageOther-container">
                          <div className="imageOther-item">
                            {item.uuid !== detailAI.uuid ? (
                              <Popconfirm
                                title={intl.formatMessage({ id: 'noti.sure_to_delete' })}
                                onCancel={(event) => {
                                  event.stopPropagation();
                                }}
                                onConfirm={(event) => {
                                  event.stopPropagation();
                                  // deleteImageHandler(item.uuid);
                                }}
                              />
                            ) : null}

                            {item.type === 'mp4' ? (
                              <div
                                className="img__item"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  // viewImageAIHandler(item);
                                }}
                              >
                                {/* <video id={item.id} refs="rtsp://10.0.0.66:8554/proxy6" /> */}
                                <Space size="middle">
                                  <Spin
                                    className="video-js"
                                    size="large"
                                    id={'spin-slot-' + item.id}
                                    style={{ display: 'none' }}
                                  />
                                </Space>
                                <video className="imageOther-video" loop autoPlay>
                                  <source src={item.url} type="video/mp4" />
                                </video>
                              </div>
                            ) : (
                              <img
                                onClick={(event) => {
                                  event.stopPropagation();
                                  // viewImageAIHandler(item);
                                }}
                                className="imageOther-img"
                                src={item.image}
                                alt="Avatar"
                              />
                            )}
                          </div>
                        </div>
                      </VideoOverlay>
                    ))
                  : null}

                {hasVideo && (
                  <>
                    {videoErrorURL ? (
                      <VideoOverlay>
                        <div className="videoErrorURL-container">
                          <div className="videoErrorURL-item">
                            <div
                              onClick={(event) => {
                                event.stopPropagation();
                                // viewImageAIHandler(videoErrorURL);
                              }}
                            >
                              {videoErrorURL && (
                                <video className="videoErrorURL-video" loop autoPlay>
                                  <source src={videoErrorURL.url} type="video/mp4" />{' '}
                                </video>
                              )}
                            </div>
                          </div>
                        </div>
                      </VideoOverlay>
                    ) : (
                      <VideoOverlay
                      // onClick={downloadVideo}
                      >
                        <div className="videoErrorURL-container">
                          <div className="videoErrorURL-item">
                            <Spin spinning={loading}>
                              <img
                                className="videoErrorURL-img filter-blur"
                                src={imageOther[0]?.image}
                                alt="Avatar"
                              />
                            </Spin>
                            <PlayCircleOutlined className="play_icon" />
                          </div>
                        </div>
                      </VideoOverlay>
                    )}
                  </>
                )}
              </ul>
            )}
          </div>
        </Col>

        <Col span={10}>
          <Row className="detail-item">
            <Col span={10}>
              <div className="title">
                {intl.formatMessage({ id: 'view.penaltyTicket.vehicle_type' })} :{' '}
              </div>
            </Col>
            <Col span={14}>{detailAI?.vehicleType}</Col>
          </Row>
          <Row className="detail-item">
            <Col span={10}>
              <div className="title">
                {intl.formatMessage({ id: 'view.ai_events.plateNumber' })} :{' '}
              </div>
            </Col>
            <Col span={14}>
              {detailAI.plateNumber
                ? detailAI.plateNumber
                : intl.formatMessage({ id: 'view.ai_events.UnKnow' })}
            </Col>
          </Row>
          <Row className="detail-item">
            <Col span={10}>
              <div className="title">Video :</div>
            </Col>
            <Col span={14}>
              {hasVideo ? (
                <a href={detailAI.videoUrl} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              ) : null}
            </Col>
          </Row>
          <Row className="detail-item">
            <Col span={10}>
              <div className="title">
                {intl.formatMessage({ id: 'view.common_device.state' })} :{' '}
              </div>
            </Col>
            <Col span={14}>
              {detailAI?.status &&
                intl.formatMessage({ id: `view.ai_events.processingStatus.${detailAI.status}` })}
            </Col>
          </Row>
        </Col>
      </StyledEventFileDetail>
    );
  };

  const renderTitleDetail = () => {
    if (nameSpace === EVENT_AI_NAMESPACE) {
      return intl.formatMessage({
        id: 'view.ai_events.err_image',
      });
    }

    return intl.formatMessage({
      id: 'view.map.map',
    });
  };

  useEffect(() => {
    if (nameSpace === EVENT_AI_NAMESPACE) {
      getTracingEvents();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameSpace]);

  useEffect(() => {
    if (nameSpace === EVENT_AI_NAMESPACE && data != null) {
      let imageOther = [];
      if (REACT_APP_AI_SOURCE === AI_SOURCE.PHILONG) {
        setDetailAI({
          ...data,
        });
        // setProcessState(PROCESSING_STATUS_OPTIONS.find((e) => e.value === data?.status));
        const getViolateUrl = ExportEventFileApi.downloadAIIntegrationFile(
          data.uuid,
          'ImageViolate.jpg',
        );
        const getPlateNumUrl = ExportEventFileApi.downloadAIIntegrationFile(
          data.uuid,
          'ImagePlate.jpg',
        );
        const getVehicleUrl = ExportEventFileApi.downloadAIIntegrationFile(
          data.uuid,
          'ImageVehicle.jpg',
        );

        Promise.all([getViolateUrl, getPlateNumUrl, getVehicleUrl])
          .then(async (value) => {
            if (value[0] instanceof Blob) {
              const blob = new Blob([value[0]], { type: 'octet/stream' });
              imageOther.push({
                id: 'violate',
                fileName: 'ImageViolate.jpg',
                uuid: data.uuid,
                image: URL.createObjectURL(blob),
              });
              setImageViolate(URL.createObjectURL(blob));
            }

            if (value[1] instanceof Blob) {
              const blob = new Blob([value[1]], { type: 'octet/stream' });
              imageOther.push({
                id: 'plate',
                fileName: 'ImagePlate.jpg',
                uuid: data.uuid,
                image: URL.createObjectURL(blob),
              });
              setPlateNumber(URL.createObjectURL(blob));
            }

            if (value[2] instanceof Blob) {
              const blob = new Blob([value[2]], { type: 'octet/stream' });
              imageOther.push({
                id: 'vehicle',
                fileName: 'ImageVehicle.jpg',
                uuid: data.uuid,
                image: URL.createObjectURL(blob),
              });
              setImageVehicle(URL.createObjectURL(blob));
            }
            // if (!isEmpty(value[3])) {
            //   const blob = new Blob([value[3].data], { type: 'octet/stream' });
            //   imageOther.push({
            //     id: 'video',
            //     type: 'mp4',
            //     fileName: 'Video.mp4',
            //     uuid: data.uuid,
            //     url: URL.createObjectURL(blob),
            //   });
            // }
          })
          .then(() => {
            setImageOther(imageOther);
          });
        setImageAICurrent({
          uuid: data.uuid,
          fileName: 'ImageViolate.jpg',
        });
      } else {
        setDetailAI({});
        if (data && data.uuid != null) {
          EventAiAPI.getEventsByTrackingId(data.trackingId).then((data) => {
            data.payload.map((ef) => {
              if (ef.thumbnailData != null) {
                imageOther.push({
                  image: ef.thumbnailData,
                  uuid: ef.uuid,
                  cameraUuid: ef.cameraUuid,
                  trackingId: ef.trackingId,
                  fileName: ef.fileName,
                });
              }
            });
          });
          setImageOther(imageOther);

          EventAiAPI.getDetailEvent(data.uuid).then((data) => {
            if (data && data.payload) {
              setDetailAI({
                ...data,
                code: data.payload.code,
                name: data.payload.name,
                position: data.payload.position,
                note: data.payload.note,
                plateNumber: data.payload.plateNumber,
                departmentUuid: data.payload.departmentUuid,
                departmentName: data.payload.departmentName,
                typeObject: data.payload.useCase === 'zac_vehicle' ? 'vehicle' : 'human',
              });
              setCurrNode(data?.payload?.note);
              // setProcessState(
              //   PROCESSING_STATUS_OPTIONS.find((e) => e.value === data?.payload?.status),
              // );
              setObjectType(
                typeObjects.find(
                  (e) => e.value === (data.payload.useCase === 'zac_vehicle' ? 'vehicle' : 'human'),
                ),
              );
              setImageAICurrent({
                cameraUuid: data.cameraUuid,
                trackingId: data.trackingId,
                uuid: data.uuid,
                fileName: data.fileName,
              });
            }
          });
        }
      }
    }

    if (
      nameSpace === EVENT_AI_NAMESPACE &&
      data != null &&
      REACT_APP_AI_SOURCE === AI_SOURCE.PHILONG
    ) {
      getTracingEvents();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, nameSpace]);

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

          {nameSpace === EVENT_AI_NAMESPACE && (
            <>
              <Button icon={<CreditCardOutlined />} onClick={handleOpenDrawerTicket}>
                {intl.formatMessage({
                  id: 'view.common_device.ticket',
                })}
              </Button>
              <Button icon={<SwapOutlined />}>
                {intl.formatMessage({
                  id: 'view.common_device.move',
                })}
              </Button>
            </>
          )}
        </Space>
      }
      width={'90%'}
      onClose={onClose}
      openDrawer={isOpenView}
    >
      {/* <div className="headerCapture">
        {intl.formatMessage({
          id: 'view.storage.detail_file',
        })}
      </div> */}

      <CollapseStyled
        expandIconPosition={'right'}
        ghost={true}
        bordered={false}
        defaultActiveKey={['1', '2']}
      >
        <Panel header={<HeaderPanelStyled>{renderTitleDetail()}</HeaderPanelStyled>} key="1">
          {nameSpace === DAILY_ARCHIVE_NAMESPACE && renderDailyArchiveNameSpace()}
          {nameSpace === EVENT_AI_NAMESPACE && renderEventAiNameSpace()}
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

      <VideoPlayer data={data} nameSpace={nameSpace} tracingList={tracingList} />

      {nameSpace === EVENT_AI_NAMESPACE && (
        <DrawerTicket
          imageViolate={imageViolate}
          plateNumber={plateNumber}
          imageVehicle={imageVehicle}
          data={data}
          isOpenView={openDrawerTicket}
          onClose={handleCloseDrawerTicket}
          onRefresh={handleRefresh}
        />
      )}
    </MSCustomizeDrawerStyled>
  );
}

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps)(DrawerView);
