import Head from 'next/Head';
import React from 'react';
import Switch from 'react-switch';

import { getTitle } from '@lib/common/utils';
import { getImageInfo, IImageInfo, isImage } from '@lib/common/utils/image';
import { request } from '@lib/common/utils/request';
import { Button } from '@lib/components/Button';
import { withAuth } from '@lib/components/router/withAuth';
import Tag from '@lib/components/Tag';
import Toast from '@lib/components/Toast';
import { UploadCloud } from '@lib/icon';
import { Router } from '@lib/routes';
import {
  Box,
  Content,
  FormInfo,
  FormLabel,
  FormMessage,
  FormTag,
  FormTitle,
  ImageBox,
  Input,
  UploadBox,
  Wapper,
} from '@lib/styles/views/upload';
import { useObservable, useObserver } from 'mobx-react-lite';
import { Cell, Grid } from 'styled-css-grid';

interface ICreatePictureData {
  isPrivate: boolean;
  title: string;
  bio: string;
  tags: string[];
}

const Upload: React.FC = () => {
  const imageRef = React.useRef<File>();
  const [imageInfo, setImageInfo] = React.useState<IImageInfo>();
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLocation, setIsLocation] = React.useState(true);
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const data = useObservable<ICreatePictureData>({
    isPrivate: false,
    title: '',
    bio: '',
    tags: [],
  });

  const addPicture = async () => {
    setUploadLoading(true);
    if (imageRef.current) {
      const form = new FormData();
      const info = imageInfo;
      if (!isLocation && info && info.exif && info.exif.location) {
        delete info.exif.location;
      }
      form.append('photo', imageRef.current);
      form.append('info', JSON.stringify(info));
      form.append('title', data.title);
      form.append('bio', data.bio);
      form.append('isPrivate', data.isPrivate ? '1' : '0');
      form.append('tags', JSON.stringify(data.tags.map(tag => ({ name: tag }))));
      try {
        await request.post('/api/picture/upload', form);
        setDisabled(true);
        Toast.success('上传成功！');
        setTimeout(() => {
          Router.pushRoute('/');
        }, 100);
      } finally {
        setUploadLoading(false);
      }
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
      console.log(info);
      setImageUrl(url);
      setImageInfo(info);
    } else {
      Toast.warning('图片格式错误');
    }
  };
  return useObserver(() => (
    <Wapper>
      <Head>
        <title>{getTitle('上传')}</title>
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
                      value={data.title}
                      onChange={e => data.title = e.target.value}
                    />
                    <Input
                      placeholder="简介"
                      value={data.bio}
                      onChange={e => data.bio = e.target.value}
                    />
                  </Cell>
                  <FormInfo>
                    <FormLabel>
                      <FormTitle>私人</FormTitle>
                      <FormMessage>仅自己可见</FormMessage>
                    </FormLabel>
                    <Switch
                      checked={data.isPrivate}
                      onChange={checked => data.isPrivate = checked}
                      onColor="#05f"
                      onHandleColor="#fff"
                      handleDiameter={18}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="none"
                      activeBoxShadow="none"
                      height={22}
                      width={40}
                    />
                  </FormInfo>
                  {
                    imageInfo && imageInfo.exif && imageInfo.exif.location && (
                      <FormInfo>
                        <FormLabel>
                          <FormTitle>分享位置信息</FormTitle>
                          <FormMessage>所有人都可以看到你图片拍摄的位置信息</FormMessage>
                        </FormLabel>
                        <Switch
                          checked={isLocation}
                          onChange={checked => setIsLocation(checked)}
                          onColor="#05f"
                          onHandleColor="#fff"
                          handleDiameter={18}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          boxShadow="none"
                          activeBoxShadow="none"
                          height={22}
                          width={40}
                        />
                      </FormInfo>
                    )
                  }
                  <FormTag>
                    <Tag value={data.tags} onChange={tags => data.tags = tags} />
                  </FormTag>
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
  ));
};

export default withAuth('user')(
  Upload,
);
