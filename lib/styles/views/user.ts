import { rem } from 'polished';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';

import { href } from '@lib/common/utils/themes/common';
import { Settings } from '@lib/icon';
import media from 'styled-media-query';
import { theme } from '@lib/common/utils/themes';

export const Wrapper = styled.div``;

export const UserHeader = styled.div`
  max-width: ${rem('700px')};
  width: 100%;
  margin: 64px auto;
  padding: 0 ${rem('20px')};
`;

export const HeaderGrid = styled(Grid)`
  ${media.lessThan('small')`
    grid-template-columns: 1fr;
    grid-gap: 4px;
  `}
`;

export const AvatarBox = styled(Cell)`
  display: flex;
  ${media.lessThan('small')`
    justify-content: center;
  `}
`;

export const UserName = styled.h2`
  font-family: Rubik;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  margin-top: ${rem('6px')};
  margin-bottom: ${rem('12px')};
`;

export const Profile = styled.div`
  display: flex;
  margin-bottom: ${rem('4px')};
`;

export const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${rem('8px')};
  margin-right: ${rem('24px')};
  min-width: 0;
  font-family: Rubik;
  color: ${theme('colors.secondary')};
  & svg {
    margin-right: ${rem('4px')};
  }
`;

export const ProfileItemLink = styled.a`
  display: flex;
  align-items: center;
  ${_ => href(_.theme.colors.secondary)}
`;

export const Bio = styled.p`
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  font-family: Rubik;
`;

export const EditIcon = styled(Settings)`
  margin-left: ${rem('24px')};
  stroke: ${theme('colors.secondary')};
`;
