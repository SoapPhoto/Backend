import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { theme } from '@lib/common/utils/themes';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { useTranslation } from '@lib/i18n/useTranslation';
import { Loading } from '../Loading';

interface IEmptyProps {
  loading?: boolean;
  size?: 'small' | 'large';
}

const Wrapper = styled.div<{size?: 'small' | 'large'}>`
  text-align: center;
  height: ${rem('120px')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${_ => rem(_.theme.fontSizes[4])};
  color: ${theme('colors.secondary')};
  font-weight: 400;
  ${_ => _.size === 'small' && `
    height: ${rem('80px')};
    font-size: ${rem(_.theme.fontSizes[3])};
  `}
`;

export const Empty: React.FC<IEmptyProps> = ({
  loading = false,
  size,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const loadingSize = size === 'small' ? 6 : 8;
  return (
    <Wrapper size={size}>
      {
        loading ? (
          <Loading size={loadingSize} color={colors.secondary} />
        ) : (
          <span>{t('no_more')}</span>
        )
      }
    </Wrapper>
  );
};
