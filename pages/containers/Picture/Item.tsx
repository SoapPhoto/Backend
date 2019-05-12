import Router, { withRouter, WithRouterProps } from 'next/router';
import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { ImageBox, ItemImage, ItemWapper } from './styles';

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
  router,
}) => {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    Router.push(`${router!.route}?picture=${detail.id}`, `/picture/${detail.id}`, {
      shallow: true,
    });
  };
  return (
    <span>
      <a
        href={`/picture/${detail.id}`}
        onClick={onClick}
      >
        <ItemWapper>
          <PictureImage detail={detail} />
        </ItemWapper>
      </a>
    </span>
  );
});
