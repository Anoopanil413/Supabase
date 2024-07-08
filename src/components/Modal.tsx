import React from 'react';
import { Modal } from 'antd';

const ReusableModal = ({ visible, title, onCancel, onOk, children }:any) => {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

export default ReusableModal;
