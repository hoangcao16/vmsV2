import MSCustomizeDrawer from '@/components/Drawer';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Col, Form, Input, Pagination, Row, Tooltip } from 'antd';
import { connect } from 'dva';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'umi';
import EditNameFavorite from './EditNameFavorite';

const FavoriteList = ({ dispatch, list, metadata, loading, ...props }) => {
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
    // <StyledCard
    //   {...props}
    //   bordered={false}
    //   extra={
    //     props.visible && (
    //       <Button type="text" onClick={props.onClose}>
    //         <CloseOutlined />
    //       </Button>
    //     )
    //   }
    // >
    //   <Form form={form}>
    //     <Form.Item name="name" noStyle>
    //       <Input.Search
    //         placeholder={intl.formatMessage({
    //           id: 'view.map.search',
    //         })}
    //         onChange={debounce(handleSearch, 1000)}
    //         onPaste={handleQuickSearchPaste}
    //         onBlur={handleQuickSearchBlur}
    //       />
    //     </Form.Item>
    //   </Form>
    //   <StyledCardContent>
    //     {list &&
    //       list.map((item, index) => (
    //         <StyledFavoriteItem justify="space-between" key={index}>
    //           <Col span={20}>
    //             <p className="favorite-name">{item.name}</p>
    //           </Col>
    //           <Col>
    //             <Tooltip
    //               placement="top"
    //               title={intl.formatMessage({
    //                 id: 'view.common_device.edit',
    //               })}
    //             >
    //               <EditOutlined
    //                 onClick={() => {
    //                   setVisibleEditName(true);
    //                   setSelectedRecord(item);
    //                 }}
    //               />
    //             </Tooltip>
    //           </Col>
    //           <Col>
    //             <Tooltip
    //               placement="top"
    //               title={intl.formatMessage({
    //                 id: 'view.ai_events.delete',
    //               })}
    //             >
    //               <DeleteOutlined
    //                 onClick={() => dispatch({ type: 'favorite/delete', id: item?.uuid })}
    //               />
    //             </Tooltip>
    //           </Col>
    //         </StyledFavoriteItem>
    //       ))}
    //     <StyledPagination>
    //       <Pagination
    //         size="small"
    //         pageSize={metadata?.size}
    //         current={metadata?.page}
    //         total={metadata?.total}
    //         onChange={onPaginationChange}
    //       />
    //     </StyledPagination>
    //   </StyledCardContent>

    //   {visibleEditName && (
    //     <EditNameFavorite
    //       visible={visibleEditName}
    //       onClose={() => {
    //         setVisibleEditName(false);
    //       }}
    //       selectedRecord={selectedRecord}
    //       list={list}
    //       dispatch={dispatch}
    //     />
    //   )}
    // </StyledCard>
    <StyledDrawer
      openDrawer={props.visible}
      onClose={props.onClose}
      width={350}
      zIndex={1001}
      placement="right"
      title={props.title}
    >
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
      <StyledCardContent>
        {list &&
          list.map((item, index) => (
            <StyledFavoriteItem justify="space-between" key={index}>
              <Col span={20}>
                <p className="favorite-name">{item.name}</p>
              </Col>
              <Col>
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
              <Col>
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
            </StyledFavoriteItem>
          ))}

        {visibleEditName && (
          <EditNameFavorite
            visible={visibleEditName}
            onClose={() => {
              setVisibleEditName(false);
            }}
            selectedRecord={selectedRecord}
            list={list}
            dispatch={dispatch}
          />
        )}
      </StyledCardContent>
      <StyledPagination>
        <Pagination
          size="small"
          pageSize={metadata?.size}
          current={metadata?.page}
          total={metadata?.total}
          onChange={onPaginationChange}
        />
      </StyledPagination>
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

const StyledCardContent = styled.div``;

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

    .favorite-name {
      margin-bottom: 0;
    }
  }
`;

const StyledPagination = styled.div`
  width: 100%;
  margin-top: 100px;
  display: flex;
  justify-content: center;
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
