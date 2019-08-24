import React from 'react';
import { cover } from 'polished';
import { css } from 'styled-components';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { PictureStyle } from '@lib/common/utils/image';
import { connect } from '@lib/common/utils/store';
import { Avatar } from '@lib/components';
import { LikeButton } from '@lib/components/Button';
import { AccountStore } from '@lib/stores/AccountStore';
import { A } from '@lib/components/A';
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
      <InfoBox>
        <UserBox>
          {/* <UserPopper username={detail.user.username}> */}
          <div style={{ fontSize: 0 }}>
            <A
              route={`/@${detail.user.username}`}
            >
              <Avatar src={detail.user.avatar} size={30} />
            </A>
          </div>
          {/* </UserPopper> */}
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
