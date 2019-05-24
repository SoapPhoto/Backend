import { withRouter } from 'next/router';
import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { Avatar } from '@pages/components';
import { Heart } from '@pages/icon';
import { Link } from '@pages/routes';
import { PictureImage } from './Image';
import { InfoBox, ItemWapper, UserBox, UserName } from './styles';

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
    <ItemWapper>
      <Link route={`/picture/${detail.id}`}>
        <a
          href={`/picture/${detail.id}`}
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 2 }}
        />
      </Link>
      <InfoBox>
        <Link route={`/@${detail.user.username}`}>
          <UserBox href={`/@${detail.user.username}`}>
            <Avatar src={detail.user.avatar} size={30} />
            <UserName>{detail.user.username}</UserName>
          </UserBox>
        </Link>
        <div>
          <Heart style={{ filter: 'drop-shadow(0 0.0625rem 0.0625rem rgba(0,0,0,.3))' }} size={16} color="#fff" />
        </div>
      </InfoBox>
      <PictureImage detail={detail} {...restProps} />
    </ItemWapper>
  );
});
