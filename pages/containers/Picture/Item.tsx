import Router, { withRouter, WithRouterProps } from 'next/router';
import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { store } from '@pages/stores/init';
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
    store.appStore.setRoute({
      as: `${router!.route}?picture=${detail.id}`,
      href: `/picture/${detail.id}`,
      action: 'PUSH',
    });
    Router.push(`${router!.route}?picture=${detail.id}`, `/picture/${detail.id}`, {
      shallow: true,
      action: 'PUSH',
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
