import { rem } from 'polished';
import styled from 'styled-components';
import { Cell } from 'styled-css-grid';

import { box } from '@pages/common/utils/themes/common';
import { Input as BaseInput } from '@pages/components/Input';
import { Upload as RCUpload } from '@pages/components/Upload';

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

export const UploadBox = styled(RCUpload)`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${rem('200px')};
  max-width: ${rem('1000px')};
  width: 100%;
  border-radius: ${rem('3px')};
  border: 2px dashed ${_ => _.theme.styles.box.borderColor};
  background-color: ${_ => _.theme.styles.box.background};
  color: ${props => props.theme.colors.text};
  & svg {
    color: ${props => props.theme.colors.text};
    margin-bottom: ${rem('12px')};
  }
`;

export const Box = styled.div`
  ${props => box(props.theme, '100%', true)}
  max-width: ${rem('1000px')};
  width: 100%;
  margin: 0 auto;
`;

export const ImageBox = styled.div<{bg: string}>`
  height: ${rem('350px')};
  border-radius: ${rem('3px')};
  background-image: url(${_ => _.bg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const Content = styled(Cell)`
`;

export const Input = styled(BaseInput)<{isTitle?: boolean}>`
  font-size: ${_ => rem(_.isTitle ? 34 : 16)};
  border: none;
  background-color: transparent;
  margin-bottom: ${rem('24px')};
  height: auto;
  padding: ${rem('12px')} 0;
  box-shadow: none !important;
  border-bottom: 1px solid ${_ => _.theme.colors.gray} !important;
  border-radius: 0;
  &:focus {
    border-color: ${_ => _.theme.colors.primary} !important;
  }
`;
