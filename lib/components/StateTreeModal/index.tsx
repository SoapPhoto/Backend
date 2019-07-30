import React from 'react';

import { Modal } from '../Modal';
import { StateJson } from './StateJson';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export const StateTreeModal: React.FC<IProps> = ({ visible, onClose }) => (
  <Modal
    visible={visible}
    onClose={onClose}
    boxStyle={{
      height: '600px',
      overflow: 'auto',
    }}
  >
    <StateJson />
  </Modal>
);
