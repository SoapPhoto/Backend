import { inject, observer } from 'mobx-react';
import { opacify, rgba } from 'polished';
import React from 'react';
import ReactDOM from 'react-dom';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { getPictureUrl } from '@pages/common/utils/image';
import { ThemeStore } from '@pages/stores/ThemeStore';
import { computed, observable } from 'mobx';
import { Cell, Grid } from 'styled-css-grid';
import { Box, Content, EXIFBox, EXIFInfo, EXIFTitle, Info, Title, Warpper } from './styles';

interface IProps {
  onClose: () => void;
  themeStore?: ThemeStore;
  picture: PictureEntity;
}

@inject('themeStore')
@observer
export class EXIFModal extends React.Component<IProps> {
  public contentRef = React.createRef<HTMLDivElement>();
  @computed get background() {
    const { key } = this.props.picture;
    const { themeData } = this.props.themeStore!;
  // tslint:disable-next-line: max-line-length
    return `linear-gradient(${rgba(themeData.colors.pure, .8)}, ${themeData.colors.pure} 150px), url("${getPictureUrl(key, 'blur')}")`;
  }
  public handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  　e.stopPropagation();
    if (e.target === this.contentRef.current) {
      this.props.onClose();
    }
  }
  public render() {
    const { make, model, exif } = this.props.picture;
    const { focalLength, aperture, exposureTime, iso } = exif!;
    return ReactDOM.createPortal(
      (
        <Warpper onClick={this.handleClick}>
          <Content ref={this.contentRef}>
            <Box style={{ backgroundImage: this.background }}>
              <Title>信息</Title>
              <Info>
                <EXIFBox columns="repeat(3, 1fr)">
                  <Cell>
                    <EXIFTitle>设备</EXIFTitle>
                    <EXIFInfo>{make}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>型号</EXIFTitle>
                    <EXIFInfo>{model}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>焦距</EXIFTitle>
                    <EXIFInfo>{focalLength}mm</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>光圈</EXIFTitle>
                    <EXIFInfo>f/{aperture}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>快门速度</EXIFTitle>
                    <EXIFInfo>{exposureTime}</EXIFInfo>
                  </Cell>
                  <Cell>
                    <EXIFTitle>ISO</EXIFTitle>
                    <EXIFInfo>{iso}</EXIFInfo>
                  </Cell>
                </EXIFBox>
              </Info>
            </Box>
          </Content>
        </Warpper>
      ),
      document.querySelector('body')!,
    );
  }
}
