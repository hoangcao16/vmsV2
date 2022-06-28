import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useIntl } from 'umi';
import { MSCustomizeDrawerStyled } from './style';

function DrawerConfirmSend({ isOpenView, handleCancel, handleOk, loadingSendEmail }) {
  const intl = useIntl();

  return (
    <MSCustomizeDrawerStyled
      openDrawer={isOpenView}
      onClose={handleCancel}
      zIndex={1003}
      getContainer={<body />}
      extra={
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            onClick={handleOk}
            loading={loadingSendEmail}
          >
            {intl.formatMessage({
              id: 'view.penaltyTicket.send',
            })}
          </Button>

          <Button className="sendTicket-btnCancel" onClick={handleCancel} icon={<CloseOutlined />}>
            {intl.formatMessage({
              id: 'view.penaltyTicket.cancel-a-ticket',
            })}
          </Button>
        </Space>
      }
    >
      <div className="confirmSend-header">
        {intl.formatMessage({
          id: 'view.penaltyTicket.confirm_send',
        })}
      </div>
    </MSCustomizeDrawerStyled>
  );
}

export default DrawerConfirmSend;
