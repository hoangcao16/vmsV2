import eventFilesApi from '@/services/storage-api/eventFilesApi';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import { MSCustomizeDrawerStyled } from './style';

function DrawerSetEventFile({
  isOpenView,
  handleCancel,
  handleSetEventFile,
  loadingSetEvent,
  fileSetEvent,
}) {
  const intl = useIntl();
  const [form] = Form.useForm();

  const [eventList, setEventList] = useState([]);

  const handleSave = () => {
    form.submit();
  };

  const onFinish = (values) => {
    const event = eventList.find((e) => e.uuid === values.eventType);
    handleSetEventFile(event);
  };

  const getEventList = () => {
    eventFilesApi
      .getEventList({ page: 0, size: 1000000, sort_by: 'name', order_by: 'asc' })
      .then((res) => {
        setEventList(res.payload);
      });
  };

  useEffect(() => {
    if (isOpenView) {
      getEventList();
      form.resetFields();

      const select = fileSetEvent.eventUuid;
      if (select && select.length > 0) {
        form.setFieldsValue({
          eventType: select,
        });
      }
    }
  }, [isOpenView]);

  return (
    <MSCustomizeDrawerStyled
      openDrawer={isOpenView}
      onClose={() => {
        form.resetFields();
        handleCancel();
      }}
      zIndex={1005}
      width={496}
      getContainer={<body />}
      extra={
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loadingSetEvent}
          >
            {intl.formatMessage({
              id: 'view.storage.save_note',
            })}
          </Button>

          <Button
            onClick={() => {
              form.resetFields();
              handleCancel();
            }}
            icon={<CloseOutlined />}
          >
            {intl.formatMessage({
              id: 'view.user.detail_list.cancel',
            })}
          </Button>
        </Space>
      }
    >
      <Wrapper>
        <Form
          name="SendTicket"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          layout={'vertical'}
        >
          <Form.Item
            label=""
            name="eventType"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'view.penaltyTicket.select-recipients',
                }),
              },
            ]}
          >
            <Select
              placeholder={intl.formatMessage({
                id: 'view.category.event_type',
              })}
            >
              {eventList.map((event) => (
                <Select.Option key={event.id} value={event.uuid}>
                  {event.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Wrapper>
    </MSCustomizeDrawerStyled>
  );
}

export default DrawerSetEventFile;

export const Wrapper = styled.div``;
