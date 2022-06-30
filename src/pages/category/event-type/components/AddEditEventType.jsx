import MSFormItem from '@/components/Form/Item';
import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popconfirm, Row, Select, Space } from 'antd';
import { isEmpty } from 'lodash';
import { useIntl } from 'umi';
import { StyledDrawer } from '../style';

const AddEditEventType = ({
  onClose,
  selectedRecord,
  dispatch,
  openDrawer,
  resetForm,
  listField,
  searchParam,
  setSearchParam,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleSubmit = (value) => {
    const payload = {
      ...value,
    };

    if (isEmpty(selectedRecord)) {
      dispatch({
        type: 'eventType/add',
        payload: payload,
      });
    } else {
      dispatch({
        type: 'eventType/edit',
        payload: { id: selectedRecord?.uuid, values: { ...payload } },
      });
    }

    setSearchParam({ ...searchParam, name: '' });
    resetForm();
    onClose();
  };

  const onDeleteRecord = () => {
    dispatch({ type: 'eventType/delete', id: selectedRecord?.uuid });
    setSearchParam({ ...searchParam, name: '' });
    resetForm();
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
          {!isEmpty(selectedRecord) && (
            <Popconfirm
              placement="bottom"
              title={intl.formatMessage({ id: 'noti.delete' })}
              onConfirm={onDeleteRecord}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>
                <DeleteOutlined />
                {intl.formatMessage({ id: 'delete' })}
              </Button>
            </Popconfirm>
          )}
          <Button onClick={onClose}>
            <CloseOutlined />
            {intl.formatMessage({ id: 'view.map.cancel' })}
          </Button>
        </Space>
      }
    >
      <Card
        title={
          isEmpty(selectedRecord)
            ? intl.formatMessage({ id: 'view.camera.add_new' })
            : intl.formatMessage({ id: 'view.common_device.edit' })
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={selectedRecord ?? {}}
        >
          <Row gutter={24}>
            <Col span={24}>
              <MSFormItem
                label={`${intl.formatMessage({
                  id: `view.category.event_type`,
                })}`}
                type="input"
                name={'name'}
                maxLength={255}
                required={true}
              >
                <Input />
              </MSFormItem>
            </Col>
            <Col span={24}>
              <MSFormItem
                label={`${intl.formatMessage({
                  id: `view.category.field`,
                })}`}
                type="select"
                name={'fieldUuid'}
                required={true}
              >
                <Select
                  placeholder={`${intl.formatMessage({
                    id: `view.category.choose_field_for_event`,
                  })}`}
                  options={listField?.map((s) => ({
                    value: s.uuid,
                    label: s.name,
                  }))}
                />
              </MSFormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </StyledDrawer>
  );
};

export default AddEditEventType;
