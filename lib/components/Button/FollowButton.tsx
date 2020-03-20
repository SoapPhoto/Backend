import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { observer } from 'mobx-react';

import { theme } from '@lib/common/utils/themes';
import { ArrowHorizontal, StrutAlign } from '@lib/icon';
import { useTranslation } from '@lib/i18n/useTranslation';
import { rem } from 'polished';
import { UserEntity } from '@lib/common/interfaces/user';
import { useAccountStore } from '@lib/stores/hooks';
import { Button, IButtonProps } from '.';

interface IProps extends IButtonProps {
  isFollowing: number;
  user: UserEntity;
}

const LButton = styled(Button)<{isFollowing: number;unContent: string}>`
  position: relative;
  min-width: ${rem(70)};
  ${_ => (_.isFollowing !== 0 ? css`
    background: ${theme('colors.gray')(_)};
    color: ${theme('colors.secondary')(_)};
    border-color: ${theme('colors.gray')(_)};
    &:hover {
      color: ${theme('colors.pure')(_)};
      background-color: ${theme('colors.danger')(_)};
      border-color: ${theme('colors.danger')(_)};
      & span {
        opacity: 0;
      }
      &::before {
        content: '${_.unContent}';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  ` : css``)}
  > span {
    display: inline-block;
    width: 100%;
  }
`;

export const FollowButton: React.FC<IProps> = observer(({
  isFollowing, user, ...rest
}) => {
  const { t } = useTranslation();
  const { userInfo } = useAccountStore();
  const isMe = useMemo(() => userInfo && userInfo.username === user.username, [user.username, userInfo]);
  let content = t('follow.btn.follow');
  if (isFollowing === 1) content = t('follow.btn.following');
  if (isFollowing === 2) content = t('follow.btn.mutual_following');
  // 不允许自己关注自己，直接隐藏
  if (isMe) return null;
  return (
    <LButton
      {...rest}
      unContent={t('follow.btn.un_follow')}
      isFollowing={isFollowing}
    >
      <span>
        {isFollowing === 2 && (<StrutAlign><ArrowHorizontal style={{ marginRight: rem(4) }} size={11} /></StrutAlign>)}
        {content}
      </span>
    </LButton>
  );
});
