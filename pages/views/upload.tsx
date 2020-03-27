import Head from 'next/head';
import React, { useCallback, useEffect, useMemo } from 'react';
import { css } from 'styled-components';
import { pick, merge } from 'lodash';

import { getTitle } from '@lib/common/utils';
import {
  IImageInfo, formatLocationTitle,
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
  Wrapper,
  PreviewBox,
  Preview,
  Progress,
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
import { useTranslation } from '@lib/i18n/useTranslation';
import { useImageInfo } from '@lib/common/hooks/useImageInfo';
import { CreatePictureAddDot, PictureLocation } from '@lib/common/interfaces/picture';
// import { LocationModal } from '@lib/components/LocationModal';
import dynamic from 'next/dynamic';
import { useLocalStore, observer } from 'mobx-react';
import UploadForm, { ICreatePictureData } from '@lib/containers/Upload/UploadForm';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {

}

const DynamicLocationModal = dynamic<any>(() => import('@lib/components/LocationModal').then(v => v.LocationModal), {
  ssr: false,
});

const Upload: ICustomNextPage<IProps, any> = observer(() => {
  const { t } = useTranslation();
  const imageRef = React.useRef<File>();
  const [imageData, setFile, _setImageUrl, setImageInfo, clear] = useImageInfo(imageRef);
  const {
    imageUrl, imageInfo, imageLocation, loading, classify,
  } = imageData;
  const [locationVisible, setLocationVisible] = React.useState(false);
  const [percentComplete, setPercentComplete] = React.useState(0);

  const [uploadDisabled, setUploadDisabled] = React.useState(false);
  const [uploadLoading, setUploadLoading] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_formatSpeed, seFormatSpeed] = React.useState('0Kb/s');

  const locationTitle = useMemo(() => {
    if (imageLocation) {
      return formatLocationTitle(imageLocation);
    }
    return '';
  }, [imageLocation]);

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

  const onUploadProgress = useCallback((speed: string, percent: number) => {
    setPercentComplete(percent);
    seFormatSpeed(speed);
  }, []);

  const addPicture = useCallback(async (value: ICreatePictureData) => {
    if (loading) {
      Toast.warning('正在获取图片信息，请稍后！');
    }
    setUploadLoading(true);
    if (imageRef.current) {
      // 上传到七牛获取key
      const key = await uploadQiniu(imageRef.current, UploadType.PICTURE, onUploadProgress);
      const addData: MutablePartial<CreatePictureAddDot> = {
        info: imageInfo,
        ...value,
        key,
        location: imageLocation,
        tags: value.tags.map(name => ({ name })),
      };
      if (!value.isLocation) {
        delete addData.location;
        if (addData.info?.exif) {
          delete addData.info.exif.location;
        }
      }
      try {
        await request.post('/api/picture', addData);
        setUploadDisabled(true);
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
  }, [loading, onUploadProgress, imageInfo, imageLocation, t]);
  const handleChange = async (files: Maybe<FileList>) => {
    if (files && files[0]) {
      setFile(files[0]);
    }
  };
  // TODO: 暂时不能修改
  const updateLocation = useCallback((newLocation: PictureLocation) => {
    // setImageInfo({
    //   ...imageInfo,
    //   location: newLocation,
    // } as Image);
  }, [setImageInfo]);
  const resetData = useCallback(() => {
    clear();
  }, [clear]);
  const openLocation = useCallback(() => {
    setLocationVisible(true);
  }, []);
  const closeLocation = useCallback(() => {
    setLocationVisible(false);
  }, []);
  return (
    <Wrapper>
      <Head>
        <title>{getTitle('upload.title', t)}</title>
        <script src="//unpkg.com/exif-js@2.3.0/exif.js" />
        <script src="//unpkg.com/fast-average-color@5.0.0/dist/index.js" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.7.0/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <Box>
        {
          imageUrl ? (
            <ContentBox columns="40% 1fr" gap="36px">
              <PreviewBox loading={uploadLoading ? 1 : 0}>
                <PreviewHandleContent>
                  {
                    locationTitle && (
                      <PreviewBtn
                        transformTemplate={({ scale }: any) => `translate(0, 0) scale(${scale})`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={openLocation}
                      >
                        <MapPin size={14} />
                        {
                          locationTitle && <span>{locationTitle}</span>
                        }
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
              <UploadForm
                imageInfo={imageInfo}
                setImageInfo={setImageInfo}
                onOk={addPicture}
                loading={uploadLoading}
                disabled={uploadDisabled || loading}
              />
            </ContentBox>
          ) : (
            <UploadBox onFileChange={handleChange} />
          )
        }
      </Box>
      <DynamicLocationModal
        current={imageLocation}
        visible={locationVisible}
        onClose={closeLocation}
        onConfirm={updateLocation}
      />
    </Wrapper>
  );
});

export default withAuth('user-verified')(
  pageWithTranslation([I18nNamespace.Picture, I18nNamespace.Upload])(Upload),
);
