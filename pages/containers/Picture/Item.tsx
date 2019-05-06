import { withRouter, WithRouterProps } from 'next/router';
import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { Router } from '@pages/routes';
import Link from 'next/link';
import { ImageBox, ItemImage, ItemWapper } from './styles';

interface IProps {
  detail: PictureEntity;
}

export const PictureItem = withRouter<IProps>(({
  detail,
  router,
}) => {
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  return (
    <Link href={`${router!.route}?picture=${detail.id}`} as={`/picture/${detail.id}`}>
      <a>
        <ItemWapper>
          <ImageBox height={height} background={detail.color}>
            <ItemImage src={`//cdn.soapphoto.com/${detail.key}`} />
          </ImageBox>
        </ItemWapper>
      </a>
    </Link>
  );
});
