import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useIntl } from 'umi';
import { MSCustomizeDrawerStyled } from './style';

function DrawerConfirmChangeStatus({ isOpenView, handleCancel, handleOk }) {
  const intl = useIntl();

  return (
    <MSCustomizeDrawerStyled
      openDrawer={isOpenView}
      onClose={handleCancel}
      zIndex={1004}
      extra={
        <Space>
          <Button type="primary" htmlType="submit" icon={<SendOutlined />} onClick={handleOk}>
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
      <div className="confirmChange-header">
        {intl.formatMessage({
          id: 'view.penaltyTicket.confirm_update_status',
        })}
      </div>
    </MSCustomizeDrawerStyled>
  );
}

export default DrawerConfirmChangeStatus;
