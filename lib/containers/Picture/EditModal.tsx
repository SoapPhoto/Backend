import React from 'react';
import { Modal } from '@lib/components/Modal';

interface IProps {
  visible: boolean;
}

export const EditMPictureModal: React.FC<IProps> = ({
  visible,
}) => (
  <Modal visible={visible}>
      test
  </Modal>
);
