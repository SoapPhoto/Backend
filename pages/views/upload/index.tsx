import Head from 'next/Head';
import * as React from 'react';

import { getImageInfo, IImageInfo, isImage } from '@pages/common/utils/image';
import { request } from '@pages/common/utils/request';
import { Button } from '@pages/components/Button';
import { withAuth } from '@pages/components/router/withAuth';
import { UploadCloud } from '@pages/icon';
import { Cell, Grid } from 'styled-css-grid';
import { Box, Content, ImageBox, Input, UploadBox, Wapper } from './styles';

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
      <Box>
        {
          true ? (
            <Grid columns={10}>
              <Cell width={4}>
                <ImageBox bg={imageUrl} />
              </Cell>
              <Content width={6}>
                <Grid columns={1}>
                  <Cell>
                    <Input isTitle placeholder="标题" />
                    <Input placeholder="简介" />
                  </Cell>
                  <Cell>
                    <div>
                      <Button
                        onClick={addPicture}
                      >
                        <span>上传</span>
                      </Button>
                    </div>
                  </Cell>
                </Grid>
              </Content>
            </Grid>
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
      </Box>
    </Wapper>
  );
};

export default withAuth('user')(
  Upload,
);
