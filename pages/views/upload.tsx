import Head from 'next/Head';
import * as React from 'react';

import { getImageInfo, IImageInfo, isImage } from '@pages/common/utils/image';
import { request } from '@pages/common/utils/request';
import { Button } from '@pages/components/Button';
import { withAuth } from '@pages/components/router/withAuth';
import { Upload as RCUpload } from '@pages/components/Upload';
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

const UploadBox = styled(RCUpload)`
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
  const imageRef = React.useRef<File>();
  const [imageInfo, setImageInfo] = React.useState<IImageInfo>();
  const [imageUrl, setImageUrl] = React.useState('');
  const addPicture = () => {
    if (imageRef.current) {
      const form = new FormData();
      form.append('photo', imageRef.current);
      form.append('info', JSON.stringify(imageInfo));
      request.post('/api/picture/upload', form);
    }
  };
  const handleChange = async (files: FileList | null) => {
    if (files && files[0]) {
      setFile(files[0]);
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
            onFileChange={handleChange}
            drag
          >
            {
              type => (
                <>
                  <UploadCloud size={34} style={{ pointerEvents: 'none' }} />
                  <span style={{ pointerEvents: 'none' }} >{type === 'drop' ? '松开上传' : '拖拽照片到这里'}</span>
                </>
              )
            }
          </UploadBox>
        )
      }
      <div>
        <Button
          onClick={addPicture}
        >
          <span>上传</span>
        </Button>
      </div>
    </Wapper>
  );
};

export default withAuth('user')(
  Upload,
);
