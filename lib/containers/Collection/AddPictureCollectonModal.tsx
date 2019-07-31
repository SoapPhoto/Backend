/* eslint-disable no-undef */
import React from 'react';
import { Modal } from '@lib/components/Modal';
import { connect } from '@lib/common/utils/store';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { rgba, rem } from 'polished';
import { getPictureUrl } from '@lib/common/utils/image';
import styled from 'styled-components';

interface IProps {
  visible: boolean;
  themeStore?: ThemeStore;
  picture: PictureEntity;
  onClose: () => void;
}

const Title = styled.h2`
  font-size: ${_ => _.theme.fontSizes[3]};
  padding: ${rem('24px')};
`;

export const AddPictureCollectonModal = connect<React.FC<IProps>>('themeStore')(({
  visible,
  themeStore,
  picture,
  onClose,
}) => {
  const { key } = picture;
  const { themeData } = themeStore!;
  // eslint-disable-next-line max-len
  const background = `linear-gradient(${rgba(themeData.colors.pure, 0.8)}, ${themeData.colors.pure} 200px), url("${getPictureUrl(key)}")`;
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      boxStyle={{ backgroundImage: background, padding: 0 }}
    >
      <Title>添加到收藏夹</Title>
    </Modal>
  );
});
