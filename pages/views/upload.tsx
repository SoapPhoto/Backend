import Head from 'next/Head';
import * as React from 'react';

import { getImageInfo, IImageInfo, isImage } from '@pages/common/utils/image';
import { request } from '@pages/common/utils/request';
import { withAuth } from '@pages/components/router/withAuth';
import { UploadCloud } from '@pages/icon';
import styled from 'styled-components';

const Wapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 64px;
  padding: 0 24px;
`;

const Image = styled.img`
  max-width: 600px;
  max-height: 600px;
`;

const UploadBox = styled.div`
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

const ImageBox = styled.div<{bg: string}>`
  height: 350px;
  max-width: 1000px;
  width: 100%;
  border-radius: 3px;
  background-image: url(${_ => _.bg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Upload = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const imageRef = React.useRef<File>();
  const dragRef = React.useRef<HTMLDivElement>();
  const [imageInfo, setImageInfo] = React.useState<IImageInfo>();
  const [imageUrl, setImageUrl] = React.useState('');
  const [dragState, setDragState] = React.useState('close');
  const addPicture = () => {
    if (imageRef.current) {
      const form = new FormData();
      form.append('photo', imageRef.current);
      form.append('info', JSON.stringify(imageInfo));
      request.post('/api/picture/upload', form);
    }
  };
  const uploadImage = () => {
    inputRef.current!.click();
  };
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const setFile = async (file: File) => {
    if (isImage(file.name)) {
      imageRef.current = file;
      const [info, url] = await getImageInfo(file);
      setImageUrl(url);
      setImageInfo(info);
    } else {
      console.info('图片格式错误');
    }
  };
  const uploadRef = (e: HTMLDivElement | null) => {
    if (e && !dragRef.current) {
      dragRef.current = e;
      e.addEventListener('dragenter', () => {
        setDragState('on');
      });
      e.addEventListener('dragleave', () => {
        setDragState('close');
      });
      e.addEventListener('drop', (event) => {
        event.preventDefault();
        setDragState('close');
        const files = event.dataTransfer!.files;
        if (files && files[0]) {
          setFile(files[0]);
        }
      });
      e.addEventListener('dragover', (event) => {
        event.preventDefault();
      });
      e.addEventListener('dragend', (event) => {
        event.preventDefault();
      });
    }
  };
  return (
    <Wapper>
      <Head>
        <script src="//unpkg.com/exif-js@2.3.0/exif.js" />
        <script src="//unpkg.com/fast-average-color@5.0.0/dist/index.js" />
      </Head>
      {
        imageUrl ? (
          <ImageBox bg={imageUrl} />
        ) : (
          <UploadBox
            onClick={uploadImage}
            ref={uploadRef as any}
          >
            <UploadCloud size={34} />
            <span>{dragState === 'on' ? '松开上传' : '拖拽照片到这里'}</span>
          </UploadBox>
        )
      }
      <input
        accept="image/*"
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={{ visibility: 'hidden' }}
      />
      <div>
        <button
          onClick={addPicture}
        >
          <span>上传</span>
        </button>
      </div>
    </Wapper>
  );
};

export default withAuth('user')(
  Upload,
);
