import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { theme } from '@lib/common/utils/themes';
import { href } from '@lib/common/utils/themes/common';

const Wrapper = styled.footer`
  display: flex;
  padding: ${rem(14)} ${rem(24)};
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
`;

const A = styled.a`
  ${_ => href(_.theme.colors.secondary)}
`;

export const Footer = () => (
  <Wrapper>
    <div style={{ marginRight: rem(24) }}>©2019 All Rights Reserved</div>
    <div><A target="__blank" href="http://www.miitbeian.gov.cn/">闽ICP备18021344号-1</A></div>
  </Wrapper>
);
