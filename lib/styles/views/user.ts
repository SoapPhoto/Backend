import { rem } from 'polished';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';

import { href } from '@lib/common/utils/themes/common';
import { Settings } from '@lib/icon';
import { theme } from '@lib/common/utils/themes';
import { customMedia } from '@lib/common/utils/mediaQuery';
import { ChristmasHat } from '@lib/icon/ChristmasHat';

export const Wrapper = styled.div``;

export const UserHeader = styled.div`
  max-width: ${rem('700px')};
  width: 100%;
  margin: ${rem(48)} auto;
  padding: 0 ${rem('20px')};
  ${customMedia.lessThan('small')`
    margin: ${rem(32)} auto;
  `}
`;

export const HeaderGrid = styled(Grid)`
  ${customMedia.lessThan('small')`
    grid-template-columns: 1fr;
    grid-gap: 4px;
  `}
`;

export const AvatarContent = styled(Cell)`
  display: flex;
  ${customMedia.lessThan('small')`
    justify-content: center;
  `}
`;

export const AvatarBox = styled(Cell)`
  position: relative;
`;

export const UserName = styled.h2`
  font-family: Rubik;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  margin-top: ${rem('6px')};
  margin-bottom: ${rem('12px')};
  ${customMedia.lessThan('small')`
    text-align: center;
  `}
`;

export const InfoBox = styled.div`
`;

export const Info = styled.div`
  display: flex;
  width: 100%;
  margin-top: ${rem('6px')};
  margin-left: ${rem(-12)};
  margin-right: ${rem(-12)};
  ${customMedia.lessThan('small')`
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    justify-content: space-around;
  `}
`;

export const InfoItem = styled.div`
  padding: 0 ${rem(12)};
  ${customMedia.lessThan('small')`
    display: flex;
    flex-direction: column;
    align-items: center;
  `}
`;

export const InfoItemCount = styled.span`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  margin-right: ${rem(8)};
  font-weight: 700;
  font-family: Rubik;
`;

export const InfoItemLabel = styled.span`
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  color: ${theme('colors.secondary')};
`;

export const Profile = styled.div`
  display: flex;
  margin-bottom: ${rem('4px')};
  ${customMedia.lessThan('small')`
    display: none;
  `}
`;

export const ProfileItem = styled.div`
  display: flex;
  align-items: center;
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
  color: ${theme('colors.secondary')};
  ${customMedia.lessThan('small')`
    text-align: center;
  `}
`;

export const EditIcon = styled(Settings)`
  margin-left: ${rem('24px')};
  stroke: ${theme('colors.secondary')};
`;

export const Christmas = styled(ChristmasHat)`
  position: absolute;
  top: -29px;
  left: -3px;
  transform: rotate(-41deg);
`;
