import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { ImageBox, ItemImage, ItemWapper } from './styles';

interface IProps {
  detail: PictureEntity;
}

export const PictureItem: React.SFC<IProps> = ({
  detail,
}) => {
  const height = ((detail.width - detail.height) / detail.width) * 100 || 100;
  return (
    <ItemWapper>
      <ImageBox height={height} background={detail.color}>
        <ItemImage src={`//cdn.soapphoto.com/${detail.key}`} />
      </ImageBox>
    </ItemWapper>
  );
};
