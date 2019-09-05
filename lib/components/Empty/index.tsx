import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { theme } from '@lib/common/utils/themes';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { useTranslation } from '@lib/i18n/useTranslation';
import { Loading } from '../Loading';

interface IEmptyProps {
  loading?: boolean;
}

const Wrapper = styled.div`
  text-align: center;
  height: ${rem('120px')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${_ => rem(_.theme.fontSizes[4])};
  color: ${theme('colors.secondary')};
  font-weight: 400;
`;

export const Empty: React.FC<IEmptyProps> = ({
  loading = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <Wrapper>
      {
        loading ? (
          <Loading size={9} color={colors.secondary} />
        ) : (
          <span>{t('no_more')}</span>
        )
      }
    </Wrapper>
  );
};
