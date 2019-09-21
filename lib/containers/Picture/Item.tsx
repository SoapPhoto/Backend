import React from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { PictureStyle } from '@lib/common/utils/image';
import { Avatar } from '@lib/components';
import { LikeButton } from '@lib/components/Button';
import { A } from '@lib/components/A';
import { Lock } from '@lib/icon';
import { Popover } from '@lib/components/Popover';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useAccountStore } from '@lib/stores/hooks';
import { observer } from 'mobx-react';
import { Emojione } from 'react-emoji-render';
import { PictureImage } from './Image';
import {
  HandleBox, InfoBox, ItemWapper, UserBox, UserName, LockIcon, Link,
} from './styles';
import { UserPopper } from './components/UserPopper';

export interface IPictureItemProps {
  detail: PictureEntity;
  lazyload?: boolean;
  size?: PictureStyle;
  like?: (data: PictureEntity) => void;
}

export const PictureItem: React.FC<IPictureItemProps> = observer(({
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
      <Link route={`/picture/${detail.id}`} />
      {
        detail.isPrivate && (
          <Popover
            openDelay={100}
            trigger="hover"
            placement="top"
            theme="dark"
            content={<span>{t('private_xx', t('picture'))}</span>}
          >
            <LockIcon>
              <Lock style={{ strokeWidth: 3 }} size={12} color="#fff" />
            </LockIcon>
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
            <Emojione
              svg
              text={detail.user.fullName}
            />
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
