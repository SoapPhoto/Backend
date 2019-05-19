import React, { ReactNode } from 'react';

type DragType = 'leave' | 'drop' | 'over';

export type UploadChildren = React.ReactNode | ((type: DragType) => React.ReactNode);

export interface IUploadProps extends React.HTMLAttributes<HTMLSpanElement> {
  onFileChange: (files: FileList | null) => void;
  wrapperRef?: React.LegacyRef<HTMLSpanElement>;
  drag?: boolean;
  accept?: string;
  children?: UploadChildren;
}

export const Upload: React.FC<IUploadProps> = ({
  children,
  onFileChange,
  wrapperRef,
  onClick,
  accept = 'image/*',
  drag,
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
    if (onClick && typeof onClick === 'function') {
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
      {typeof children === 'function' ? (children as any)(dragType) : children}
    </span>
  );
};
