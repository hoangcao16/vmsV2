import { Drawer } from 'antd';
import React from 'react';

export default function MSCustomizeDrawer(props) {
  const { children, width, onClose, openDrawer, title, placement, extra, zIndex = 1001 } = props;

  const onCloseDrawer = () => {
    onClose();
  };

  return (
    <>
      <Drawer
        title={title}
        placement={placement}
        width={width}
        onClose={onCloseDrawer}
        visible={openDrawer}
        extra={extra}
        zIndex={zIndex}
      >
        {children}
      </Drawer>
    </>
  );
}
