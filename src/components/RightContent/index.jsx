import { GlobalOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { SelectLang, useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <Avatar menu />
      <SelectLang className={styles.action} icon={<GlobalOutlined />} />
    </Space>
  );
};

export default GlobalHeaderRight;
