import { rem, rgba } from 'polished';
import styled from 'styled-components';
import { Cell, Grid } from 'styled-css-grid';

import { box } from '@lib/common/utils/themes/common';
import { Input as BaseInput, Textarea } from '@lib/components/Input';
import { theme, initButton } from '@lib/common/utils/themes';
import { IconButton } from '@lib/components/Button';
import { customMedia } from '@lib/common/utils/mediaQuery';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: ${rem('64px')};
  margin-bottom: ${rem('64px')};
  padding: 0 ${rem('24px')};
`;

export const Image = styled.img`
  max-width: ${rem('600px')};
  max-height: ${rem('600px')};
`;

export const Box = styled.div`
  ${props => box(props.theme, '100%', true)}
  max-width: ${rem('1000px')};
  width: 100%;
  margin: 0 auto;
  padding: 0;
`;

export const Progress = styled.div`
  position: absolute;
  height: ${rem(3)};
  background: ${theme('colors.primary')};
  bottom: 0;
  left: 0;
  width: 0px;
  height: 100%;
  z-index: 2;
  transition: .2s width ease;
`;

export const PreviewBox = styled(Cell)<{loading: number}>`
  position: relative;
  &::before {
    content: "";
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: ${rgba('#000', 0.3)};
    width: 100%;
    z-index: 1;
    opacity: 0;
    transition: .2s opacity ease;
  }
  ${_ => _.loading && `
    &::before {
      opacity: 1;
    }
  `}
`;

export const Preview = styled.img`
  position: absolute;
  border-radius: ${rem('3px')};
  width: 100%;
  height: auto;
  font-family: "object-fit:cover";
  -o-object-fit: cover;
  object-fit: cover;
  height: 100%;
`;

export const Content = styled(Cell)`
  padding: ${rem('24px')};
  ${customMedia.greaterThan('medium')`
    padding-left: 0;
  `}
`;

export const Input = styled(BaseInput)<{isTitle?: boolean}>`
  margin-bottom: ${rem('24px')};
  input {
    font-size: ${_ => rem(_.isTitle ? _.theme.fontSizes[5] : _.theme.fontSizes[2])};
    border: none;
    background-color: transparent;
    height: auto;
    padding: ${rem('12px')} 0;
    box-shadow: none !important;
    border-bottom: 1px solid ${theme('colors.gray')};
    border-radius: 0;
    &:focus, &:hover {
      border-color: ${theme('colors.primary')};
    }
  }
`;

export const TextArea = styled(Textarea)`
  font-size: ${_ => rem(_.theme.fontSizes[2])};
  /* border: none; */
  background-color: transparent;
  margin-bottom: ${rem('24px')};
  height: auto;
  padding: ${rem('12px')} 0;
  box-shadow: none !important;
  border-left: none;
  border-top: none;
  border-right: none;
  /* border-bottom: 1px solid ${theme('colors.gray')} !important; */
  border-radius: 0;
`;

export const FormTag = styled(Cell)`
  margin-top: ${() => rem('24px')};
`;

export const ContentBox = styled(Grid)`
  ${customMedia.lessThan('medium')`
    grid-template-rows: ${rem(120)} 1fr;
    grid-template-columns: auto;
    grid-gap: ${rem(12)};
  `}
`;

export const TrashIcon = styled(IconButton)`
  position: absolute;
  right: ${rem(12)};
  top: ${rem(12)};
  background: ${_ => rgba(_.theme.colors.pure, 0.8)};
  border-radius: ${rem(28)};
  height: ${rem(28)};
  width: ${rem(28)};
  color: ${theme('colors.danger')};
  @supports (backdrop-filter: saturate(180%) blur(20px)) {
    background-color: ${_ => rgba(_.theme.colors.pure, 0.8)};
    & { backdrop-filter: saturate(180%) blur(20px); }
  }
`;

export const PreviewHandleContent = styled.section`
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
`;

export const PreviewBtn = styled(motion.button)`
  ${initButton}
  font-size: ${_ => rem(theme('fontSizes[0]')(_))};
  display: flex;
  align-items: center;
  position: absolute;
  background: ${_ => rgba(_.theme.colors.pure, 0.8)};
  padding: ${rem(2)} ${rem(14)};
  left: ${rem(12)};
  top: ${rem(12)};
  border-radius: ${rem(28)};
  height: ${rem(28)};
  color: ${theme('colors.secondary')};
  @supports (backdrop-filter: saturate(180%) blur(20px)) {
    background-color: ${_ => rgba(_.theme.colors.pure, 0.8)};
    & { backdrop-filter: saturate(180%) blur(20px); }
  }
  svg {
    margin-right: ${rem(4)};
  }
`;
