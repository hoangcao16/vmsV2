/* eslint-disable react-hooks/exhaustive-deps */
import { connect } from 'dva';
import { StyledDrawer } from './style';
import { Space, Button, Form, Row, Col, Input, Select, Tooltip } from 'antd';
import ProTable from '@ant-design/pro-table';
import { normalizeOptions } from '@/components/select/CustomSelect';
import { useIntl } from 'umi';
import isEmpty from 'lodash/isEmpty';
import { SaveOutlined, CloseOutlined, PlusSquareOutlined } from '@ant-design/icons';
const formItemLayout = {
  wrapperCol: { span: 24 },
  labelCol: { span: 24 },
};
const ScanCamera = ({
  isScanDrawer,
  setIsScanDrawer,
  dispatch,
  loading,
  list,
  zonesOptions,
  handleAddCameraScan,
}) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const onClose = () => {
    setIsScanDrawer(false);
    form.resetFields();
    dispatch({
      type: 'scanCamera/save',
      payload: [],
    });
  };
  const handleSubmit = async (value) => {
    const payload = {
      ...value,
    };
    const payloadConverted = {
      ipStrip: `${payload.p1}-${payload.p2}`,
      zoneUuid: payload?.zoneUuid,
      page: 0,
      size: 10,
    };
    dispatch({
      type: 'scanCamera/scanAllCamera',
      payload: payloadConverted,
    });
  };
  const handleAdd = (record) => {
    handleAddCameraScan(record?.ip);
  };
  const columns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: '30%',
    },
    {
      title: intl.formatMessage({ id: 'noti.device_type' }),
      dataIndex: 'type',
      key: 'type',
      width: '60%',
      render(text) {
        return text === 'camera'
          ? intl.formatMessage({ id: 'camera' })
          : intl.formatMessage({ id: 'noti.unknown_device' });
      },
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Tooltip
          placement="rightTop"
          title={intl.formatMessage(
            { id: 'view.camera.add_new_camera' },
            {
              cam: intl.formatMessage({ id: 'camera' }),
              add: intl.formatMessage({ id: 'add' }),
            },
          )}
        >
          <PlusSquareOutlined className="plusIcon" onClick={() => handleAdd(record)} />
        </Tooltip>
      ),
    },
  ];
  return (
    <StyledDrawer
      openDrawer={isScanDrawer}
      onClose={onClose}
      width={'80%'}
      zIndex={1000}
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
      <p>{intl.formatMessage({ id: 'view.camera.filter_camera_by' })}</p>
      <Form className="" form={form} onFinish={handleSubmit} {...formItemLayout}>
        <Row gutter={24}>
          <Col span={7}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name={['p1']}
                  label={intl.formatMessage({ id: 'view.camera.IP1_range' })}
                  rules={[
                    {
                      required: true,
                      message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        const data = getFieldValue(['p1']);
                        var ipformat =
                          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                        if (data) {
                          if (!data.match(ipformat)) {
                            return Promise.reject(
                              `${intl.formatMessage({ id: 'view.map.ip1_error' })}`,
                            );
                          } else {
                            return Promise.resolve();
                          }
                        } else {
                          return Promise.resolve(
                            `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                          );
                        }
                      },
                    }),
                  ]}
                >
                  <Input
                    placeholder={intl.formatMessage({ id: 'view.camera.IP1_range' })}
                    maxLength={255}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={7}>
            <Form.Item
              name={['p2']}
              label={intl.formatMessage({ id: 'view.camera.IP2_range' })}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const data = getFieldValue(['p2']);
                    const data1 = getFieldValue(['p1']);
                    var ipformat =
                      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                    if (data) {
                      if (!data.match(ipformat)) {
                        return Promise.reject(
                          `${intl.formatMessage({ id: 'view.map.ip2_error' })}`,
                        );
                      } else if (
                        data?.split('.')?.length === 4 &&
                        data1?.split('.')?.length === 4
                      ) {
                        const [ip2_octet1, ip2_octet2, ip2_octet3, ip2_octet4] = data
                          ?.split('.')
                          ?.map((value) => Number(value));
                        const [ip1_octet1, ip1_octet2, ip1_octet3, ip1_octet4] = data1
                          ?.split('.')
                          ?.map((value) => Number(value));
                        const ip1_total =
                          ip1_octet4 +
                          ip1_octet3 * 256 +
                          ip1_octet2 * 256 * 256 +
                          ip1_octet1 * 256 * 256 * 256;
                        const ip2_total =
                          ip2_octet4 +
                          ip2_octet3 * 256 +
                          ip2_octet2 * 256 * 256 +
                          ip2_octet1 * 256 * 256 * 256;
                        if (ip1_total > ip2_total) {
                          return Promise.reject(
                            `${intl.formatMessage({ id: 'noti.start_ip_less_end_ip' })}`,
                          );
                        } else {
                          return Promise.resolve();
                        }
                      } else {
                        return Promise.resolve();
                      }
                    } else {
                      return Promise.resolve(
                        `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                      );
                    }
                  },
                }),
              ]}
            >
              <Input
                placeholder={intl.formatMessage({ id: 'view.camera.IP2_range' })}
                maxLength={255}
              />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              name={['zoneUuid']}
              label={intl.formatMessage({ id: 'view.camera.choose_zone' })}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({ id: 'view.map.required_field' })}`,
                },
              ]}
            >
              <Select
                showSearch
                options={normalizeOptions('name', 'uuid', zonesOptions)}
                placeholder={intl.formatMessage(
                  {
                    id: 'view.map.choose_zone',
                  },
                  {
                    plsEnter: intl.formatMessage({
                      id: 'please_enter',
                    }),
                  },
                )}
                allowClear
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item className="btn-submit">
              <Button type="primary" htmlType="submit ">
                {loading ? 'Loading...' : intl.formatMessage({ id: 'view.user.detail_list.scan' })}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {!isEmpty(list) && (
        <ProTable
          headerTitle={intl.formatMessage({ id: 'view.camera.scannable_camera' })}
          dataSource={list}
          columns={columns}
          rowKey="ip"
          search={false}
          pagination={false}
          options={false}
        />
      )}
    </StyledDrawer>
  );
};
function mapStateToProps(state) {
  const { list } = state.scanCamera;
  const { zonesOptions } = state.globalstore;
  return {
    loading: state.loading.models.scanCamera,
    list,
    zonesOptions,
  };
}
export default connect(mapStateToProps)(ScanCamera);
