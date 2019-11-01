import { rem, math } from 'polished';
import styled from 'styled-components';
import { Cell, Grid } from 'styled-css-grid';

import { Info } from '@lib/icon';
import { A } from '@lib/components/A';
import { theme, activte } from '@lib/common/utils/themes';
import { WrapperBox } from '@lib/common/utils/themes/common';
import { customMedia, customBreakpoints } from '@lib/common/utils/mediaQuery';

export const Wrapper = styled.div`
  ${WrapperBox(1400)};
  margin: ${rem('32px')} auto 0;
`;

export const UserHeader = styled(Grid)`
  margin: 0 auto ${rem('20px')};
  max-width: ${rem(customBreakpoints.large)};
`;

export const UserLink = styled(A)`
  display: flex;
  text-decoration: none;
  align-items: center;
  color: ${theme('colors.text')};
`;

export const UserName = styled.h3`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
`;

export const UserInfo = styled(Cell)`
  display: flex;
  align-items: center;
`;

export const UserHeaderInfo = styled(Cell)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const PictureBox = styled.div`
  border-radius: ${rem('3px')};
  overflow: hidden;
  box-shadow: ${theme('colors.shadowColor')} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  cursor: zoom-in;
  ${customMedia.lessThan('medium')`
    width: calc(100% + ${rem(64)});
    margin-left: -${rem(32)};
    border-radius: 0;
  `}
`;

export const Content = styled.div`
  max-width: ${rem(customBreakpoints.large)};
  margin: ${rem('48px')} auto;
`;

export const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[5]')(_))};
  margin-bottom: ${rem('18px')};
`;

export const GpsContent = styled.div`
  margin: ${rem('24px')} 0;
`;

export const PictureBaseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme('colors.secondary')};
`;

export const BaseInfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  color: ${theme('colors.secondary')};
  & svg {
    margin-right: ${rem('6px')};
    margin-top: -${rem('2px')};
  }
`;

export const BaseInfoHandleBox = styled(Grid)`
  /* display: flex;
  align-items: center; */
  grid-gap: ${rem('10px')};
`;

export const Bio = styled.div`
  font-size: ${_ => rem(theme('fontSizes[2]')(_))};
  margin-top: ${rem('18px')};
`;

export const InfoButton = styled(Info)`
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s;
  ${activte(0.7)}
`;

export const TagBox = styled.div`
  display: flex;
  margin-top: ${rem('18px')};
  & > a {
    margin-right: ${rem('6px')};
  }
  /* grid-gap: ${rem('6px')};
  grid-row-gap: ${rem('6px')}; */
`;

export const RelateCollectionTitle = styled.h3`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  margin-bottom: ${rem('12px')};
  ${customMedia.lessThan('mobile')`
    margin-left: ${rem(34)};
    margin-right: ${rem(34)};
  `}
`;


export const RelateCollection = styled.div`
  max-width: ${rem(customBreakpoints.large)};
  margin: ${rem('48px')} auto;
  ${customMedia.lessThan('mobile')`
    margin-left: -${rem(32)};
    width: calc(100% + ${rem(64)});
  `}
`;

const columnsMinWidth = math(`(${customBreakpoints.mobile} - 64px - 24px) / 3`);

export const RelateCollectionList = styled.div`
  width: 100%;
  min-width: min-content;
  display: grid;
  grid-template-columns: repeat(3 ,minmax(${columnsMinWidth}, 1fr));
  grid-gap: ${rem(12)};
  ${customMedia.lessThan('mobile')`
    padding-left: ${rem(34)};
    padding-right: ${rem(34)};
  `}
`;
