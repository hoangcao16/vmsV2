import MSFormItem from '@/components/Form/Item';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import { useIntl } from 'umi';
import { StyledDrawer } from '../../style';

const { TextArea } = Input;

const EditNVR = ({
  selectedNVREdit,
  onClose,
  dispatch,
  openDrawer,
  searchParam,
  setSearchParam,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const handleSubmit = (value) => {
    dispatch({
      type: 'nvr/editNVR',
      payload: { id: selectedNVREdit.uuid, values: { ...value } },
    });

    setSearchParam({ ...searchParam, name: '' });
    onClose();
  };

  return (
    <StyledDrawer
      openDrawer={openDrawer}
      onClose={onClose}
      width={'30%'}
      zIndex={1001}
      placement="right"
      extra={
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              form.submit();
            }}
          >
            <SaveOutlined />
            {intl.formatMessage({ id: 'view.map.button_save' })}
          </Button>
          <Button onClick={onClose}>
            <CloseOutlined />
            {intl.formatMessage({ id: 'view.map.cancel' })}
          </Button>
        </Space>
      }
    >
      <Card
        title={`${intl.formatMessage({
          id: 'view.common_device.edit_nvr',
        })}`}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit} initialValues={selectedNVREdit}>
          <Row gutter={16}>
            <Col span={24}>
              <MSFormItem
                label={`${intl.formatMessage({
                  id: 'view.common_device.nvr_name',
                })}`}
                type="input"
                name="name"
                minLength={5}
                maxLength={255}
                required={true}
              >
                <Input />
              </MSFormItem>
            </Col>
            <Col span={24}>
              <MSFormItem
                label={`${intl.formatMessage({
                  id: 'view.common_device.note',
                })}`}
                type="input"
                name="note"
                minLength={5}
                maxLength={255}
                required={true}
              >
                <TextArea rows={2} />
              </MSFormItem>
            </Col>
            <Col span={24}>
              <MSFormItem
                label={`${intl.formatMessage({
                  id: 'view.common_device.desc',
                })}`}
                type="input"
                name="description"
                minLength={5}
                maxLength={255}
                required={true}
              >
                <TextArea rows={2} />
              </MSFormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </StyledDrawer>
  );
};

export default EditNVR;
