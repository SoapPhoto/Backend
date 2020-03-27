import React, {
  useState, useCallback, Dispatch, SetStateAction,
} from 'react';
import { Cell, Grid } from 'styled-css-grid';
import { rem } from 'polished';
import { useLocalStore, observer } from 'mobx-react';
import { css } from 'styled-components';

import { validator } from '@common/validator';

import { Edit } from '@lib/icon';
import { Switch } from '@lib/components/Switch';
import { FieldItem } from '@lib/components/Formik/FieldItem';
import { theme } from '@lib/common/utils/themes';
import Tag from '@lib/components/Tag';
import {
  Content, Input, TextArea, FormTag,
} from '@lib/styles/views/upload';
import { useTranslation } from '@lib/i18n/useTranslation';
import { IImageInfo } from '@lib/common/utils/image';
import { Button } from '@lib/components/Button';
import { EXIFEditModal, IEXIFEditValues } from '@lib/components/EXIFModal/Edit';
import { pick, merge } from 'lodash';

interface IProps {
  imageInfo?: IImageInfo;
  disabled: boolean;
  loading: boolean;
  onOk: (value: ICreatePictureData) => void;
  setImageInfo: (value: IImageInfo | undefined) => void;
}

export interface ICreatePictureData {
  isLocation: boolean;
  isPrivate: boolean;
  title: string;
  bio: string;
  tags: string[];
}

const initUploadData: ICreatePictureData = {
  isPrivate: false,
  isLocation: false,
  title: '',
  bio: '',
  tags: [],
};

const UploadForm: React.FC<IProps> = observer(({
  imageInfo,
  disabled,
  loading,
  onOk,
  setImageInfo,
}) => {
  const { t } = useTranslation();
  const [EXIFVisible, setEXIFVisible] = React.useState(false);
  const [titleError, setTitleError] = useState<string>();
  const data = useLocalStore<ICreatePictureData>(() => ({
    ...initUploadData,
  }));
  // eslint-disable-next-line arrow-parens
  const setData = useCallback(<K extends keyof ICreatePictureData>(type: K, value: ICreatePictureData[K]) => {
    if (type === 'title') {
      if (value !== '') {
        setTitleError(undefined);
      } else {
        setTitleError('请输入标题！');
      }
    }
    data[type] = value;
  }, []);
  const onAdd = useCallback(() => {
    if (validator.isEmpty(data.title)) {
      setTitleError(t('validation.yup_required', t('label.picture_title')));
      return;
    }
    onOk({ ...data });
  }, [data, onOk, t]);
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
  return (
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
                checked={data.isLocation}
                onChange={checked => setData('isLocation', checked)}
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
            onClick={onAdd}
            loading={loading}
            disabled={disabled}
          >
            <span>{t('upload.btn.upload')}</span>
          </Button>
        </Cell>
      </Grid>
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
    </Content>
  );
});

export default UploadForm;
