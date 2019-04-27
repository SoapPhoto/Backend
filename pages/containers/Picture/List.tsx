import * as React from 'react';

import { IPictureListRequest } from '@pages/common/interfaces/picture';
import { PictureItem } from './Item';
import { Wapper } from './styles';

interface IProps {
  data: IPictureListRequest;
}

export const PictureList: React.SFC<IProps> = ({
  data,
}) => {
  return (
    <Wapper>
      {
        data.data.map(picture => (
          <PictureItem key={picture.id} detail={picture} />
        ))
      }
    </Wapper>
  );
};
