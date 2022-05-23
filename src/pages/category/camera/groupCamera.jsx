/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import { connect } from 'dva';
import { Input, Tooltip, Button, Col, Popconfirm } from 'antd';
import { useState, useEffect } from 'react';
import {
  PlusOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useIntl } from 'umi';
import { TreeNodeStyle, CameraGroupSearch, TreeStyle, GroupCameraContainer } from './style';
import isEmpty from 'lodash/isEmpty';
import CircleIcon from '@/assets/img/iconO';
import GroupCameraDrawer from './components/group-camera-drawer';
const { Search } = Input;

const unflatten = (array, parent, tree) => {
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { key: 0 };
  var children = _.filter(array, function (child) {
    return child.parentId == parent.key;
  });
  if (!_.isEmpty(children)) {
    if (parent.key == 0) {
      tree = children;
    } else {
      const newchildren = children.map((child) => {
        return {
          ...child,
          icon: <CircleIcon />,
        };
      });
      parent['children'] = children;
    }
    _.each(children, function (child) {
      unflatten(array, child);
    });
  }
  tree.map((item) => {
    if (item?.children && !isEmpty(item?.children)) {
      unflatten(array, item);
    }
  });
  return tree;
};
const GroupCamera = ({ dispatch, groupCameraParentOptions }) => {
  const intl = useIntl();
  const [option, setOption] = useState({
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  });
  const [camGroupUuid, setCamGroupUuid] = useState(null);
  const [treeNodeCamList, setTreeNodeCamList] = useState([]);
  const [valueSearch, setValueSearch] = useState();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [cameraGroupUuid, setCameraGroupUuid] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  // get camera group parent options
  useEffect(() => {
    dispatch({
      type: 'groupcamera/fetchAllGroupCameraParent',
      payload: {
        parent: 'all',
        name: '',
        page: 0,
        size: 1000,
      },
    });
  }, []);
  // format treenode data
  useEffect(() => {
    const treeDataConverted = groupCameraParentOptions.map((p) => {
      return {
        title: p?.name,
        key: p?.uuid,
        parentId: isEmpty(p?.parent) ? '0' : p?.parent,
      };
    });
    const parentUuidList = treeDataConverted.map((item) => {
      if (item?.parentId && item?.parentId !== '0') {
        return item?.parentId;
      }
    });
    const formatTreeData = treeDataConverted.map((child) => {
      if (!parentUuidList.includes(child?.key)) {
        return {
          ...child,
          icon: <CircleIcon />,
        };
      } else {
        return child;
      }
    });
    const data = unflatten(formatTreeData);
    setTreeNodeCamList(data);
  }, [groupCameraParentOptions]);
  //renderTitle
  const renderTitle = (props) => {
    return (
      <TreeNodeStyle data-type={props?.children ? 'parent' : ''}>
        <div className={props?.children ? 'titleGroup parent' : 'titleGroup'} title={props?.title}>
          {props?.title}
        </div>
        <div className="actionsGroup">
          <Tooltip
            placement="top"
            title={intl.formatMessage({ id: 'view.camera.add_new_camera_group' })}
          >
            <Button
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                showDrawer(props?.key);
              }}
            />
          </Tooltip>
          <Tooltip placement="top" title={intl.formatMessage({ id: 'view.common_device.edit' })}>
            <Button
              icon={<EditOutlined />}
              className="middle-btn"
              onClick={(e) => {
                e.stopPropagation();
                showDrawer(props?.key);
                setIsEdit(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title={intl.formatMessage({ id: 'noti.delete_camera_group' })}
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(props?.key);
            }}
            className="confirm--delete"
            icon={<ExclamationCircleOutlined />}
            cancelText={intl.formatMessage({ id: 'view.user.detail_list.cancel' })}
            okText={intl.formatMessage({ id: 'view.user.detail_list.confirm' })}
          >
            <Tooltip placement="top" title={intl.formatMessage({ id: 'delete' })}>
              <Button
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      </TreeNodeStyle>
    );
  };
  //show drawer
  const showDrawer = (id) => {
    setValueSearch(null);
    setIsOpenDrawer(true);
    setCameraGroupUuid(id);
  };
  const onExpand = (expandedKeys) => {
    setOption({
      ...option,
      expandedKeys,
      autoExpandParent: true,
    });
  };
  const onSelect = (e) => {
    setCamGroupUuid(e[0]);
  };
  //delete group camera
  const handleDelete = (id) => {
    dispatch({
      type: 'groupcamera/deleteGroupCamera',
      payload: id,
    });
  };
  const { expandedKeys, autoExpandParent } = option;
  return (
    <>
      <GroupCameraContainer>
        <Col span={10}>
          <CameraGroupSearch>
            <Search
              placeholder={intl.formatMessage({
                id: 'view.map.search',
              })}
            />
            <Tooltip
              placement="rightTop"
              title={intl.formatMessage({ id: 'view.camera.add_new_camera_group' })}
            >
              <Button type="primary" className="btnAddUser" onClick={() => showDrawer(null)}>
                <PlusOutlined className="d-flex justify-content-between align-center" />
                {intl.formatMessage({ id: 'add' })}
              </Button>
            </Tooltip>
          </CameraGroupSearch>
          {!isEmpty(treeNodeCamList) && (
            <TreeStyle
              className="treeData"
              onExpand={onExpand}
              onSelect={(e) => onSelect(e)}
              switcherIcon={<DownOutlined />}
              scroll={{ y: 300 }}
              defaultExpandAll={true}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              showIcon
              treeData={treeNodeCamList}
              titleRender={renderTitle}
            />
          )}
        </Col>
      </GroupCameraContainer>
      <GroupCameraDrawer
        isOpenDrawer={isOpenDrawer}
        setIsOpenDrawer={setIsOpenDrawer}
        cameraGroupUuid={cameraGroupUuid}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
    </>
  );
};
function mapStateToProps(state) {
  const { groupCameraParentOptions } = state.groupcamera;
  return {
    groupCameraParentOptions,
  };
}
export default connect(mapStateToProps)(GroupCamera);
