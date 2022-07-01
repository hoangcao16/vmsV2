import MSFormItem from '@/components/Form/Item';
import { STORAGE } from '@/constants/common';
import { SpanCode } from '@/pages/category/camera/style';
import permissionCheck from '@/utils/PermissionCheck';
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  RightOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { AutoComplete, Button, Col, Form, Row, Select, Space, Switch, Tooltip } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import UserRole from './conponnents/roles';
import UserGroup from './conponnents/user-group';
import AddEditUser from './conponnents/user/AddEditUser';
import { ContainerFilter } from './style';

const layoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const UserList = ({
  dispatch,
  list,
  metadata,
  dataListAllRole,
  dataListAllUserGroup,
  dataListAllUnit,
  dataListAllPosition,
  loading,
}) => {
  const intl = useIntl();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [form] = Form.useForm();
  const [collapse, setCollapse] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch({
      type: 'user/fetchAllUser',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
      },
    });

    dispatch({
      type: 'user/getDataForFilter',
      payload: {
        page: metadata?.page,
        size: metadata?.size,
      },
    });
  }, []);

  const showDrawer = (record) => {
    setOpenDrawer(true);
    setSelectedRecord(record);
  };
  const onClose = () => {
    setOpenDrawer(false);
    setSelectedRecord(null);
    dispatch({
      type: 'user/removeUserUuid',
    });
    localStorage.removeItem(STORAGE.USER_UUID_SELECTED);
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
    setOpenDrawer(false);
  };

  const columns = [
    {
      title: intl.formatMessage({
        id: 'pages.setting-user.list-user.name',
      }),
      dataIndex: 'name',
      render: (text) => {
        return <SpanCode>{text}</SpanCode>;
      },
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
      title: intl.formatMessage({ id: 'view.user.detail_list.position' }),
      dataIndex: 'position',
    },
    {
      title: intl.formatMessage({ id: 'view.user.detail_list.unit' }),
      dataIndex: 'unit',
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
  ];
  const onPaginationChange = (page, size) => {
    const filters = form.getFieldValue();
    dispatch({
      type: 'user/fetchAllUser',
      payload: {
        page,
        size,
        ...filters,
      },
    });
  };

  const onChangeData = async (e) => {
    const filters = form.getFieldValue();
    dispatch({
      type: 'user/fetchAllUser',
      payload: {
        ...filters,
        page: 1,
        size: 10,
      },
    });
  };

  const handleSubmit = () => {
    const a = form.getFieldsValue(true);
  };

  // const handleQuickSearchPaste = (event) => {
  //   const value = event.target.value.trimStart();
  //   form.setFieldsValue({
  //     searchValue: value,
  //   });
  // };

  // const handleQuickSearchBlur = (event) => {
  //   const value = event.target.value.trim();
  //   form.setFieldsValue({
  //     searchValue: value,
  //   });
  // };

  const handleSearch = async (value) => {
    const filters = form.getFieldValue();
    setSearch(value);
    if (search !== null) {
      dispatch({
        type: 'user/fetchAllUser',
        payload: {
          ...filters,
          searchValue: value,
          page: 1,
          size: 10,
        },
      });
    }
  };

  const handleShowFilter = () => {
    form.resetFields();
    const filters = form.getFieldValue();

    setCollapse(false);
    setSearch('');
    dispatch({
      type: 'user/fetchAllUser',
      payload: {
        ...filters,
        searchValue: '',
        page: 1,
        size: 10,
      },
    });
  };

  return (
    <PageContainer>
      <ProTable
        loading={loading}
        headerTitle={intl.formatMessage({
          id: 'pages.setting-user.list-user.list',
        })}
        rowKey="id"
        search={false}
        dataSource={list}
        columns={columns}
        options={false}
        onRow={(record, recordIndex) => {
          return {
            onClick: (event) => {
              if (event.target.nodeName !== 'DIV') {
                permissionCheck('edit_user') && showDrawer(record);
                localStorage.setItem(STORAGE.USER_UUID_SELECTED, record.uuid);
              }
            },
          };
        }}
        toolbar={{
          multipleLine: true,
          filter: (
            <ContainerFilter>
              <Form
                className=""
                name="basic"
                onFinish={handleSubmit}
                autoComplete="off"
                form={form}
              >
                <div className="collapse-filter">
                  <MSFormItem type="input" maxLength={255} name="searchValue">
                    <AutoComplete
                      placeholder={intl.formatMessage({
                        id: 'pages.setting-user.list-user.user-search',
                      })}
                      onSearch={debounce(handleSearch, 1000)}
                      disabled={!collapse}
                      onBlur={(e) => {
                        form.setFieldsValue({
                          searchValue: e.target.value.trim(),
                        });
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        form.setFieldsValue({
                          searchValue: e.clipboardData.getData('text').trim(),
                        });
                      }}
                    />
                  </MSFormItem>

                  {collapse === true && (
                    <Button type="link" onClick={handleShowFilter}>
                      {intl.formatMessage({
                        id: 'view.storage.filter',
                      })}{' '}
                      <RightOutlined />
                    </Button>
                  )}

                  {collapse === false && (
                    <Button
                      type="link"
                      onClick={(e) => {
                        setCollapse(true);
                        form.resetFields();
                        onChangeData(e);
                      }}
                    >
                      {intl.formatMessage({
                        id: 'view.storage.hide_filter',
                      })}{' '}
                      <DownOutlined />
                    </Button>
                  )}
                </div>

                {collapse === false && (
                  <div className="extra-filter">
                    <Row justify="space-between">
                      <Col span={12}>
                        <Form.Item
                          {...layoutLong}
                          label={intl.formatMessage({
                            id: 'pages.setting-user.list-user.unit',
                          })}
                          name="unit"
                        >
                          <Select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(e) => onChangeData(e)}
                            filterSort={(optionA, optionB) =>
                              optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
                            }
                          >
                            {dataListAllUnit?.map((item) => (
                              <Select.Option key={item} value={item}>
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          {...layoutLong}
                          label={intl.formatMessage({
                            id: 'pages.setting-user.list-user.position',
                          })}
                          name="position"
                        >
                          <Select
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(e) => onChangeData(e)}
                            filterSort={(optionA, optionB) =>
                              optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
                            }
                          >
                            {dataListAllPosition?.map((item) => (
                              <Select.Option key={item} value={item}>
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          {...layoutLong}
                          label={intl.formatMessage({
                            id: 'pages.setting-user.list-user.role',
                          })}
                          name="role"
                        >
                          <Select
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(e) => onChangeData(e)}
                            filterSort={(optionA, optionB) =>
                              optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
                            }
                          >
                            {dataListAllRole?.map((item) => (
                              <Select.Option key={item.name} value={item.uuid}>
                                {item.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...layoutLong}
                          label={intl.formatMessage({
                            id: 'pages.setting-user.list-user.group-user',
                          })}
                          name="group"
                        >
                          <Select
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(e) => onChangeData(e)}
                            filterSort={(optionA, optionB) =>
                              optionA.key.toLowerCase().localeCompare(optionB.key.toLowerCase())
                            }
                          >
                            {dataListAllUserGroup?.map((item) => (
                              <Select.Option key={item.name} value={item.uuid}>
                                {item.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </Form>
            </ContainerFilter>
          ),
          actions: [
            <UserRole key="user-role" />,
            <UserGroup key="user-group" />,
            <Button key="add" type="primary" onClick={() => showDrawer(null)}>
              <UserAddOutlined />
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
        <AddEditUser
          openDrawer={openDrawer}
          onClose={onClose}
          selectedRecord={selectedRecord}
          handleDeleteUser={handleDeleteUser}
        />
      )}
    </PageContainer>
  );
};
function mapStateToProps(state) {
  const { list, metadata, dataForFilter } = state.user;

  return {
    loading: state.loading.models.user,
    list,
    metadata,
    dataListAllRole: dataForFilter?.dataListAllRole,
    dataListAllUserGroup: dataForFilter?.dataListAllUserGroup,
    dataListAllUnit: dataForFilter?.dataListAllUnit,
    dataListAllPosition: dataForFilter?.dataListAllPosition,
  };
}

export default connect(mapStateToProps)(UserList);
