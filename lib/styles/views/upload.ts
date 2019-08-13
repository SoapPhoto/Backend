import { rem } from 'polished';
import styled from 'styled-components';
import { Cell } from 'styled-css-grid';

import { box } from '@lib/common/utils/themes/common';
import { Input as BaseInput } from '@lib/components/Input';
import { Upload as RCUpload } from '@lib/components/Upload';
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

export const UploadBox = styled(RCUpload)`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${rem('200px')};
  max-width: ${rem('1000px')};
  border-radius: ${rem('3px')};
  border: 2px dashed ${theme('styles.box.borderColor')};
  background-color: ${theme('styles.box.background')};
  color: ${theme('colors.text')};
  margin: 24px;
  & svg {
    color: ${theme('colors.text')};
    margin-bottom: ${rem('12px')};
  }
`;

export const Box = styled.div`
  ${props => box(props.theme, '100%', true)}
  max-width: ${rem('1000px')};
  width: 100%;
  margin: 0 auto;
  padding: 0;
`;

export const PreviewBox = styled(Cell)`
  position: relative
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
`;

export const FormInfo = styled(Cell)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${() => rem('12px')};
`;

export const FormLabel = styled.div`

`;

export const FormTitle = styled.p`
  font-size: ${theme('fontSizes[1]')};
  color: ${theme('colors.text')};
  margin-bottom: 4px;
`;

export const FormMessage = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  color: ${theme('colors.secondary')};
`;

export const FormTag = styled(Cell)`
  margin-top: ${() => rem('24px')};
`;
