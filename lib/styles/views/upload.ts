import { rem, rgba } from 'polished';
import styled from 'styled-components';
import { Cell } from 'styled-css-grid';

import { box } from '@lib/common/utils/themes/common';
import { Input as BaseInput } from '@lib/components/Input';
import { theme } from '@lib/common/utils/themes';

export const Wapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: ${rem('64px')};
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
  z-index: 2;
  transition: .2s width ease;
`;

export const PreviewBox = styled(Cell)<{loading: boolean}>`
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
  padding-left: 0;
`;

export const Input = styled(BaseInput)<{isTitle?: boolean}>`
  input {
    font-size: ${_ => rem(_.isTitle ? _.theme.fontSizes[5] : _.theme.fontSizes[2])};
    border: none;
    background-color: transparent;
    margin-bottom: ${rem('24px')};
    height: auto;
    padding: ${rem('12px')} 0;
    box-shadow: none !important;
    border-bottom: 1px solid ${theme('colors.gray')} !important;
    border-radius: 0;
    &:focus {
      border-color: ${theme('colors.primary')} !important;
    }
  }
`;

export const FormTag = styled(Cell)`
  margin-top: ${() => rem('24px')};
`;
