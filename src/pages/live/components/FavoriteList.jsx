import MSCustomizeDrawer from '@/components/Drawer';
import { DeleteOutlined, EditOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Col, Form, Input, Pagination, Row, Tooltip } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import EditNameFavorite from './EditNameFavorite';

const FavoriteList = ({ dispatch, list, metadata, loading, ...props }) => {
  const { title, visible, onClose, initScreen, screen } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const [searchParam, setSearchParam] = useState({
    ...metadata,
    sort_by: 'name',
    order_by: 'asc',
  });
  const [visibleEditName, setVisibleEditName] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState();

  const getListFavorites = (searchParam) => {
    dispatch({
      type: 'favorite/fetchAll',
      payload: searchParam,
    });
  };

  useEffect(() => {
    getListFavorites(searchParam);
  }, []);

  const onPaginationChange = (page, size) => {
    const dataParam = Object.assign({ ...searchParam, page: page });
    setSearchParam(dataParam);
    getListFavorites(dataParam);
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    const dataParam = Object.assign({
      ...searchParam,
      name: value,
      page: 1,
      size: 10,
    });
    getListFavorites(dataParam);
  };

  const handleQuickSearchBlur = (event) => {
    const value = event.target.value.trim();
    form.setFieldsValue({
      name: value,
    });
  };

  const handleQuickSearchPaste = (event) => {
    const value = event.target.value.trimStart();
    form.setFieldsValue({
      name: value,
    });
  };

  return (
    <StyledDrawer
      openDrawer={visible}
      onClose={onClose}
      width={350}
      zIndex={1001}
      placement="right"
      title={title}
    >
      <StyledDrawerContent>
        <Form form={form}>
          <Form.Item name="name" noStyle>
            <Input.Search
              placeholder={intl.formatMessage({
                id: 'view.map.search',
              })}
              onChange={debounce(handleSearch, 1000)}
              onPaste={handleQuickSearchPaste}
              onBlur={handleQuickSearchBlur}
            />
          </Form.Item>
        </Form>

        <StyledWrapper>
          {list &&
            list.map((item, index) => (
              <StyledFavoriteItem justify="space-between" key={index}>
                <Col span={18}>
                  <p
                    className="favorite-name"
                    onClick={() => {
                      initScreen(item);
                      onClose();
                    }}
                  >
                    {item.name}
                  </p>
                </Col>
                <Col span={2}>
                  <Tooltip
                    placement="top"
                    title={intl.formatMessage({
                      id: 'view.common_device.edit',
                    })}
                  >
                    <EditOutlined
                      onClick={() => {
                        setVisibleEditName(true);
                        setSelectedRecord(item);
                      }}
                    />
                  </Tooltip>
                </Col>
                <Col span={2}>
                  <Tooltip
                    placement="top"
                    title={intl.formatMessage({
                      id: 'view.ai_events.delete',
                    })}
                  >
                    <DeleteOutlined
                      onClick={() => dispatch({ type: 'favorite/delete', id: item?.uuid })}
                    />
                  </Tooltip>
                </Col>
                <Col span={2}>
                  {item?.defaultBookmark === 1 ? (
                    <HeartFilled />
                  ) : (
                    <Tooltip
                      placement="topRight"
                      title={intl.formatMessage({
                        id: 'view.user.detail_list.star',
                      })}
                    >
                      <HeartOutlined
                        onClick={() => dispatch({ type: 'favorite/setDefault', id: item?.uuid })}
                      />
                    </Tooltip>
                  )}
                </Col>
              </StyledFavoriteItem>
            ))}
        </StyledWrapper>

        <StyledPagination>
          <Pagination
            size="small"
            pageSize={metadata?.size}
            current={metadata?.page}
            total={metadata?.total}
            onChange={onPaginationChange}
          />
        </StyledPagination>

        {visibleEditName && (
          <EditNameFavorite
            visible={visibleEditName}
            onClose={() => {
              setVisibleEditName(false);
            }}
            selectedRecord={selectedRecord}
            list={list}
            dispatch={dispatch}
            screen={screen}
          />
        )}
      </StyledDrawerContent>
    </StyledDrawer>
  );
};

const StyledDrawer = styled(MSCustomizeDrawer)`
  .ant-drawer-header-title {
    flex: none;
  }

  .ant-card-bordered {
    border: 0;
  }
`;

const StyledDrawerContent = styled.div`
  position: relative;
`;

const StyledWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  height: 700px;
  overflow-y: auto;
  margin: 10px 0;
`;

const StyledFavoriteItem = styled(Row)`
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  flex-wrap: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .ant-col {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;

    .favorite-name {
      margin-bottom: 0;
    }
  }
`;

const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

function mapStateToProps(state) {
  const { list, metadata } = state.favorite;
  return {
    loading: state.loading.models.favorite,
    list,
    metadata,
  };
}

export default connect(mapStateToProps)(FavoriteList);