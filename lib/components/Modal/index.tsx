import { Modal as InternalModal, IModalProps as IProps } from './Modal';
import {
  ModalContent, ModalBackground, ModalHeader, ModalTitle,
} from './styles';


type InternalModal = typeof InternalModal;

interface IModal extends InternalModal {
  Content: typeof ModalContent;
  Background: typeof ModalBackground;
  Header: typeof ModalHeader;
  Title: typeof ModalTitle;
}

const Modal: IModal = InternalModal as IModal;
Modal.Content = ModalContent;
Modal.Background = ModalBackground;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;

export type IModalProps = IProps;
export default Modal;
