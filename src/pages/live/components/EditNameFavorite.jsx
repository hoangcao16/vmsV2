import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import styled from 'styled-components';
import { useIntl } from 'umi';

const EditNameFavorite = ({ visible, onClose, selectedRecord, list, dispatch, screen }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleSubmit = () => {
    const value = form.getFieldValue().name;
    const data = Object.assign({
      id: selectedRecord?.uuid,
      cameraUuids: selectedRecord?.cameraUuids,
      name: value,
      // defaultBookmark: selectedRecord?.defaultBookmark,
      gridType: selectedRecord?.gridType,
      viewTypes: selectedRecord?.viewTypes,
    });

    dispatch({
      type: 'favorite/update',
      payload: { id: selectedRecord?.uuid, values: data },
    });
    if (selectedRecord?.name === screen?.name) {
      dispatch({
        type: 'live/saveScreen',
        payload: {
          name: value,
        },
      });
    }

    onClose();
  };

  return (
    <StyledDrawer
      visible={visible}
      onClose={onClose}
      width={350}
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
      <Card title={intl.formatMessage({ id: 'pages.live-mode.action.edit-favorite' })}>
        <Form layout="vertical" form={form} onFinish={handleSubmit} initialValues={selectedRecord}>
          <Row gutter={24}>
            <Col span={24}>
              <MSFormItem
                label={intl.formatMessage({ id: 'components.bookmark.screen_name' })}
                type="input"
                name="name"
                maxLength={255}
                required={true}
                rules={[
                  () => ({
                    validator(_, value) {
                      const listFilter = list.filter((item) => item?.uuid !== selectedRecord?.uuid);
                      const checkName = listFilter.some((item) => item?.name === value);

                      if (checkName) {
                        return Promise.reject(
                          new Error(
                            intl.formatMessage({ id: 'pages.live-mode.noti.name-already' }),
                          ),
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={intl.formatMessage({ id: 'components.bookmark.enter_screen_name' })}
                />
              </MSFormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    </StyledDrawer>
  );
};

export const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header {
    flex-direction: row-reverse;
  }

  .ant-drawer-header-title {
    flex: none;
  }
  .ant-drawer-body {
    padding: 0;
  }
  .ant-card-bordered {
    border: 0;
  }
`;

export default EditNameFavorite;
