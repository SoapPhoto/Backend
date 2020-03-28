import { rem, math, rgba } from 'polished';
import styled from 'styled-components';
import { Cell, Grid } from 'styled-css-grid';

import { Info, Heart, MapPin } from '@lib/icon';
import { A } from '@lib/components/A';
import { theme, activate, initButton } from '@lib/common/utils/themes';
import { WrapperBox } from '@lib/common/utils/themes/common';
import { customMedia, customBreakpoints } from '@lib/common/utils/mediaQuery';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  /* ${WrapperBox(1000)};
  margin: ${rem('24px')} auto 0; */
`;

export const UserHeaderWrapper = styled.div`
  box-shadow: inset 0px -1px 0px
    ${_ => _.theme.layout.header.shadowColor};
`;

export const UserHeader = styled(Grid)`
  margin: 0 auto;
  max-width: calc(${rem(customBreakpoints.medium)} + ${rem(42)});
  padding: ${rem(12)} ${rem(24)};
  /* max-width: calc(${rem(customBreakpoints.medium)} + ${rem(42)}); */
`;

export const UserLink = styled(A)`
  display: flex;
  text-decoration: none;
  align-items: center;
  color: ${theme('colors.text')};
`;

export const UserName = styled.h3`
  font-size: ${_ => rem(theme('fontSizes[2]')(_))};
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

export const UserHeaderHandleBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const PictureWrapper = styled.article`
  background-color: ${theme('layout.picture.wrapper.backgroundColor')};
  padding: ${rem(24)} ${rem(24)};
`;

export const PictureBox = styled.div<{num: number}>`
  box-shadow: ${theme('colors.shadowColor')} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  cursor: zoom-in;
  width: 100%;
  /* max-width: ${rem(math(`${customBreakpoints.medium} + 120px`))}; */
  margin: 0 auto;
  ${customMedia.greaterThan('mobile')`
    max-width: calc(calc(100vh - ${rem(138 + 48)}) * ${_ => (_ as any).num});
    min-width: 500px;
  `}
  ${customMedia.lessThan('mobile')`
    border-radius: 0;
  `}
`;

export const Content = styled.div`
  max-width: calc(${rem(customBreakpoints.medium)} + ${rem(42)});
  margin: ${rem('34px')} auto;
  padding: 0 ${rem(24)};
  margin-top: 0;
`;

export const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[4]')(_))};
  margin-bottom: ${rem(18)};
`;

export const GpsContent = styled.div`
  position: relative;
  margin: ${rem('24px')} 0;
`;

export const LocationBox = styled.div`
  position: absolute;
  left: ${rem(12)};
  top: ${rem(12)};
  display: flex;
  align-items: center;
  background: ${_ => rgba(_.theme.colors.pure, 0.6)};
  border-radius: ${rem(28)};
  height: ${rem(28)};
  padding: 0 ${rem(12)};
  @supports (backdrop-filter: saturate(180%) blur(20px)) {
    background-color: ${_ => rgba(_.theme.colors.pure, 0.8)};
    & { backdrop-filter: saturate(180%) blur(20px); }
  }
`;

export const PictureBaseInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme('colors.secondary')};
  padding: ${rem(18)} 0;
  margin-bottom: ${rem(18)};
  box-shadow: inset 0px -1px 0px
    ${_ => _.theme.layout.header.shadowColor};
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
  margin-top: ${rem('16px')};
`;

export const InfoButton = styled(Info)`
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s;
  ${activate(0.7)}
`;

export const TagBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${rem('16px')};
  margin-bottom: ${rem(6)};
  & > a {
    &:last-child {
      margin-right: ${rem(0)};
    }
    margin-right: ${rem(12)};
  }
`;

export const TagA = styled(A)`
  display: flex;
  align-items: center;
  > svg {
    margin-top: -2px;
  }
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
  max-width: calc(${rem(customBreakpoints.medium)} + ${rem(42)});
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

export const LikeContent = styled(motion.button)`
  ${initButton}
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${_ => rgba(_.theme.colors.gray, 0.8)};
  padding: ${rem(6)} ${rem(16)};
  font-family: Rubik;
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  border: none;
  border-radius: 20px;
  line-height: 20px;
  font-weight: 600;
  color: ${theme('colors.secondary')};
`;

export const HeartIcon = styled(Heart)<{islike: number}>`
  stroke: ${theme('colors.danger')};
  fill: ${_ => (_.islike ? _.theme.colors.danger : 'none')};
  stroke: ${_ => (_.islike ? _.theme.colors.danger : _.theme.colors.secondary || '#fff')};
  margin-right: ${rem(6)};
`;

export const TimeSpan = styled.span`
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
`;

export const MapIcon = styled(MapPin)`
  margin-right: 3px;
`;

export const CommentWrapper = styled.div`
  max-width: calc(${rem(customBreakpoints.medium)} + ${rem(42)});
  padding: 0 ${rem(24)};
  margin: 0 auto;
`;

export const Choice = styled.span`
  margin-right: ${rem(12)};
`;
