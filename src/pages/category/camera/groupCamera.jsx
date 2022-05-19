/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import { connect } from 'dva';
import { Input, Tooltip, Button, Col } from 'antd';
import { useState, useEffect } from 'react';
import { PlusOutlined, DownOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { TreeNodeStyle, CameraGroupSearch, TreeStyle, GroupCameraContainer } from './style';
import isEmpty from 'lodash/isEmpty';
import CircleIcon from '@/assets/img/iconO';
const { Search } = Input;

const GroupCamera = ({ dispatch, groupCameraParentOptions }) => {
  const intl = useIntl();
  const [option, setOption] = useState({
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  });
  const [camGroupUuid, setCamGroupUuid] = useState(null);
  const [treeNodeCamList, setTreeNodeCamList] = useState([]);
  // get camera group parent options
  useEffect(() => {
    dispatch({
      type: 'globalstore/fetchAllGroupCameraParent',
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
          parent['children'] = newchildren;
        }
        _.each(children, function (child) {
          unflatten(array, child);
        });
      }
      return tree;
    };
    const treeDataConverted = groupCameraParentOptions.map((p) => {
      return {
        title: p?.name,
        key: p?.uuid,
        parentId: isEmpty(p?.parent) ? '0' : p?.parent,
      };
    });
    const data = unflatten(treeDataConverted);
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
          <Button icon={<PlusOutlined />} />
          <Button icon={<EditOutlined />} className="middle-btn" />
          <Button icon={<DeleteOutlined />} />
        </div>
      </TreeNodeStyle>
    );
  };
  //show modal add
  const showModal = (id) => {};
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

  const { expandedKeys, autoExpandParent } = option;
  return (
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
            <Button type="primary" className="btnAddUser" onClick={() => showModal(null)}>
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
  );
};
function mapStateToProps(state) {
  const { groupCameraParentOptions } = state.globalstore;
  return {
    groupCameraParentOptions,
  };
}
export default connect(mapStateToProps)(GroupCamera);
