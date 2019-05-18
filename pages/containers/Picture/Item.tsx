import { withRouter } from 'next/router';
import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { Link } from '@pages/routes';
import { PictureImage } from './Image';
import { ItemWapper } from './styles';

export const pictureStyle = {
  full: '-pictureFull',
  raw: '',
  regular: '-pictureRegular',
  thumb: '-pictureThumb',
  blur: '-pictureBlur',
};

export interface IPictureItemProps {
  detail: PictureEntity;
  lazyload?: boolean;
  size?: keyof typeof pictureStyle;
}

export const PictureItem = withRouter<IPictureItemProps>(({
  detail,
  ...restProps
}) => {
  return (
    <div>
      <Link route={`/picture/${detail.id}`}>
        <a
          href={`/picture/${detail.id}`}
        >
          <ItemWapper>
            <PictureImage detail={detail} {...restProps} />
          </ItemWapper>
        </a>
      </Link>
    </div>
  );
});
