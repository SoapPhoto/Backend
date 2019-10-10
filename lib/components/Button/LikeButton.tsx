import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';

import { Heart } from '@lib/icon';
import { useTranslation } from '@lib/i18n/useTranslation';
import { IconButton } from './IconButton';

interface IProps {
  size?: number;
  color?: string;
  isLike: boolean;
  popover?: boolean;
  onLike(): Promise<void>;
}

const HeartIcon = styled(Heart)<{like: boolean; color?: string}>`
  fill: ${_ => (_.like ? _.theme.colors.danger : 'none')};
  stroke: ${_ => (_.like ? _.theme.colors.danger : _.color || '#fff')};
  transition: .2s fill ease, .2s stroke ease, .2s transform ease;
`;

export const LikeButton: React.FC<IProps> = ({
  isLike,
  color,
  size = 18,
  onLike = async () => null,
}) => {
  const { t } = useTranslation();
  const disabled = useRef<boolean>(false);
  const onClick = useCallback(async () => {
    if (disabled.current) {
      return;
    }
    disabled.current = true;
    await onLike();
    disabled.current = false;
  }, [onLike]);
  return (
    <IconButton onClick={onClick} popover={isLike ? t('un_like') : t('like')}>
      <HeartIcon like={(isLike ? 1 : 0 as any) as boolean} color={color} size={size} />
    </IconButton>
  );
};
