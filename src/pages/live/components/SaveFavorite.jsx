import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import styled from 'styled-components';
import { useIntl } from 'umi';

const SaveFavorite = ({ visible, onClose, list, dispatch, gridType, grids }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const getCameraUuids = (grids) => {
    let gridUuids = [];
    let gridEmpty = [];
    grids.map((item) => {
      gridUuids.push(item.uuid);
    });
    for (let index = grids.length; index < 16; index++) {
      gridEmpty.push('');
    }
    return [...gridUuids, ...gridEmpty];
  };

  const handleSubmit = () => {
    const value = form.getFieldValue('name');
    const cameraUuids = getCameraUuids(grids);
    const viewTypes = grids.map((item) => {
      return item?.uuid === '' ? '' : 'live';
    });
    const data = Object.assign({
      cameraUuids: cameraUuids,
      name: value,
      gridType: gridType,
      viewTypes: viewTypes,
    });

    dispatch({
      type: 'favorite/add',
      values: data,
    });
    onClose();
  };

  return (
    <StyledDrawer
      visible={visible}
      onClose={() => {
        onClose();
      }}
      width={450}
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
          <Button
            onClick={() => {
              onClose();
            }}
          >
            <CloseOutlined />
            {intl.formatMessage({ id: 'view.map.cancel' })}
          </Button>
        </Space>
      }
    >
      <Card title={intl.formatMessage({ id: 'pages.live-mode.action.add-favorite' })}>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
                      const checkName = list.some((item) => item?.name === value);

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

export default SaveFavorite;
