import Router, { withRouter, WithRouterProps } from 'next/router';
import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { store } from '@pages/stores/init';
import { ImageBox, ItemImage, ItemWapper } from './styles';
import { Link } from '@pages/routes';

interface IProps {
  detail: PictureEntity;
}

export const PictureImage: React.SFC<{detail: PictureEntity}> = ({ detail }) => {
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  return (
  <ImageBox height={height} background={detail.color}>
    <ItemImage src={`//cdn.soapphoto.com/${detail.key}`} />
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
