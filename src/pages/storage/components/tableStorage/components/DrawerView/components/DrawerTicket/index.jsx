import { notify } from '@/components/Notify';
import { PROCESSING_STATUS_OPTIONS } from '@/pages/storage/constants';
import EventAiAPI from '@/services/storage-api/eventAI-api';
import { getText } from '@/utils/toVND';
import { CloseOutlined, PrinterOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useIntl } from 'umi';
import DrawerConfirmChangeStatus from '../DrawerConfirmChangeStatus';
import DrawerConfirmSend from '../DrawerConfirmSend';
import DrawerSendTicket from '../DrawerSendTicket';
import { MSCustomizeDrawerStyled, StyledInput, WrapperPrint } from './style';
import './style.less';

function DrawerTicket({
  data,
  isOpenView,
  onClose,
  onRefresh,
  imageViolate,
  imageVehicle,
  plateNumber,
}) {
  const intl = useIntl();
  const componentRef = useRef();
  const receiverRef = useRef();

  const [fine, setFine] = useState('');
  const [toText, setToText] = useState('');

  const [visibleSendTicket, setVisibleSendTicket] = useState(false);
  const [loadingSendEmail, setLoadingSendEmail] = useState(false);

  const [visibleConfirmSend, setVisibleConfirmSend] = useState(false);
  const [visibleConfirmChangeStatus, setVisibleConfirmChangeStatus] = useState(false);

  const handleOpenDrawerSendTicket = () => {
    setVisibleSendTicket(true);
  };

  const handleCloseDrawerSendTicket = () => {
    setVisibleSendTicket(false);
  };

  const handleOpenDrawerConfirmSend = () => {
    setVisibleConfirmSend(true);
  };

  const handleCloseDrawerConfirmSend = () => {
    setVisibleConfirmSend(false);
  };

  const handleOpenDrawerConfirmChangeStatus = () => {
    setVisibleConfirmChangeStatus(true);
  };

  const handleCloseDrawerConfirmChangeStatus = () => {
    setVisibleConfirmChangeStatus(false);
  };

  const handleSetFine = (e) => {
    if (parseFloat(e.target.value) < 0) {
      setFine(0);
    } else if (e?.target?.value?.length > 10) {
      const value = e.target.value.slice(0, 10);
      setFine(value);
      if (value !== '' && !isNaN(parseFloat(value))) {
        const text = getText(parseFloat(value));
        setToText(text?.charAt(0)?.toUpperCase() + text?.slice(1));
      } else {
        setToText('');
      }
    } else {
      const value = e.target.value;
      setFine(value);
      if (value !== '' && !isNaN(parseFloat(value))) {
        const text = getText(parseFloat(value));
        setToText(text?.charAt(0)?.toUpperCase() + text?.slice(1));
      } else {
        setToText('');
      }
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const updateStatusEventAI = () => {
    setLoadingSendEmail(true);

    const params = {
      cameraUuid: data.cameraUuid,
      uuid: data.uuid,
      status: PROCESSING_STATUS_OPTIONS[1].value,
    };

    EventAiAPI.editInfoOfEvent(data.uuid, params)
      .then((res) => {
        notify('success', 'noti.success', 'noti.successfully_edit_status');
        onClose();
      })
      .catch((err) => {
        notify('error', 'noti.ERROR', `noti.error_edit`);
      })
      .finally(() => {
        setLoadingSendEmail(false);
        onRefresh();
      });
  };

  const handleUpdateStatus = () => {
    handleOpenDrawerConfirmChangeStatus();
  };

  const sendTicket = () => {
    setLoadingSendEmail(true);
    const dataSend = {
      cameraName: data?.cameraName,
      cameraUuid: data?.cameraUuid,
      createdTime: moment(data?.createdTime).format('HH:mm DD/MM/YYYY'),
      eventName: data?.eventName,
      money: `${fine} ${toText === '' ? '' : `(${toText} đồng )`}`,
      overViewUrl: data?.overViewUrl,
      penaltyTicketId: data?.penaltyTicketId,
      plateNumber: data?.plateNumber,
      uuid: data?.uuid,
      vehicleType: data?.vehicleType,
      videoUrl: data?.videoUrl,
      emails: receiverRef.current ? receiverRef.current.replace(/\s/g, '') : '',
    };

    EventAiAPI.sendTicket(dataSend)
      .then((res) => {
        notify('success', 'noti.success', 'noti.sent_mail_successful');

        if (data.status === PROCESSING_STATUS_OPTIONS[0].value) {
          handleUpdateStatus();
          return;
        }

        onClose();
        onRefresh();
      })
      .catch((err) => {
        notify('error', 'noti.ERROR', `noti.fail_sent_mail`);
      })
      .finally(() => {
        setLoadingSendEmail(false);
      });
  };

  const handleSendTicket = (receiver) => {
    receiverRef.current = receiver;
    handleOpenDrawerConfirmSend();
  };

  return (
    <MSCustomizeDrawerStyled
      title={intl.formatMessage({
        id: 'view.penaltyTicket.ticket',
      })}
      width={'700px'}
      openDrawer={isOpenView}
      onClose={onClose}
    >
      <WrapperPrint ref={componentRef}>
        <div className="displayOnPrint">
          <div className="displayOnPrint-header">
            {intl.formatMessage({
              id: 'view.penaltyTicket.ticket',
            })}
          </div>

          <div>
            {intl.formatMessage({
              id: 'view.penaltyTicket.num',
            })}
            {': '}
            {data?.penaltyTicketId}
          </div>
        </div>

        <div className="infoTicket">
          <table>
            <tbody>
              <tr className="hideOnPrint">
                <td className="infoTicket-label">
                  {intl.formatMessage({
                    id: 'view.penaltyTicket.num',
                  })}
                  :
                </td>
                <td>{data?.penaltyTicketId}</td>
              </tr>
              <tr>
                <td className="infoTicket-label">
                  {intl.formatMessage({
                    id: 'view.penaltyTicket.vehicle_type',
                  })}
                  :
                </td>
                <td>{data?.vehicleType}</td>
              </tr>
              <tr>
                <td className="infoTicket-label">
                  {intl.formatMessage({
                    id: 'view.ai_events.plateNumber',
                  })}
                  :
                </td>
                <td>
                  {data?.plateNumber
                    ? data?.plateNumber
                    : intl.formatMessage({ id: 'view.ai_events.UnKnow' })}
                </td>
              </tr>
              <tr>
                <td className="infoTicket-label">
                  {intl.formatMessage({
                    id: 'view.live.camera_record',
                  })}
                  :
                </td>
                <td>{data?.cameraName}</td>
              </tr>
              <tr>
                <td className="infoTicket-label">
                  {intl.formatMessage({
                    id: 'view.penaltyTicket.violation_datetime',
                  })}
                  :
                </td>
                <td>{moment(data?.createdTime).format('HH:mm DD/MM/YYYY')}</td>
              </tr>
              <tr>
                <td className="infoTicket-label">
                  {intl.formatMessage({
                    id: 'view.penaltyTicket.violation_type',
                  })}
                  :
                </td>
                <td>
                  {intl.formatMessage({
                    id: 'view.ai_events.' + data?.eventType,
                  })}
                </td>
              </tr>
              <tr>
                <td className="infoTicket-label">
                  {intl.formatMessage({
                    id: 'view.storage.address',
                  })}
                  :
                </td>
                <td>{data?.address}</td>
              </tr>
              <tr>
                <td className="infoTicket-label">
                  {intl.formatMessage({
                    id: 'view.penaltyTicket.total_fine',
                  })}
                  :
                </td>
                <td>
                  <span style={{ display: 'inline-flex' }}>
                    <StyledInput
                      placeholder="............................"
                      value={fine}
                      type="number"
                      min={0}
                      onChange={(e) => handleSetFine(e)}
                    />
                    {fine === '' ? (
                      ''
                    ) : (
                      <>
                        <span className="fine">{fine}</span>
                        <span>&nbsp;đồng&nbsp;</span>
                      </>
                    )}
                  </span>
                  (
                  {intl.formatMessage({
                    id: 'view.penaltyTicket.to_text',
                  })}
                  : {toText === '' ? '' : `${toText} đồng`})
                </td>
              </tr>
            </tbody>
          </table>

          {imageViolate && (
            <div className="displayOnPrint-img ">
              <div className="infoTicket-label">
                {intl.formatMessage({
                  id: 'view.penaltyTicket.violation_proof',
                })}
                :
              </div>

              <div>
                <p>
                  {intl.formatMessage({
                    id: 'view.penaltyTicket.violation_img',
                  })}
                  :
                </p>
                <img className="imageViolate-img" src={imageViolate} alt="violation-img" />
              </div>
            </div>
          )}
        </div>

        <Row gutter={[16, 8]} className="imageViolate hideOnPrint" justify="space-between">
          {imageViolate && (
            <Col span={8}>
              <img className="imageViolate-img" src={imageViolate} alt="violation-img" />
            </Col>
          )}

          {plateNumber && (
            <Col span={8}>
              <img className="imageViolate-img" src={plateNumber} alt="violation-img" />
            </Col>
          )}

          {imageVehicle && (
            <Col span={8}>
              <img className="imageViolate-img" src={imageVehicle} alt="violation-img" />
            </Col>
          )}
        </Row>
      </WrapperPrint>

      <div className="container-btnTicket">
        <Button
          icon={<PrinterOutlined />}
          className="btnTicket"
          type="primary"
          onClick={handlePrint}
        >
          {intl.formatMessage({
            id: 'view.penaltyTicket.print_ticket',
          })}
        </Button>

        <Button
          icon={<SendOutlined />}
          className="btnTicket"
          type="default"
          onClick={handleOpenDrawerSendTicket}
        >
          {intl.formatMessage({
            id: 'view.penaltyTicket.send_ticket',
          })}
        </Button>

        <Button icon={<CloseOutlined />} className="btnTicket" type="default" onClick={onClose}>
          {intl.formatMessage({
            id: 'view.common_device.cancel',
          })}
        </Button>
      </div>

      {/* <PopupSendTicket
        isModalVisible={visibleSendTicket}
        handleOk={handleSendTicket}
        handleCancel={handleClosePopupSendTicket}
        loadingSendEmail={loadingSendEmail}
      /> */}

      {visibleSendTicket && (
        <DrawerSendTicket
          isOpenView={visibleSendTicket}
          handleCancel={handleCloseDrawerSendTicket}
          handleOk={handleSendTicket}
          loadingSendEmail={loadingSendEmail}
        />
      )}

      {visibleConfirmSend && (
        <DrawerConfirmSend
          isOpenView={visibleConfirmSend}
          handleCancel={handleCloseDrawerConfirmSend}
          handleOk={sendTicket}
          loadingSendEmail={loadingSendEmail}
        />
      )}

      {visibleConfirmChangeStatus && (
        <DrawerConfirmChangeStatus
          isOpenView={visibleConfirmChangeStatus}
          handleCancel={handleCloseDrawerConfirmChangeStatus}
          handleOk={updateStatusEventAI}
        />
      )}
    </MSCustomizeDrawerStyled>
  );
}

export default DrawerTicket;
