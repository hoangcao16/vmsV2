import MSCustomizeDrawer from '@/components/Drawer';
import MSFormItem from '@/components/Form/Item';
import permissionCheck from '@/utils/PermissionCheck';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { LightFilter } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Input, Popconfirm, Row, Select, Space, Switch, Tooltip } from 'antd';
import { connect } from 'dva';
import { useMemo, useState } from 'react';
import UserGroup from './conponnents/user-group';
import UserRole from './conponnents/roles';
import AddUser from './conponnents/AddUser';
import styles from './styles.less';
const { Option } = Select;
const { Search } = Input;
import { useIntl } from 'umi';

const UserList = ({ dispatch, list, metadata }) => {
  const intl = useIntl();

  const [visible, setVisible] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  const handleUpdateStatus = async (e, uuid) => {
    let status;
    if (e) {
      status = 1;
    } else {
      status = 0;
    }

    dispatch({
      type: 'user/patch',
      payload: { id: uuid, values: { status: status } },
    });
  };

  const handleDeleteUser = async (id) => {
    dispatch({
      type: 'user/remove',
      payload: id,
    });
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.list',
      }),
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.phone',
      }),
      dataIndex: 'phone',
    },
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.status',
      }),
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Space>
            <Tooltip
              placement="top"
              title={intl.formatMessage({
                id: 'pages.setting-user.list-user.status',
              })}
            >
              <Switch
                checked={record.status === 1 ? true : false}
                onChange={(e) => handleUpdateStatus(e, record.uuid)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                disabled={!permissionCheck('deactivate_user')}
              />
            </Tooltip>
          </Space>
        );
      },
    },

    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.option',
      }),
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record) => {
        return (
          <>
            <Space>
              {permissionCheck('edit_user') && (
                <Tooltip
                  placement="top"
                  title={intl.formatMessage({
                    id: 'pages.setting-user.list-user.edit',
                  })}
                  arrowPointAtCenter={true}
                >
                  <EditOutlined />
                </Tooltip>
              )}
            </Space>
            <Space>
              {permissionCheck('delete_user') && (
                <Popconfirm
                  title={intl.formatMessage({
                    id: 'pages.setting-user.list-user.delete-confirm',
                  })}
                  onConfirm={() => handleDeleteUser(record.uuid)}
                  cancelText="Cancel"
                  okText="Ok"
                >
                  <Tooltip
                    placement="top"
                    title={intl.formatMessage({
                      id: 'pages.setting-user.list-user.delete',
                    })}
                    arrowPointAtCenter={true}
                  >
                    <DeleteOutlined />
                  </Tooltip>
                </Popconfirm>
              )}
            </Space>
          </>
        );
      },
    },
  ];
  const onPaginationChange = (page, size) => {
    dispatch({
      type: 'user/fetchAllUser',
      payload: {
        page,
        size,
      },
    });
  };

  const handlaExpand = (e) => {
    setVisible(!visible);
  };

  const handleSubmit = () => {
    const a = form.getFieldsValue(true);

    console.log(a);
  };
  const formItemLayout = {
    wrapperCol: { span: 24 },
    labelCol: { span: 24 },
  };

  const RenderFilter = () => {
    return (
      <>
        <Form layout="horizontal" form={form} onFinish={handleSubmit} {...formItemLayout}>
          <Row gutter={16} span={24} className={styles.expandRow}>
            <Col span={18}>
              <MSFormItem type="input" name="name" minLength={5} maxLength={255} required={true}>
                <Search />
              </MSFormItem>
            </Col>
            <Col span={6}>
              <h4 onClick={handlaExpand}>{visible ? 'Ẩn bộ lọc' : 'Thêm bộ lọc'}</h4>
            </Col>
          </Row>

          {visible && (
            <div className={styles.formExpand}>
              <Row gutter={16}>
                <Col className="gutter-row" span={12}>
                  <MSFormItem label="Chức vụ" type="input" name="test">
                    <Select />
                  </MSFormItem>
                </Col>
                <Col className="gutter-row" span={12}>
                  <MSFormItem label="Vai trò" type="input" name="test1">
                    <Select />
                  </MSFormItem>
                </Col>
                <Col className="gutter-row" span={12}>
                  <MSFormItem label="Đơn vị" type="input" name="test2">
                    <Select />
                  </MSFormItem>
                </Col>
                <Col className="gutter-row" span={12}>
                  <MSFormItem label="Nhóm người dùng" type="input" name="test3">
                    <Select />
                  </MSFormItem>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </>
    );
  };

  return (
    <PageContainer>
      <ProTable
        // loading={loading}
        headerTitle={intl.formatMessage({
          id: 'pages.setting-user.list-user.list',
        })}
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
        rowSelection={{}}
        options={false}
        toolbar={{
          multipleLine: true,
          filter: (
            <LightFilter wrapperCol={24}>
              <RenderFilter />
            </LightFilter>
          ),
          actions: [
            <UserGroup key="user-group" />,
            <UserRole key="user-role" />,
            <Button key="add" type="primary" onClick={showDrawer}>
              <PlusOutlined />
              {intl.formatMessage({
                id: 'pages.setting-user.list-user.new-user',
              })}
            </Button>,
          ],
          style: { width: '100%' },
        }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) =>
            `${intl.formatMessage({
              id: 'pages.setting-user.list-user.total',
            })} ${total} ${intl.formatMessage({
              id: 'pages.setting-user.list-user.user',
            })}`,
          total: metadata?.total,
          onChange: onPaginationChange,
          pageSize: metadata?.size,
          current: metadata?.page,
        }}
      />
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={'20%'}
          zIndex={1001}
          title={intl.formatMessage({
            id: 'pages.setting-user.list-user.new-user',
          })}
          placement="right"
        >
          <AddUser onClose={onClose} />
        </MSCustomizeDrawer>
      )}
    </PageContainer>
  );
};
function mapStateToProps(state) {
  const { list, metadata } = state.user;
  return {
    loading: state.loading.models.user,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(UserList);
