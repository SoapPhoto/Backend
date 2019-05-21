import styled from 'styled-components';

import { box } from '@pages/common/utils/themes/common';
import { Input as BaseInput } from '@pages/components/Input';
import { Upload as RCUpload } from '@pages/components/Upload';

export const Wapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 64px;
  padding: 0 24px;
`;

export const Image = styled.img`
  max-width: 600px;
  max-height: 600px;
`;

export const UploadBox = styled(RCUpload)`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 200px;
  max-width: 1000px;
  width: 100%;
  border-radius: 3px;
  border: 2px dashed ${_ => _.theme.styles.box.borderColor};
  background-color: ${_ => _.theme.styles.box.background};
  color: ${props => props.theme.colors.text};
  & svg {
    color: ${props => props.theme.colors.text};
    margin-bottom: 12px;
  }
`;

export const Box = styled.div`
  ${props => box(props.theme, '100%', true)}
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

export const ImageBox = styled.div<{bg: string}>`
  height: 350px;
  border-radius: 3px;
  background-image: url(${_ => _.bg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const FormBox = styled.div`
  margin-top: 48px;
`;

export const Input = styled(BaseInput)<{isTitle?: boolean}>`
  border: none;
  box-shadow: none !important;
  font-size: ${_ => _.isTitle ? 34 : 16}px;
  text-align: center;
  margin-bottom: 12px;
`;
