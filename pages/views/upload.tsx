import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import { css } from 'styled-components';
import { pick, merge } from 'lodash';

import { getTitle } from '@lib/common/utils';
import {
  IImageInfo,
} from '@lib/common/utils/image';
import { request } from '@lib/common/utils/request';
import { Button } from '@lib/components/Button';
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
  PreviewBtn,
  PreviewHandleContent,
} from '@lib/styles/views/upload';
import { Cell, Grid } from 'styled-css-grid';
import { Switch } from '@lib/components/Switch';
import { uploadQiniu } from '@lib/services/file';
import { UploadBox } from '@lib/containers/Upload/UploadBox';
import { ICustomNextPage } from '@lib/common/interfaces/global';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { Trash2, Edit, MapPin } from '@lib/icon';
import { UploadType } from '@common/enum/upload';
import { FieldItem } from '@lib/components/Formik/FieldItem';
import { theme } from '@lib/common/utils/themes';
import { rem } from 'polished';
import { EXIFEditModal, IEXIFEditValues } from '@lib/components/EXIFModal/Edit';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { validator } from '@common/validator';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useImageInfo } from '@lib/common/hooks/useImageInfo';
import { CreatePictureAddDot } from '@lib/common/interfaces/picture';

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
  const { t } = useTranslation();
  const imageRef = React.useRef<File>();
  const [imageData, setFile, _setImageUrl, setImageInfo, clear] = useImageInfo(imageRef);
  const { imageUrl, imageInfo, classify } = imageData;
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

  // TODO 图片自动识别功能
  // useEffect(() => {
  //   const tags = classify.filter(cl => cl.score > 0.22);
  //   if (tags.length > 0) {
  //     _setData((value) => {
  //       if (value.tags.length === 0) {
  //         value.tags.push(...tags.map(v => v.keyword));
  //       }
  //       return value;
  //     });
  //   }
  // }, [classify]);

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
  }, [imageInfo, setImageInfo]);

  const addPicture = useCallback(async () => {
    if (validator.isEmpty(data.title)) {
      setTitleError(t('validation.yup_required', t('label.picture_title')));
      return;
    }
    setUploadLoading(true);
    if (imageRef.current) {
      const key = await uploadQiniu(imageRef.current, UploadType.PICTURE, onUploadProgress);
      const info = imageInfo;
      if (!isLocation && info?.exif?.location) {
        delete info.exif.location;
        delete info.location;
      }
      const addData: MutablePartial<CreatePictureAddDot> = {
        info,
        ...data,
        key,
        location: undefined,
        tags: data.tags.map(name => ({ name })),
      };
      if (info?.location) {
        addData.location = info?.location;
        delete info?.location;
      }
      try {
        await request.post('/api/picture', addData);
        setDisabled(true);
        Toast.success(t('upload.message.success_upload'));
        setTimeout(() => {
          window.location = '/' as any;
        }, 100);
      } catch (err) {
        Toast.error(t('upload.message.error_upload'));
      } finally {
        setUploadLoading(false);
        setPercentComplete(0);
      }
    }
  }, [data, t, onUploadProgress, imageInfo, isLocation]);
  const handleChange = async (files: Maybe<FileList>) => {
    if (files && files[0]) {
      setFile(files[0]);
    }
  };
  // const setImageClassify = useCallback(async (base64: string) => {
  //   const classify = await getImageClassify(base64);
  // }, []);
  const resetData = useCallback(() => {
    clear();
    _setData({
      ...initUploadData,
    });
  }, [clear]);
  return (
    <Wrapper>
      <Head>
        <title>{getTitle('upload.title', t)}</title>
        <script src="//unpkg.com/exif-js@2.3.0/exif.js" />
        <script src="//unpkg.com/fast-average-color@5.0.0/dist/index.js" />
      </Head>
      <Box>
        {
          imageUrl ? (
            <ContentBox columns="40% 1fr" gap="36px">
              <PreviewBox loading={uploadLoading ? 1 : 0}>
                <PreviewHandleContent>
                  {
                    imageInfo?.location && (
                      <PreviewBtn
                        transformTemplate={({ scale }: any) => `translate(0, 0) scale(${scale})`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <MapPin size={14} />
                        <span>{imageInfo.location.formatted_address}</span>
                      </PreviewBtn>
                    )
                  }
                  <TrashIcon onClick={resetData}>
                    <Trash2 style={{ strokeWidth: '2.5px' }} size={14} />
                  </TrashIcon>
                </PreviewHandleContent>
                <Progress style={{ width: `${percentComplete}%`, opacity: uploadLoading ? 0.6 : 0 }} />
                <Preview src={imageUrl} />
              </PreviewBox>
              <Content>
                <Grid columns={1}>
                  <Cell>
                    <Input
                      isTitle
                      placeholder={t('label.picture_title')}
                      value={data.title}
                      onChange={e => setData('title', e.target.value)}
                      error={titleError}
                    />
                    <TextArea
                      placeholder={t('label.picture_bio')}
                      value={data.bio}
                      onChange={e => setData('bio', e.target.value)}
                    />
                  </Cell>
                  <Cell
                    style={{ marginBottom: rem(24) }}
                  >
                    <Switch
                      label={t('private')}
                      bio={t('message.visible_yourself', t('label.picture'))}
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
                          label={t('upload.share_location.label')}
                          bio={t('upload.share_location.bio')}
                          checked={isLocation}
                          onChange={checked => setIsLocation(checked)}
                        />
                      </Cell>
                    )
                  }
                  <FieldItem
                    onClick={() => setEXIFVisible(true)}
                    label={t('upload.edit_exif.label')}
                    bio={t('upload.edit_exif.bio')}
                  >
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
                      <span>{t('upload.btn.upload')}</span>
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
  pageWithTranslation([I18nNamespace.Picture, I18nNamespace.Upload])(Upload),
);
