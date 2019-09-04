import React from 'react';
import { cover, rem } from 'polished';
import { css } from 'styled-components';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { PictureStyle } from '@lib/common/utils/image';
import { Avatar } from '@lib/components';
import { LikeButton } from '@lib/components/Button';
import { A } from '@lib/components/A';
import { Lock } from '@lib/icon';
import { Popover } from '@lib/components/Popover';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore } from '@lib/stores/hooks';
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
}

export const PictureItem: React.FC<IPictureItemProps> = ({
  detail,
  like,
  lazyload,
  ...restProps
}) => {
  const { isLogin } = useAccountStore();
  const { t } = useTranslation();
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
            content={<span>{t('private_xx', t('picture'))}</span>}
          >
            <div
              css={css`
                position: absolute;
                z-index: 2;
                background: #ccc;
                right: ${rem(6)};
                top: ${rem(6)};
                background: #000;
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
};
