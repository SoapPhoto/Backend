import Head from 'next/head';
import React, { useCallback, useState } from 'react';

import { getTitle } from '@lib/common/utils';
import { getImageInfo, IImageInfo, isImage } from '@lib/common/utils/image';
import { request } from '@lib/common/utils/request';
import { Button, IconButton } from '@lib/components/Button';
import { withAuth } from '@lib/components/router/withAuth';
import Tag from '@lib/components/Tag';
import Toast from '@lib/components/Toast';
import {
  Box,
  TrashIcon,
  ContentBox,
  Content,
  FormTag,
  Input,
  Wapper,
  PreviewBox,
  Preview,
  Progress,
} from '@lib/styles/views/upload';
import { Cell, Grid } from 'styled-css-grid';
import { Switch } from '@lib/components/Switch';
import { uploadQiniu } from '@lib/services/file';
import { UploadBox } from '@lib/containers/Upload/UploadBox';
import { ICustomNextPage } from '@lib/common/interfaces/global';
import { useRouter } from '@lib/router';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { Trash2 } from '@lib/icon';
import { UploadType } from '@common/enum/upload';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {

}

interface ICreatePictureData {
  isPrivate: boolean;
  title: string;
  bio: string;
  tags: string[];
}

const initUploadData = {
  isPrivate: false,
  title: '',
  bio: '',
  tags: [],
};

const Upload: ICustomNextPage<IProps, any> = () => {
  const { pushRoute } = useRouter();
  const imageRef = React.useRef<File>();
  const [imageInfo, setImageInfo] = React.useState<IImageInfo>();
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLocation, setIsLocation] = React.useState(true);
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [percentComplete, setPercentComplete] = React.useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_formatSpeed, seFormatSpeed] = React.useState('0Kb/s');
  const [data, _setData] = useState<ICreatePictureData>({
    ...initUploadData,
  });

  // eslint-disable-next-line arrow-parens
  const setData = <T extends keyof ICreatePictureData>(label: T, value: ICreatePictureData[T]) => {
    _setData(prev => ({
      ...prev,
      [label]: value,
    }));
  };

  const onUploadProgress = useCallback((speed: string, percent: number) => {
    setPercentComplete(percent);
    seFormatSpeed(speed);
  }, []);

  const addPicture = useCallback(async () => {
    setUploadLoading(true);
    if (imageRef.current) {
      const key = await uploadQiniu(imageRef.current, UploadType.PICTURE, onUploadProgress);
      const info = imageInfo;
      if (!isLocation && info && info.exif && info.exif.location) {
        delete info.exif.location;
      }
      const addData = {
        info,
        ...data,
        key,
        tags: data.tags.map(name => ({ name })),
      };
      try {
        await request.post('/api/picture', addData);
        setDisabled(true);
        Toast.success('上传成功！');
        setTimeout(() => {
          pushRoute('/');
        }, 100);
      } catch (err) {
        Toast.error('图片上传失败!');
      } finally {
        setUploadLoading(false);
        setPercentComplete(0);
      }
    }
  }, [onUploadProgress, imageInfo, isLocation, data, pushRoute]);
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
      Toast.warning('图片格式错误');
    }
  };
  const resetData = useCallback(() => {
    setImageUrl('');
    _setData({
      ...initUploadData,
    });
  }, []);
  return (
    <Wapper>
      <Head>
        <title>{getTitle('上传')}</title>
        <script src="//unpkg.com/exif-js@2.3.0/exif.js" />
        <script src="//unpkg.com/fast-average-color@5.0.0/dist/index.js" />
      </Head>
      <Box>
        {
          imageUrl ? (
            <ContentBox columns="40% 1fr" gap="36px">
              <PreviewBox loading={uploadLoading ? 1 : 0}>
                <TrashIcon>
                  <IconButton onClick={resetData}>
                    <Trash2 />
                  </IconButton>
                </TrashIcon>
                <Progress style={{ width: `${percentComplete}%`, opacity: uploadLoading ? 1 : 0 }} />
                <Preview src={imageUrl} />
              </PreviewBox>
              <Content>
                <Grid columns={1}>
                  <Cell>
                    <Input
                      isTitle
                      placeholder="标题"
                      value={data.title}
                      onChange={e => setData('title', e.target.value)}
                    />
                    <Input
                      placeholder="简介"
                      value={data.bio}
                      onChange={e => setData('bio', e.target.value)}
                    />
                  </Cell>
                  <Cell>
                    <Switch
                      label="私人"
                      bio="仅自己可见"
                      checked={data.isPrivate}
                      onChange={checked => setData('isPrivate', checked)}
                    />
                  </Cell>
                  {
                    imageInfo && imageInfo.exif && imageInfo.exif.location && (
                      <Switch
                        label="分享位置信息"
                        bio="所有人都可以看到你图片拍摄的位置信息"
                        checked={isLocation}
                        onChange={checked => setIsLocation(checked)}
                      />
                    )
                  }
                  <FormTag>
                    <Tag
                      value={data.tags}
                      onChange={tags => setData('tags', tags)}
                    />
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
            </ContentBox>
          ) : (
            <UploadBox onFileChange={handleChange} />
          )
        }
      </Box>
    </Wapper>
  );
};

export default withAuth('user')(
  pageWithTranslation()(Upload),
);
