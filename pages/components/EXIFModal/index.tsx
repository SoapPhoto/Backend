import bytes from 'bytes';
import { inject, observer } from 'mobx-react';
import { rgba } from 'polished';
import React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { getPictureUrl } from '@pages/common/utils/image';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { computed } from 'mobx';
import { Cell } from 'styled-css-grid';
import { Modal } from '../Modal';
import { EXIFBox, EXIFInfo, EXIFTitle, Info, Title } from './styles';

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
    const { key } = this.props.picture;
    const { themeData } = this.props.themeStore!;
  // tslint:disable-next-line: max-line-length
    return `linear-gradient(${rgba(themeData.colors.pure, .8)}, ${themeData.colors.pure} 150px), url("${getPictureUrl(key)}")`;
  }

  public render() {
    const { visible, onClose } = this.props;
    const { make, model, exif, width, height, size } = this.props.picture;
    const { focalLength, aperture, exposureTime, ISO } = exif!;
    return (
      <Modal
        visible={visible}
        onClose={onClose}
        boxStyle={{ backgroundImage: this.background, padding: 0 }}
      >
        <Title>信息</Title>
        <Info>
          <EXIFBox columns="repeat(auto-fit, minmax(150px, 1fr))">
            <Cell>
              <EXIFTitle>设备</EXIFTitle>
              <EXIFInfo>{make || '--'}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>型号</EXIFTitle>
              <EXIFInfo>{model || '--'}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>焦距</EXIFTitle>
              <EXIFInfo>{focalLength ? `${focalLength}mm` : '--'}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>光圈</EXIFTitle>
              <EXIFInfo>{aperture ? `f/${aperture}` : '--'}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>快门速度</EXIFTitle>
              <EXIFInfo>{exposureTime === undefined ? '--' : `${exposureTime}s` }</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>ISO</EXIFTitle>
              <EXIFInfo>{ISO || '--'}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>尺寸</EXIFTitle>
              <EXIFInfo>{`${width} x ${height}`}</EXIFInfo>
            </Cell>
            <Cell>
              <EXIFTitle>大小</EXIFTitle>
              <EXIFInfo>{bytes(size)}</EXIFInfo>
            </Cell>
          </EXIFBox>
        </Info>
      </Modal>
    );
  }
}
