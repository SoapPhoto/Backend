import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import { css } from 'styled-components';
import { pick, merge } from 'lodash';

import { getTitle } from '@lib/common/utils';
import {
  getImageInfo, IImageInfo, isImage,
} from '@lib/common/utils/image';
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
  Wrapper,
  PreviewBox,
  Preview,
  Progress,
  TextArea,
} from '@lib/styles/views/upload';
import { Cell, Grid } from 'styled-css-grid';
import { Switch } from '@lib/components/Switch';
import { uploadQiniu } from '@lib/services/file';
import { UploadBox } from '@lib/containers/Upload/UploadBox';
import { ICustomNextPage } from '@lib/common/interfaces/global';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { Trash2, Edit } from '@lib/icon';
import { UploadType } from '@common/enum/upload';
import { FieldItem } from '@lib/components/Formik/FieldItem';
import { theme } from '@lib/common/utils/themes';
import { rem } from 'polished';
import { EXIFEditModal, IEXIFEditValues } from '@lib/components/EXIFModal/Edit';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { validator } from '@common/validator';

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
  const imageRef = React.useRef<File>();
  const [imageInfo, setImageInfo] = React.useState<IImageInfo>();
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLocation, setIsLocation] = React.useState(true);
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [percentComplete, setPercentComplete] = React.useState(0);
  const [EXIFVisible, setEXIFVisible] = React.useState(false);
  const [titleError, setTitleError] = React.useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_formatSpeed, seFormatSpeed] = React.useState('0Kb/s');
  const [data, _setData] = useState<ICreatePictureData>({
    ...initUploadData,
  });

  // eslint-disable-next-line arrow-parens
  const setData = <T extends keyof ICreatePictureData>(label: T, value: ICreatePictureData[T]) => {
    if (label === 'title') {
      if (value !== '') {
        setTitleError(undefined);
      } else {
        setTitleError('请输入标题！');
      }
    }
    _setData(prev => ({
      ...prev,
      [label]: value,
    }));
  };

  const onUploadProgress = useCallback((speed: string, percent: number) => {
    setPercentComplete(percent);
    seFormatSpeed(speed);
  }, []);

  const updateEXIF = useCallback((value: IEXIFEditValues) => {
    if (imageInfo) {
      const { make, model, ...rest } = value;
      setImageInfo(
        merge(imageInfo, {
          make,
          model,
          exif: {
            ...rest,
          },
        }) as IImageInfo,
      );
    }
  }, [imageInfo]);

  const addPicture = useCallback(async () => {
    if (validator.isEmpty(data.title)) {
      setTitleError('请输入标题！');
      return;
    }
    setUploadLoading(true);
    if (imageRef.current) {
      const key = await uploadQiniu(imageRef.current, UploadType.PICTURE, onUploadProgress);
      const info = imageInfo;
      if (!isLocation && info?.exif?.location) {
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
          window.location = '/' as any;
        }, 100);
      } catch (err) {
        Toast.error('图片上传失败!');
      } finally {
        setUploadLoading(false);
        setPercentComplete(0);
      }
    }
  }, [onUploadProgress, imageInfo, isLocation, data]);
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
    <Wrapper>
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
                <Progress style={{ width: `${percentComplete}%`, opacity: uploadLoading ? 0.6 : 0 }} />
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
                      error={titleError}
                    />
                    <TextArea
                      placeholder="简介"
                      value={data.bio}
                      onChange={e => setData('bio', e.target.value)}
                    />
                  </Cell>
                  <Cell
                    style={{ marginBottom: rem(24) }}
                  >
                    <Switch
                      label="私人"
                      bio="仅自己可见"
                      checked={data.isPrivate}
                      onChange={checked => setData('isPrivate', checked)}
                    />
                  </Cell>
                  {
                    imageInfo && imageInfo.exif && imageInfo.exif.location && (
                      <Cell
                        style={{ marginBottom: rem(24) }}
                      >
                        <Switch
                          label="分享位置信息"
                          bio="所有人都可以看到你图片拍摄的位置信息"
                          checked={isLocation}
                          onChange={checked => setIsLocation(checked)}
                        />
                      </Cell>
                    )
                  }
                  <FieldItem onClick={() => setEXIFVisible(true)} label="修改EXIF信息" bio="照片的属性信息和拍摄数据">
                    <Edit size={20} css={css`color: ${theme('colors.primary')};` as any} />
                  </FieldItem>
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
      <EXIFEditModal
        initialValues={imageInfo ? {
          make: imageInfo.make,
          model: imageInfo.model,
          ...pick(imageInfo.exif, [
            'focalLength',
            'aperture',
            'exposureTime',
            'ISO',
          ]),
        } : {}}
        visible={EXIFVisible}
        onOk={updateEXIF}
        onClose={() => setEXIFVisible(false)}
      />
    </Wrapper>
  );
};

export default withAuth('user-verified')(
  pageWithTranslation(I18nNamespace.Picture)(Upload),
);
