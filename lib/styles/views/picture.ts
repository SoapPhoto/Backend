import { rem } from 'polished';
import styled from 'styled-components';
import { Cell, Grid } from 'styled-css-grid';

import { Info } from '@lib/icon';
import { A } from '@lib/components/A';
import { theme, activte } from '@lib/common/utils/themes';
import { WrapperBox } from '@lib/common/utils/themes/common';
import { customMedia } from '@lib/common/utils/mediaQuery';

export const Wrapper = styled.div`
  ${WrapperBox(1000)}
  margin: 0 auto;
  margin-top: ${rem('32px')};
`;

export const UserHeader = styled(Grid)`
  margin: 0 auto;
  margin-bottom: ${rem('20px')};
  max-width: ${rem('780px')};
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

export const PictureBox = styled.div`
  border-radius: ${rem('3px')};
  overflow: hidden;
  box-shadow: ${theme('colors.shadowColor')} ${rem('0px')} ${rem('6px')} ${rem('20px')};
  ${customMedia.lessThan('medium')`
    width: calc(100% + ${rem(64)});
    margin-left: -${rem(32)};
    border-radius: 0;
  `}
`;

export const Content = styled.div`
  max-width: ${rem('780px')};
  margin: ${rem('48px')} auto;
`;

export const Title = styled.h2`
  font-size: ${theme('fontSizes[5]')};
  margin-bottom: ${rem('18px')};
`;

export const GpsCotent = styled.div`
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
  display: grid;
  grid-template-columns: max-content;
  margin-top: ${rem('18px')};
  grid-gap: ${rem('6px')};
  grid-row-gap: ${rem('6px')};
`;
