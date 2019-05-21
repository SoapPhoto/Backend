import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import LazyLoad from 'react-lazyload';

import { IPictureItemProps, pictureStyle } from './Item';
import { ImageBox, ItemImage } from './styles';

interface IPictureImage extends IPictureItemProps {
  blur?: boolean;
}

@observer
export class PictureImage extends React.Component<IPictureImage> {
  @computed get opacity() {
    if (this.isComplete && this.isLoad) {
      return 1;
    }
    return 0;
  }
  @observable public isComplete = true;
  @observable public isLoad = true;

  public imgRef = React.createRef<HTMLImageElement>();

  public componentDidMount() {
    if (this.imgRef.current) {
      if (!this.imgRef.current.complete) {
        this.isComplete = false;
      } else {
        this.isLoad = true;
      }
    }
  }
  // 31536000
  public onLoad = () => {
    if (!this.isComplete) {
      setTimeout(() => {
        this.isComplete = true;
        this.isLoad = true;
      // tslint:disable-next-line: align
      }, 100);
    }
  }

  public render() {
    const { detail, lazyload, size = 'regular' } = this.props;
    const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
    const imgRender = (
      <ItemImage
        style={{
          opacity: this.opacity,
        }}
        ref={this.imgRef}
        src={`//cdn.soapphoto.com/${detail.key}${pictureStyle[size]}`}
        onLoad={this.onLoad}
      />
    );
    return (
      <ImageBox height={height} background={detail.color}>
        {
          lazyload ? (
            <LazyLoad resize={true} height="100%" offset={300}>
              {imgRender}
            </LazyLoad>
          ) : (
            <div>
              {imgRender}
            </div>
          )
        }
      </ImageBox>
    );
  }
}
