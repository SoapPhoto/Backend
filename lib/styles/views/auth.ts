import styled from 'styled-components';

import { box } from '@lib/common/utils/themes/common';
import { rem } from 'polished';
import { theme, activte } from '@lib/common/utils/themes';

export const Wrapper = styled.section`
  ${props => box(props.theme, '480px', true)}
  margin-top: ${rem('64px')};
  margin-bottom: ${rem('64px')};
  padding: ${rem('52px')} ${rem('80px')};
`;

export const Header = styled.header`
  margin-bottom: ${rem('36px')};
`;

export const Title = styled.h2`
  font-weight: 600;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  color: ${theme('colors.text')};
`;

export const SubTitle = styled.p`
  margin-top: ${rem(12)};
  font-weight: 400;
  color: ${theme('colors.secondary')};
`;

export const OauthIcon = styled.button`
  width: ${rem(32)};
  height: ${rem(32)};
  border-radius: 100%;
  background-color: ${theme('colors.text')};
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  cursor: pointer;
  ${activte(0.9)}
`;
