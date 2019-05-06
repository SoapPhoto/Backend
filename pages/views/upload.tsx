import Head from 'next/Head';
import * as React from 'react';

import { getImageInfo, IImageInfo } from '@pages/common/utils/image';
import { request } from '@pages/common/utils/request';
import { withAuth } from '@pages/components/router/withAuth';
import { withRouter } from 'next/router';
import styled from 'styled-components';

const Wapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Image = styled.img`
  max-width: 600px;
  max-height: 600px;
`;

const Upload = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
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
  const uploadImage = () => {
    inputRef.current!.click();
  };
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      imageRef.current = e.target.files[0];
      const [info, url] = await getImageInfo(e.target.files[0]);
      setImageUrl(url);
      setImageInfo(info);
    }
  };
  return (
    <Wapper>
      <Head>
        <script src="//unpkg.com/exif-js@2.3.0/exif.js" />
        <script src="//unpkg.com/fast-average-color@5.0.0/dist/index.js" />
      </Head>
      {
        imageUrl &&
        <Image src={imageUrl} />
      }
      <input
        accept="image/*"
        type="file"
        ref={inputRef}
        onChange={handleChange}
        style={{ visibility: 'hidden' }}
      />
      <button onClick={uploadImage}>选择图片</button>
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
