import { notify } from '@/components/Notify';
import { validateEmail } from '@/utils/Validate';
import { CloseOutlined, NotificationOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select } from 'antd';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { StyledCard } from '../style';

const EmailConfig = ({ listAllEmail, listEmail, loading, dispatch }) => {
  const intl = useIntl();
  const [emails, setEmails] = useState([]);
  const render = (name, id) => {
    return <div className="d-flex">{name}</div>;
  };

  useEffect(() => {
    if (!loading) {
      setEmails(listEmail?.email);
    }
  }, [loading]);

  const titleCard = (
    <Row>
      <Col span={1} className="icon">
        <NotificationOutlined />
      </Col>
      <Col span={23} className="title">
        <h4>{intl.formatMessage({ id: 'view.storage.email_sending_to_users_setting' })}</h4>
        <p>{intl.formatMessage({ id: 'view.storage.email_sending_to_users_setting_desc' })}</p>
      </Col>
    </Row>
  );

  const onChange = (value) => {
    if (isEmpty(value)) {
      setEmails([]);
    } else {
      const checkEmail = value.filter((v) => {
        let isCheck = validateEmail(v);
        return isCheck;
      });

      if (checkEmail.length < value.length) {
        notify('error', 'noti.faid', 'noti.delete_illegal_email');
        setEmails(checkEmail);
        return;
      } else {
        setEmails(value);
      }
    }
  };

  const cancel = () => {
    dispatch({ type: 'setting/fetchEmailConfig' });
  };
  const confirm = () => {
    dispatch({ type: 'setting/updateEmail', payload: emails });
  };

  return (
    <>
      <StyledCard
        title={titleCard}
        extra={
          <>
            <Button key="close" className="cancel" onClick={cancel}>
              <CloseOutlined />
              {intl.formatMessage({ id: 'view.map.cancel' })}
            </Button>
            <Button
              type="primary"
              className="save"
              key="save"
              // disabled={checkHandleSubmit}
              onClick={confirm}
            >
              <SaveOutlined />
              {intl.formatMessage({ id: 'view.map.button_save' })}
            </Button>
          </>
        }
      >
        <Row>
          <Col className="label">
            <p>{intl.formatMessage({ id: 'view.storage.email_received' })} :</p>
          </Col>
          <Col span={12}>
            <Select
              mode="tags"
              showArrow
              value={emails}
              onChange={onChange}
              options={listAllEmail?.map((g) => ({
                value: g,
                label: render(g, g),
              }))}
            />
          </Col>
        </Row>
      </StyledCard>
    </>
  );
};

export default EmailConfig;
