import { withRouter } from 'next/router';
import * as React from 'react';
import LazyLoad from 'react-lazyload';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { Link } from '@pages/routes';
import { ImageBox, ItemImage, ItemWapper } from './styles';

const pictureStyle = {
  full: '-pictureFull',
  raw: '',
  regular: '-pictureRegular',
  thumb: '-pictureThumb',
  blur: '-pictureBlur',
};

interface IProps {
  detail: PictureEntity;
  lazyload?: boolean;
  size?: keyof typeof pictureStyle;
}

export const PictureImage: React.FC<IProps> = ({
  detail,
  lazyload = true,
  size = 'regular',
}) => {
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  return (
    <ImageBox height={height} background={detail.color}>
      {
        lazyload ? (
          <LazyLoad height="100%" offset={300}>
            <ItemImage src={`//cdn.soapphoto.com/${detail.key}${pictureStyle[size]}`} />
          </LazyLoad>
        ) : (
          <ItemImage src={`//cdn.soapphoto.com/${detail.key}${pictureStyle[size]}`} />
        )
      }
    </ImageBox>
  );
};

export const PictureItem = withRouter<IProps>(({
  detail,
}) => {
  return (
    <div>
      <Link route={`/picture/${detail.id}`}>
        <a
          href={`/picture/${detail.id}`}
        >
          <ItemWapper>
            <PictureImage detail={detail} />
          </ItemWapper>
        </a>
      </Link>
    </div>
  );
});
