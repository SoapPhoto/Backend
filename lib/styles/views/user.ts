import { rem } from 'polished';
import styled, { css } from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';

import { href } from '@lib/common/utils/themes/common';
import { Settings } from '@lib/icon';
import { theme } from '@lib/common/utils/themes';
import { customMedia, customBreakpoints } from '@lib/common/utils/mediaQuery';
import { ChristmasHat } from '@lib/icon/ChristmasHat';
import { A } from '@lib/components/A';

export const Wrapper = styled.div``;

export const UserHeaderWrapper = styled.div`
  padding: ${rem(48)} 0;
  box-shadow: inset 0px -1px 0px
    ${_ => _.theme.layout.header.shadowColor};
`;

export const UserHeader = styled.div`
  max-width: ${_ => rem(theme('width.header')(_))};
  width: 100%;
  margin: 0 auto;
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
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  margin-top: ${rem('6px')};
  margin-bottom: ${rem('12px')};
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: ${rem(12)};
  ${customMedia.lessThan('small')`
    text-align: center;
    grid-template-columns: 1fr;
  `}
`;

export const FollowBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InfoBox = styled.div`
  margin-top: ${rem('6px')};
`;

export const Info = styled.div`
  display: flex;
  width: 100%;
  margin-left: ${rem(-12)};
  ${customMedia.lessThan('small')`
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    justify-content: space-around;
  `}
`;

export const InfoItem = styled.div<{click?: number}>`
  padding: 0 ${rem(12)};
  ${_ => (_.click ? css`
    cursor: pointer;
  ` : css``)}
  ${customMedia.lessThan('small')`
    display: flex;
    flex-direction: column;
    align-items: center;
  `}
`;

export const InfoItemCount = styled.span`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  margin-right: ${rem(8)};
  font-weight: 600;
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
  stroke: ${theme('colors.secondary')};
`;

export const Christmas = styled(ChristmasHat)`
  position: absolute;
  top: -29px;
  left: -3px;
  transform: rotate(-41deg);
`;
