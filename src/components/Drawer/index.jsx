import { Drawer } from 'antd';
import React from 'react';

export default function MSCustomizeDrawer(props) {
  const {
    className,
    children,
    width,
    onClose,
    openDrawer,
    title,
    placement,
    extra,
    zIndex = 1001,
  } = props;

  const onCloseDrawer = () => {
    onClose();
  };

  return (
    <>
      <Drawer
        className={className}
        title={title}
        placement={placement}
        width={width}
        onClose={onCloseDrawer}
        visible={openDrawer}
        extra={extra}
        zIndex={zIndex}
        destroyOnClose={true}
      >
        {children}
      </Drawer>
    </>
  );
}
