import { CloseOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import styled from 'styled-components';

function CustomCloseIcon() {
  return <CloseOutlined style={{ color: '#ffffff', fontSize: '20px' }} />;
}
export default function MSCustomizeDrawer(props) {
  const { children, openDrawer, zIndex = 1001, closeIcon, ...rest } = props;

  return (
    <DrawerStyled
      visible={openDrawer}
      destroyOnClose={true}
      zIndex={zIndex}
      closeIcon={closeIcon || <CustomCloseIcon />}
      // getContainer={false}
      {...rest}
      // minWidth={'100%'}
    >
      {children}
    </DrawerStyled>
  );
}

const DrawerStyled = styled(Drawer)`
  @media screen and (max-width: 768px) {
    .ant-drawer-content-wrapper {
      min-width: 50%;
    }
  }

  @media screen and (max-width: 425px) {
    .ant-drawer-content-wrapper {
      min-width: 100%;
    }
  }
`;
