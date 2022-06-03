import { notify } from '@/components/Notify';
import { filterOption, normalizeOptions } from '@/components/select/CustomSelect';
import ReportApi from '@/services/report/ReportApi';
import UserApi from '@/services/user/UserApi';
import getCurrentLocale from '@/utils/Locale';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Select } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';

const dataType = '';

const ModalTitle = styled.div`
  text-align: center;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalContentRadio = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const ModalContentRadioTitle = styled.span`
  margin-right: 20px;
`;

const FormCustom = styled.div`
  width: 100%;
`;

const ButtonWrapper = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 0 auto;
`;

const ExportReportToMail = (props) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [allEmail, setAllEmail] = useState([]);
  const [message, setMessage] = useState(false);
  const [chooseEmail, setChooseEmail] = useState(true);
  const intl = useIntl();

  useEffect(() => {
    const data = {
      page: 1,
      size: 100000,
    };
    try {
      UserApi.getAllUser(data).then((result) => {
        setAllEmail(result.payload);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const onChange = (e) => {
    setChooseEmail(e.target.value);
    setMessage(false);
    form.resetFields();
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setChooseEmail(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setChooseEmail(true);
  };

  const handleSubmit = async (value) => {
    confirm();
  };

  const renderHeader = (dataType) => {
    let name = intl.formatMessage({
      id: 'pages.report.export.exportReprot',
    });
    return <ModalTitle>{name}</ModalTitle>;
  };

  function confirm() {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'pages.report.export.confirm',
      }),
      content: intl.formatMessage({
        id: 'pages.report.export.contentMessage',
      }),
      okText: intl.formatMessage({
        id: 'pages.report.export.confirm',
      }),
      cancelText: intl.formatMessage({
        id: 'pages.report.export.cancel',
      }),
      onOk: () => {
        handleOk();
        const data = {
          ...props?.filterParams,
          typeChart: 'tableReport',
          lang: getCurrentLocale(),
          emails: form.getFieldsValue().email.toString(),
        };
        ReportApi.getExportDataToMail(data).then((value) => {
          if (value.code == '1300') {
            notify('success', 'noti.success', 'report.export.success');
          } else {
            notify('error', 'noti.faid', 'report.export.failed');
          }
        });
      },
    });
  }

  return (
    <>
      <div onClick={showModal}>
        <SendOutlined />
      </div>
      <Modal
        title={renderHeader(dataType)}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
        width={500}
      >
        <ModalContent>
          <ModalContentRadio>
            <ModalContentRadioTitle>
              {intl.formatMessage({
                id: 'view.penaltyTicket.recipients',
              })}
              :
            </ModalContentRadioTitle>

            <Radio.Group onChange={onChange} value={chooseEmail}>
              <Radio value={true}>
                {intl.formatMessage({
                  id: 'view.penaltyTicket.outside-the-system',
                })}
              </Radio>
              <Radio value={false}>
                {intl.formatMessage({
                  id: 'view.penaltyTicket.leader',
                })}
              </Radio>
            </Radio.Group>
          </ModalContentRadio>

          <Form form={form} onFinish={handleSubmit}>
            {chooseEmail == true ? (
              <FormCustom>
                <Form.Item
                  name={'email'}
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'view.map.required_field',
                      })}`,
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    allowClear={false}
                    showSearch
                    dataSource={allEmail}
                    style={{ width: '100%' }}
                    filterOption={filterOption}
                    options={normalizeOptions('email', 'email', allEmail)}
                    placeholder="Email"
                    maxTagCount={3}
                  />
                </Form.Item>
              </FormCustom>
            ) : (
              <FormCustom>
                <Form.Item
                  name={['email']}
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: `${'view.map.required_field'}`,
                    },
                    () => ({
                      validator(_, value) {
                        //eslint-disable-next-line
                        if (
                          !value ||
                          /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([,](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/.test(
                            value,
                          )
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            intl.formatMessage({
                              id: 'view.penaltyTicket.validate-email',
                            }),
                          ),
                        );
                      },
                    }),
                    {
                      max: 100,
                      message: `${'noti.100_characters_limit'}`,
                    },
                  ]}
                >
                  <Input
                    placeholder="Email"
                    autocomplete="off"
                    onBlur={(e) => {
                      form.setFieldsValue({
                        email: e.target.value.trim(),
                      });
                    }}
                  />
                </Form.Item>
              </FormCustom>
            )}
            <ButtonWrapper>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />} on>
                {intl.formatMessage({
                  id: 'view.penaltyTicket.send-a-ticket',
                })}
              </Button>
              <Button onClick={handleCancel} icon={<CloseOutlined />}>
                {intl.formatMessage({
                  id: 'view.penaltyTicket.cancel-a-ticket',
                })}
              </Button>
            </ButtonWrapper>
          </Form>
        </ModalContent>
      </Modal>
    </>
  );
};

function mapStateToProps(state) {
  return { filterParams: state?.chart?.payload };
}

export default connect(mapStateToProps)(ExportReportToMail);
