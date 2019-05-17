import { withRouter } from 'next/router';
import * as React from 'react';
import LazyLoad from 'react-lazyload';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { Link } from '@pages/routes';
import { ImageBox, ItemImage, ItemWapper } from './styles';

const pictureStyle = {
  full: '-pictureFull',
  raw: '',
  regular: '-pictureRegular',
  thumb: '-pictureThumb',
  blur: '-pictureBlur',
};

interface IProps {
  detail: PictureEntity;
  lazyload?: boolean;
  size?: keyof typeof pictureStyle;
}

export const PictureImage: React.FC<IProps> = ({
  detail,
  lazyload = true,
  size = 'regular',
}) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [ok, setOk] = React.useState(true);
  const height = (1 - (detail.width - detail.height) / detail.width) * 100 || 100;
  const onLoad = () => {
    setTimeout(() => setOk(true), 200);
  };
  const ref = (e: HTMLImageElement) => {
    if (e) {
      setOk(e.complete);
    }
  };
  const imgRender = (
    <ItemImage
      ref={ref as any}
      onLoad={onLoad}
      style={{ opacity: ok ? 1 : 0 }}
      src={`//cdn.soapphoto.com/${detail.key}${pictureStyle[size]}`}
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
          imgRender
        )
      }
    </ImageBox>
  );
};

export const PictureItem = withRouter<IProps>(({
  detail,
  ...restProps
}) => {
  return (
    <div>
      <Link route={`/picture/${detail.id}`}>
        <a
          href={`/picture/${detail.id}`}
        >
          <ItemWapper>
            <PictureImage detail={detail} {...restProps} />
          </ItemWapper>
        </a>
      </Link>
    </div>
  );
});
