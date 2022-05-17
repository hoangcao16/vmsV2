import MSCustomizeDrawer from '@/components/Drawer';
import { STORAGE } from '@/constants/common';
import getCurrentLocale from '@/utils/Locale';
import { AutoComplete, Button, Space, Tree } from 'antd';
import { connect } from 'dva';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
const { TreeNode } = Tree;

function SettingPermissionGroup({ dispatch, data, treeNodeList, checked }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [treeNodeCamList, setTreeNodeCamList] = useState([]);
  const [checkedPermission, setCheckedPermission] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [isEmpt, setIsEmpty] = useState(false);
  const [search, setSearch] = useState('');
  const [option, setOption] = useState({
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    defaultExpandAll: true,
  });

  const { expandedKeys, autoExpandParent, defaultExpandAll } = option;

  const intl = useIntl();

  useEffect(() => {
    dispatch({
      type: 'premissionInGroup/fetchAllPermission',
      //đoạn này lấy tạm tiếng việt
      payload: {
        lang: getCurrentLocale(),
      },
    });
  }, []);

  useEffect(() => {
    setTreeNodeCamList(treeNodeList);
    setTreeData(data);
    setCheckedPermission(checked);
  }, [treeNodeList, data, checked]);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  const onExpand = (expandedKeys) => {
    setOption({
      ...option,
      expandedKeys,
      autoExpandParent: true,
    });
  };

  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data?.length; i++) {
      const node = data[i];
      const { name, code } = node;
      dataList.push({ key: code, title: name, titleUnsign: unsign(name) });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  generateList(treeData);
  const getParentKey = (key, treeData) => {
    let parentKey;
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      if (node.children) {
        if (node.children.some((item) => item.code === key)) {
          parentKey = node.code;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      } else {
        parentKey = key;
      }
    }
    return parentKey;
  };

  const getTreeNodeExpand = (key, treeNodeCam) => {
    let treeNodeExpand;
    if (treeNodeCam.code === key) {
      treeNodeExpand = treeNodeCam.code;
    } else if (treeNodeCam.children) {
      if (treeNodeCam.children.some((item) => item.code === key)) {
        treeNodeExpand = treeNodeCam.code;
      } else {
        for (let i = 0; i < treeNodeCam.children.length; i++) {
          if (getTreeNodeExpand(key, treeNodeCam.children[i])) {
            treeNodeExpand = getTreeNodeExpand(key, treeNodeCam.children[i]);
            break;
          }
        }
      }
    }
    return treeNodeExpand;
  };

  const handleFilterTreeData = (treeData, expandedKeys) => {
    let treeDataFilter = [];
    if (expandedKeys.length > 0) {
      treeDataFilter = treeData.filter((tree) =>
        expandedKeys.find((key) => getTreeNodeExpand(key, tree)),
      );
    }
    return treeDataFilter;
  };

  const loop = (data) =>
    data?.map((item) => {
      const index = item.name.toLowerCase().indexOf(option.searchValue.toLowerCase());
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + option.searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span
              style={{
                color: '#1380ff',
              }}
            >
              {option.searchValue}
            </span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        );

      if (item.children) {
        return (
          <TreeNode
            key={item.code}
            title={
              <div className="full-width d-flex justify-content-between">
                <div className="titleGroup" title={title}>
                  {title}
                </div>
              </div>
            }
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.code}
          title={
            <div className="full-width d-flex justify-content-between">
              <div className="titleGroup" title={title}>
                {title}
              </div>
            </div>
          }
        />
      );
    });

  function unsign(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  const onCheck = (checkedKeysValue) => {
    setCheckedPermission(checkedKeysValue);
    const dataRemove = ['monitoring', 'nvr', 'configuration', 'map', 'storage', 'user'];
    const data = checkedKeysValue.filter((c) => !dataRemove.includes(c));
    setSelectedRowKeys(data);
  };

  const handleBlur = (event) => {
    const value = event.target.value.trim();
    setSearch(value);
  };
  const handleSearch = async (value) => {
    setSearch(value);
    if (isEmpty(value)) {
      setOption({
        ...option,
        expandedKeys: [],
        searchValue: value,
      });
      setIsEmpty(false);
      setTreeNodeCamList([...treeData]);
      setCheckedPermission([...checked]);
      return;
    }
    const valueSearch = unsign(value);
    const expandedKeys = dataList
      .map((item) => {
        if (item.titleUnsign.indexOf(valueSearch) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    let newTreeData = JSON.parse(JSON.stringify(treeData));
    const treeDataFilter = handleFilterTreeData(newTreeData, expandedKeys);

    if (isEmpty(treeDataFilter)) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }

    setTreeNodeCamList(treeDataFilter);
    setOption({
      ...option,
      expandedKeys,
      searchValue: value,
    });
  };

  const handleSubmit = async () => {
    if (isEmpty(selectedRowKeys)) {
      return;
    }

    const dataRemove = checked.filter((c) => !selectedRowKeys.includes(c));
    const dataAdd = selectedRowKeys.filter((c) => !checked.includes(c));

    const payloadAdd = {
      subject: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
      object: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
      action: dataAdd[0],
      actions: dataAdd,
    };

    const payloadRemove = dataRemove.map((dr) => {
      return {
        subject: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
        object: `user_g@${localStorage.getItem(STORAGE.GROUP_CODE_SELECTED)}`,
        action: dr,
      };
    });

    const dataRM = {
      policies: payloadRemove,
    };

    if (!isEmpty(dataAdd)) {
      dispatch({
        type: 'premissionInGroup/setPermisionGroup',

        payload: payloadAdd,
      });
    }

    if (!isEmpty(dataRemove)) {
      dispatch({
        type: 'premissionInGroup/removePermisionGroup',

        payload: dataRM,
      });
    }

    onClose();
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer}>
          {intl.formatMessage({
            id: 'pages.setting-user.list-user.setting-per',
          })}
        </Button>
      </Space>
      {openDrawer && (
        <MSCustomizeDrawer
          openDrawer={openDrawer}
          onClose={onClose}
          width={'50%'}
          zIndex={1003}
          title={intl.formatMessage({
            id: 'pages.setting-user.list-user.setting-per',
          })}
          placement="right"
          extra={
            <Space>
              <Button type="primary" onClick={handleSubmit}>
                {intl.formatMessage({
                  id: 'pages.setting-user.list-user.save',
                })}
              </Button>
            </Space>
          }
        >
          <AutoComplete
            style={{ marginBottom: 20, width: 200 }}
            className=" full-width height-40 read search__camera-group"
            onSearch={debounce(handleSearch, 1000)}
            onBlur={handleBlur}
            maxLength={255}
            placeholder={intl.formatMessage({
              id: 'pages.setting-user.list-user.search',
            })}
          />
          <Tree
            checkable
            className="treeData"
            onCheck={onCheck}
            checkedKeys={checkedPermission}
            onExpand={onExpand}
            autoExpandParent={autoExpandParent}
            expandedKeys={expandedKeys}
          >
            {loop(treeNodeCamList)}
          </Tree>
          {isEmpt && (
            <h4>
              {intl.formatMessage({
                id: 'pages.setting-user.list-user.nodata',
              })}
            </h4>
          )}
        </MSCustomizeDrawer>
      )}
    </>
  );
}

function mapStateToProps(state) {
  const { allPermission, list } = state.premissionInGroup;
  return {
    loading: state.loading.models.premissionInGroup,
    data: allPermission,
    treeNodeList: allPermission,
    checked: list?.map((po) => po.code),
  };
}

export default connect(mapStateToProps)(SettingPermissionGroup);
