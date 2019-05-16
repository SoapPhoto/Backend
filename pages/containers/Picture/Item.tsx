import { withRouter } from 'next/router';
import * as React from 'react';
import LazyLoad from 'react-lazyload';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { Link } from '@pages/routes';
import { ImageBox, ItemImage, ItemWapper } from './styles';

interface IProps {
  detail: PictureEntity;
}

export const PictureImage: React.FC<{detail: PictureEntity}> = ({ detail }) => {
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  return (
    <ImageBox height={height} background={detail.color}>
      <LazyLoad height="100%" offset={100}>
        <ItemImage src={`//cdn.soapphoto.com/${detail.key}`} />
      </LazyLoad>
    </ImageBox>
  );
};

export const PictureItem = withRouter<IProps>(({
  detail,
}) => {
  return (
    <span>
      <Link route={`/picture/${detail.id}`}>
        <a
          href={`/picture/${detail.id}`}
        >
          <ItemWapper>
              <PictureImage detail={detail} />
          </ItemWapper>
        </a>
      </Link>
    </span>
  );
});
