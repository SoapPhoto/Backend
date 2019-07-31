import React from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { PictureStyle } from '@lib/common/utils/image';
import { connect } from '@lib/common/utils/store';
import { Avatar } from '@lib/components';
import { LikeButton } from '@lib/components/Button';
import { Popover } from '@lib/components/Popover';
import { Link } from '@lib/routes';
import { AccountStore } from '@lib/stores/AccountStore';
import UserCard from './components/UserCard';
import { PictureImage } from './Image';
import {
  HandleBox, InfoBox, ItemWapper, UserBox, UserName,
} from './styles';

export interface IPictureItemProps {
  detail: PictureEntity;
  lazyload?: boolean;
  size?: PictureStyle;
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
  const onLike = async () => {
    if (like) {
      await like(detail);
    }
  };
  return (
    <ItemWapper>
      <Link route={`/picture/${detail.id}`}>
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a
          href={`/picture/${detail.id}`}
          style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 2,
          }}
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
            isLogin
            && <LikeButton isLike={detail.isLike} onLike={onLike} />
          }
        </HandleBox>
      </InfoBox>
      <PictureImage lazyload={lazyload} detail={detail} {...restProps} />
    </ItemWapper>
  );
});
