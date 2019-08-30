import React from 'react';
import { Modal } from '@lib/components/Modal';
import styled from 'styled-components';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const Wrapper = styled.div``;

const Content = styled.div`
  padding: 0 ${rem('24px')};
  max-width: ${rem(800)};
  width: 100%;
`;

const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  padding: ${rem('24px')};
`;

export const EditPictureModal: React.FC<IProps> = ({
  visible,
  onClose,
}) => (
  <Modal
    visible={visible}
    onClose={onClose}
    boxStyle={{ padding: 0 }}
  >
    <Wrapper>
      <Title>编辑</Title>
      <Content>
        sfasdf
      </Content>
    </Wrapper>
  </Modal>
);
