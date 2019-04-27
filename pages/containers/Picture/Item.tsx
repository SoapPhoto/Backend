import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { ItemImage, ItemWapper } from './styles';

interface IProps {
  detail: PictureEntity;
}

export const PictureItem: React.SFC<IProps> = ({
  detail,
}) => {
  return (
    <ItemWapper>
      <ItemImage background={`//cdn.soapphoto.com/${detail.key}`} />
    </ItemWapper>
  );
};
