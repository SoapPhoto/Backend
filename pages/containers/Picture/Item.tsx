import React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { connect } from '@pages/common/utils/store';
import { Avatar } from '@pages/components';
import { LikeButton } from '@pages/components/LikeButton';
import { Popover } from '@pages/components/Popover';
import { Heart } from '@pages/icon';
import { Link } from '@pages/routes';
import { AccountStore } from '@pages/stores/AccountStore';
import UserCard from './components/UserCard';
import { PictureImage } from './Image';
import { HandleBox, InfoBox, ItemWapper, UserBox, UserName } from './styles';

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
  lazyload,
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
        <UserBox>
          <Popover
            openDelay={500}
            trigger="hover"
            placement="top"
            content={<UserCard user={detail.user} />}
          >
            <div style={{ fontSize: 0 }}>
              <Link route={`/@${detail.user.username}`}>
                <a href={`/@${detail.user.username}`}>
                  <Avatar src={detail.user.avatar} size={30} />
                </a>
              </Link>
            </div>
          </Popover>
          <Link route={`/@${detail.user.username}`}>
            <UserName href={`/@${detail.user.username}`}>
              {detail.user.username}
            </UserName>
          </Link>
        </UserBox>
        <HandleBox>
          {
            isLogin &&
            <LikeButton isLike={detail.isLike} onLike={onLike} />
          }
        </HandleBox>
      </InfoBox>
      <PictureImage lazyload={lazyload} detail={detail} {...restProps} />
    </ItemWapper>
  );
});
