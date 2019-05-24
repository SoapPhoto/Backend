import Head from 'next/Head';
import * as React from 'react';

import { getImageInfo, IImageInfo, isImage } from '@pages/common/utils/image';
import { request } from '@pages/common/utils/request';
import { Button } from '@pages/components/Button';
import { withAuth } from '@pages/components/router/withAuth';
import Tag from '@pages/components/Tag';
import Toast from '@pages/components/Toast';
import { UploadCloud } from '@pages/icon';
import { Router } from '@pages/routes';
import { Maybe } from '@typings/index';
import { Cell, Grid } from 'styled-css-grid';
import { Box, Content, ImageBox, Input, UploadBox, Wapper } from './styles';

const Upload: React.FC = () => {
  const imageRef = React.useRef<File>();
  const [imageInfo, setImageInfo] = React.useState<IImageInfo>();
  const [title, setTitle] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [imageUrl, setImageUrl] = React.useState('');
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const addPicture = async () => {
    setUploadLoading(true);
    if (imageRef.current) {
      const form = new FormData();
      form.append('photo', imageRef.current);
      form.append('info', JSON.stringify(imageInfo));
      form.append('title', title);
      form.append('bio', bio);
      form.append('tags', JSON.stringify(tags.map(tag => ({ name: tag }))));
      await request.post('/api/picture/upload', form);
      setUploadLoading(false);
      setDisabled(true);
      Toast.success('上传成功！');
      Router.pushRoute('/');
    }
  };
  const handleChange = async (files: Maybe<FileList>) => {
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
          imageUrl ? (
            <Grid columns="40% 1fr" gap="36px">
              <Cell>
                <ImageBox bg={imageUrl} />
              </Cell>
              <Content>
                <Grid columns={1}>
                  <Cell>
                    <Input
                      isTitle
                      placeholder="标题"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                    <Input
                      placeholder="简介"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                    />
                    <div>
                      <Tag value={tags} onChange={setTags} />
                    </div>
                  </Cell>
                  <Cell
                    style={{ textAlign: 'right' }}
                  >
                    <Button
                      onClick={addPicture}
                      loading={uploadLoading}
                      disabled={disabled}
                    >
                      <span>上传</span>
                    </Button>
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
