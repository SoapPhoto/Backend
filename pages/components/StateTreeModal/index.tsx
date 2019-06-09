import React from 'react';
import ReactJson from 'react-json-view';

import { store } from '@pages/stores/init';
import { Modal } from '../Modal';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export const StateTreeModal: React.FC<IProps> = ({ visible, onClose }) => (
  <Modal visible={visible} onClose={onClose} >
    <ReactJson
      src={store}
      theme="monokai"
      name="rootStore"
      collapsed={1}
      iconStyle="circle"
      displayDataTypes={false}
      enableClipboard={false}
    />
  </Modal>
);
