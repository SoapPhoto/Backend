import { isFunction } from 'lodash';
import React from 'react';

type DragType = 'leave' | 'drop' | 'over';

export type UploadChildren = React.ReactNode | ((type: DragType) => React.ReactNode);

export interface IUploadProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 文件上传事件
   *
   * @memberof IUploadProps
   */
  onFileChange: (files: FileList | null) => void;
  wrapperRef?: React.LegacyRef<HTMLSpanElement>;
  /**
   * 是否拖动上传
   *
   * @type {boolean}
   * @memberof IUploadProps
   */
  drag?: boolean;
  /**
   * 文件过滤
   *
   * @type {string}
   * @memberof IUploadProps
   */
  accept?: string;
  children: UploadChildren;
}

export const Upload: React.FC<IUploadProps> = ({
  children,
  onFileChange,
  wrapperRef,
  onClick,
  accept = 'image/*',
  ...restProps
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragType, setDragType] = React.useState<DragType>('leave');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files);
    e.target.value = '';
  };
  const uploadImage = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    inputRef.current!.click();
    if (isFunction(onClick)) {
      onClick(e);
    }
  };
  const onFileDrop = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (e.type === 'dragover') {
      if (dragType !== 'drop') {
        setDragType('drop');
      }
      return;
    }
    setDragType('over');
    onFileChange(e.dataTransfer.files);
  };
  const onFileLeave = () => {
    setDragType('leave');
  };
  const onFileEnter = () => {
    setDragType('drop');
  };
  const event: Partial<React.HTMLAttributes<HTMLSpanElement>> = {
    onClick: uploadImage,
    onDrop: onFileDrop,
    onDragOver: onFileDrop,
    onDragLeave: onFileLeave,
    onDragEnter: onFileEnter,
  };
  return (
    <span
      onClick={uploadImage}
      ref={wrapperRef}
      {...event}
      {...restProps}
    >
      <input
        accept={accept}
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={{ visibility: 'hidden', width: '0px', height: '0px' }}
      />
      {isFunction(children) ? children(dragType) : children}
    </span>
  );
};
