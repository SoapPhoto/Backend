import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { connect } from '@pages/common/utils/store';
import { Avatar } from '@pages/components';
import { Heart } from '@pages/icon';
import { Link } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import { PictureImage } from './Image';
import { HandleBox, InfoBox, ItemWapper, LikeButton, UserBox, UserName } from './styles';

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
  like?: (data: PictureEntity) => void;
  accountStore?: AccountStore;
}

export const PictureItem = connect<React.FC<IPictureItemProps>>('accountStore')(({
  detail,
  like,
  accountStore,
  ...restProps
}) => {
  const { isLogin } = accountStore!;
  const onLike = () => {
    if (like) {
      like(detail);
    }
  };
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
        <HandleBox>
          {
            isLogin &&
            <LikeButton onClick={onLike} like={detail.isLike} >
              <Heart size={18} />
            </LikeButton>
          }
        </HandleBox>
      </InfoBox>
      <PictureImage detail={detail} {...restProps} />
    </ItemWapper>
  );
});
