import bytes from 'bytes';
import { inject, observer } from 'mobx-react';
import { rgba, rem } from 'polished';
import React from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { getPictureUrl } from '@lib/common/utils/image';
import { ThemeStore } from '@lib/stores/ThemeStore';
import { computed } from 'mobx';
import { Cell } from 'styled-css-grid';
import { I18nContext } from '@lib/i18n/I18nContext';
import { Modal } from '../Modal';
import {
  EXIFBox, EXIFInfo, EXIFTitle, Info, Title,
} from './styles';

interface IProps {
  visible: boolean;
  onClose: () => void;
  themeStore?: ThemeStore;
  picture: PictureEntity;
}

@inject('themeStore')
@observer
export class EXIFModal extends React.Component<IProps> {
  @computed get background() {
    const { picture, themeStore } = this.props;
    const { key } = picture;
    const { themeData } = themeStore!;
    // eslint-disable-next-line max-len
    return `linear-gradient(${rgba(themeData.colors.pure, 0.8)}, ${themeData.colors.pure} 150px), url("${getPictureUrl(key)}")`;
  }

  public render() {
    const { visible, onClose, picture } = this.props;
    const {
      make, model, exif, width, height, size,
    } = picture;
    const {
      focalLength, aperture, exposureTime, ISO,
    } = exif!;
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        boxStyle={{ backgroundImage: this.background, padding: 0, width: rem(500) }}
      >
        <I18nContext.Consumer>
          {({ t }) => (
            <>
              <Title>{t('picture_info.title')}</Title>
              <Info>
                <EXIFBox columns="repeat(auto-fit, minmax(150px, 1fr))">
                  <Cell>
                    <EXIFTitle>{t('picture_info.make')}</EXIFTitle>
                    <EXIFInfo>{make || '--'}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>{t('picture_info.model')}</EXIFTitle>
                    <EXIFInfo>{model || '--'}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>{t('picture_info.focalLength')}</EXIFTitle>
                    <EXIFInfo>{focalLength ? `${focalLength}mm` : '--'}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>{t('picture_info.aperture')}</EXIFTitle>
                    <EXIFInfo>{aperture ? `f/${aperture}` : '--'}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>{t('picture_info.exposureTime')}</EXIFTitle>
                    <EXIFInfo>{exposureTime === undefined ? '--' : `${exposureTime}s`}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>{t('picture_info.ISO')}</EXIFTitle>
                    <EXIFInfo>{ISO || '--'}</EXIFInfo>
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
            </>
          )}
        </I18nContext.Consumer>
      </Modal>
    );
  }
}
