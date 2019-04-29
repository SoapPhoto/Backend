import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { ImageBox, ItemImage, ItemWapper } from './styles';

interface IProps {
  detail: PictureEntity;
}

export const PictureItem: React.SFC<IProps> = ({
  detail,
}) => {
  return (
    <ItemWapper>
      <ImageBox>
        <ItemImage background={`//cdn.soapphoto.com/${detail.key}`} />
      </ImageBox>
    </ItemWapper>
  );
};
