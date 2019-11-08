import React from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { Upload as RCUpload } from '@lib/components/Upload';
import { theme } from '@lib/common/utils/themes';
import { UploadCloud } from '@lib/icon';

interface IProps {
  onFileChange: (files: FileList | null) => void;
}

export const Upload = styled(RCUpload)`
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: ${rem('200px')};
  max-width: ${_ => rem(theme('width.wrapper')(_))};
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

export const UploadBox: React.FC<IProps> = ({
  onFileChange,
}) => (
  <Upload
    onFileChange={onFileChange}
    drag={(1 as any) as boolean}
  >
    {
      type => (
        <>
          <UploadCloud
            size={34}
            style={{ pointerEvents: 'none' }}
          />
          <span
            style={{ pointerEvents: 'none' }}
          >
            {type === 'drop' ? '松开上传' : '拖拽照片到这里'}
          </span>
        </>
      )
    }
  </Upload>
);
