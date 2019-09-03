import React from 'react';
import { cover, rem } from 'polished';
import { css } from 'styled-components';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { PictureStyle } from '@lib/common/utils/image';
import { connect } from '@lib/common/utils/store';
import { Avatar } from '@lib/components';
import { LikeButton } from '@lib/components/Button';
import { AccountStore } from '@lib/stores/AccountStore';
import { A } from '@lib/components/A';
import { Lock } from '@lib/icon';
import { Popover } from '@lib/components/Popover';
import { PictureImage } from './Image';
import {
  HandleBox, InfoBox, ItemWapper, UserBox, UserName,
} from './styles';
import { UserPopper } from './components/UserPopper';

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
      <A
        route={`/picture/${detail.id}`}
        css={css`
          ${cover()}
          z-index: 2;
        `}
      />
      {
        detail.isPrivate && (
          <Popover
            openDelay={100}
            trigger="hover"
            placement="top"
            theme="dark"
            content={<span>私人图片</span>}
          >
            <div
              css={css`
                position: absolute;
                z-index: 2;
                background: #ccc;
                right: ${rem(6)};
                top: ${rem(6)};
                background: #ff6282;
                border-radius: 50%;
                width: 25px;
                height: 25px;
                display: flex;
                justify-content: center;
                align-items: center;
              `}
            >
              <Lock css={css`stroke-width: 3;`} size={12} color="#fff" />
            </div>
          </Popover>
        )
      }
      <InfoBox>
        <UserBox>
          <UserPopper username={detail.user.username}>
            <div style={{ fontSize: 0 }}>
              <A
                route={`/@${detail.user.username}`}
              >
                <Avatar src={detail.user.avatar} size={30} />
              </A>
            </div>
          </UserPopper>
          <UserName
            route={`/@${detail.user.username}`}
          >
            {detail.user.username}
          </UserName>
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
