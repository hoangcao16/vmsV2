import MSFormItem from '@/components/Form/Item';
import { CloseOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Popconfirm, Row, Space } from 'antd';
import { isEmpty } from 'lodash';
import { useIntl } from 'umi';
import { StyledDrawer } from '../../style';

const AddEditCameraCategory = ({
  onClose,
  selectedRecord,
  dispatch,
  openDrawer,
  type,
  resetForm,
  searchParam,
  setSearchParam,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleSubmit = async (value) => {
    const payload = {
      ...value,
    };

    if (type === 'camera_vendor') {
      if (isEmpty(selectedRecord)) {
        await dispatch({
          type: 'cameraCategory/addVendor',
          payload: payload,
        });
      } else {
        await dispatch({
          type: 'cameraCategory/editVendor',
          payload: { id: selectedRecord?.uuid, values: { ...payload } },
        });
      }
      dispatch({
        type: 'globalstore/fetchAllVendors',
        payload: { size: 1000 },
      });
    } else if (type === 'camera_type') {
      if (isEmpty(selectedRecord)) {
        await dispatch({
          type: 'cameraCategory/addType',
          payload: payload,
        });
      } else {
        await dispatch({
          type: 'cameraCategory/editType',
          payload: { id: selectedRecord?.uuid, values: { ...payload } },
        });
      }
      dispatch({
        type: 'globalstore/fetchAllCameraTypes',
        payload: { size: 1000 },
      });
    } else if (type === 'camera_tags') {
      if (isEmpty(selectedRecord)) {
        await dispatch({
          type: 'cameraCategory/addTags',
          payload: payload,
        });
      } else {
        await dispatch({
          type: 'cameraCategory/editTags',
          payload: { id: selectedRecord?.uuid, values: { ...payload } },
        });
      }
      dispatch({
        type: 'globalstore/fetchAllTags',
        payload: { size: 1000 },
      });
    }

    if (type === 'camera_tags') {
      setSearchParam({ ...searchParam, key: '' });
    } else {
      setSearchParam({ ...searchParam, name: '' });
    }

    resetForm();
    onClose();
  };

  const onDeleteRecord = async () => {
    if (type === 'camera_vendor') {
      await dispatch({
        type: 'cameraCategory/deleteVendor',
        id: selectedRecord?.uuid,
      });
      dispatch({
        type: 'globalstore/fetchAllVendors',
        payload: { size: 1000 },
      });
    } else if (type === 'camera_type') {
      await dispatch({
        type: 'cameraCategory/deleteType',
        id: selectedRecord?.uuid,
      });
      dispatch({
        type: 'globalstore/fetchAllCameraTypes',
        payload: { size: 1000 },
      });
    } else if (type === 'camera_tags') {
      await dispatch({
        type: 'cameraCategory/deleteTags',
        id: selectedRecord?.uuid,
      });
      dispatch({
        type: 'globalstore/fetchAllTags',
        payload: { size: 1000 },
      });
    }

    if (type === 'camera_tags') {
      setSearchParam({ ...searchParam, key: '' });
    } else {
      setSearchParam({ ...searchParam, name: '' });
    }
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
                label={`${intl.formatMessage(
                  {
                    id: `view.${
                      type === 'camera_vendor'
                        ? 'category.camera_vendor'
                        : type === 'camera_type'
                        ? 'camera.camera_type'
                        : 'category.tags'
                    }`,
                  },
                  {
                    cam: intl.formatMessage({
                      id: 'camera',
                    }),
                  },
                )}`}
                type="input"
                name={type === 'camera_tags' ? 'key' : 'name'}
                maxLength={255}
                required={true}
              >
                <Input />
              </MSFormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </StyledDrawer>
  );
};

export default AddEditCameraCategory;
