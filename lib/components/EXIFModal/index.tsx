import bytes from 'bytes';
import { rgba, rem } from 'polished';
import React, { useEffect, useState, memo } from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { getPictureUrl } from '@lib/common/utils/image';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { Cell } from 'styled-css-grid';
import { useTranslation } from '@lib/i18n/useTranslation';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { Modal } from '../Modal';
import {
  EXIFBox, EXIFInfo, EXIFTitle, Info, Title,
} from './styles';

const isNull = (value: any) => value === undefined || value === null || value === '';

interface IProps {
  visible: boolean;
  onClose: () => void;
  themeStore?: ThemeStore;
  picture: PictureEntity;
}

export const EXIFModal: React.FC<IProps> = memo(({ visible, onClose, picture }) => {
  const [background, setBackground] = useState('');
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    make, model, exif, width, height, size, key,
  } = picture;
  const {
    focalLength, aperture, exposureTime, ISO,
  } = exif!;
  useEffect(() => {
    setBackground(`linear-gradient(${rgba(colors.pure, 0.8)}, ${colors.pure} 150px), url("${getPictureUrl(key)}")`);
  }, [colors.pure, key]);
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      boxStyle={{ backgroundImage: background, padding: 0, maxWidth: rem(500) }}
    >
      <Title>{t('picture_info.title')}</Title>
      <Info>
        <EXIFBox columns="repeat(auto-fit, minmax(150px, 1fr))">
          <Cell>
            <EXIFTitle>{t('picture_info.make')}</EXIFTitle>
            <EXIFInfo>{isNull(make) ? '--' : make}</EXIFInfo>
          </Cell>
          <Cell>
            <EXIFTitle>{t('picture_info.model')}</EXIFTitle>
            <EXIFInfo>{isNull(model) ? '--' : model}</EXIFInfo>
          </Cell>
          <Cell>
            <EXIFTitle>{t('picture_info.focalLength')}</EXIFTitle>
            <EXIFInfo>{isNull(focalLength) ? '--' : `${focalLength}mm`}</EXIFInfo>
          </Cell>
          <Cell>
            <EXIFTitle>{t('picture_info.aperture')}</EXIFTitle>
            <EXIFInfo>{isNull(aperture) ? `f/${aperture}` : '--'}</EXIFInfo>
          </Cell>
          <Cell>
            <EXIFTitle>{t('picture_info.exposureTime')}</EXIFTitle>
            <EXIFInfo>{isNull(exposureTime) ? '--' : `${exposureTime}s`}</EXIFInfo>
          </Cell>
          <Cell>
            <EXIFTitle>{t('picture_info.ISO')}</EXIFTitle>
            <EXIFInfo>{isNull(ISO) ? '--' : ISO}</EXIFInfo>
          </Cell>
          <Cell>
            <EXIFTitle>{t('picture_info.dimensions')}</EXIFTitle>
            <EXIFInfo>{`${width} x ${height}`}</EXIFInfo>
          </Cell>
          <Cell>
            <EXIFTitle>{t('picture_info.size')}</EXIFTitle>
            <EXIFInfo>{bytes(size)}</EXIFInfo>
          </Cell>
        </EXIFBox>
      </Info>
    </Modal>
  );
});
