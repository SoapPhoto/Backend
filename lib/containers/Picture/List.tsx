import React, { useEffect } from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import {
  getScrollHeight, getScrollTop, getWindowHeight,
} from '@lib/common/utils';
import { listParse } from '@lib/common/utils/waterfall';
import { NoSSR } from '@lib/components/SSR';
import { debounce } from 'lodash';

import useMedia from '@lib/common/utils/useMedia';
import { Empty } from '@lib/components/Empty';
import { customBreakpoints } from '@lib/common/utils/mediaQuery';
import { observer, useLocalStore } from 'mobx-react';
import {
  PictureContent, Wrapper, SkeletonContent, SkeletonItem, SkeletonAvatar, SkeletonName,
} from './styles';
import Col from './Col';

interface IProps {
  /**
   * picture列表数据
   *
   * @type {PictureEntity[]}
   * @memberof IProps
   */
  data: PictureEntity[];

  like: (data: PictureEntity) => void;

  onPage?: () => Promise<void>;

  noMore: boolean;

  style?: React.CSSProperties;
}

const mediaArr = [
  {
    media: `(min-width: ${customBreakpoints.large})`,
    col: 4,
  },
  {
    media: `(max-width: ${customBreakpoints.large}) and (min-width: ${customBreakpoints.medium})`,
    col: 3,
  },
  {
    media: `(max-width: ${customBreakpoints.medium}) and (min-width: ${customBreakpoints.mobile})`,
    col: 2,
  },
  {
    media: `(max-width: ${customBreakpoints.mobile})`,
    col: 1,
  },
];

// const colArr = mediaArr.map(media => media.col);

const OFFSET = 1000;

export const PictureList: React.FC<IProps> = observer(({
  data,
  like,
  onPage,
  style,
  noMore = false,
}) => {
  const store = useLocalStore(() => ({
    clientList: [] as PictureEntity[][],
    setClientList(arr: PictureEntity[][]) {
      this.clientList = arr;
    },
  }));
  const pageLock = React.useRef<boolean>(false);
  const col = useMedia(
    mediaArr.map(media => media.media),
    mediaArr.map(media => media.col),
    3,
  );

  const scrollEvent = debounce(async () => {
    const offset = getScrollHeight() - (getScrollTop() + getWindowHeight());

    if (offset <= OFFSET && !pageLock.current && !noMore) {
      if (onPage) {
        pageLock.current = true;
        await onPage();
        setTimeout(() => {
          pageLock.current = false;
        }, 800);
      }
    }
  }, 100);
  useEffect(() => {
    scrollEvent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 滚动事件绑定
  useEffect(() => {
    if (!noMore) {
      window.addEventListener('scroll', scrollEvent);
      return () => window.removeEventListener('scroll', scrollEvent);
    }
    return () => null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!noMore) {
      window.removeEventListener('scroll', scrollEvent);
      window.addEventListener('scroll', scrollEvent);
      return () => window.removeEventListener('scroll', scrollEvent);
    }
    return () => null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noMore]);
  // 处理客户端列表数据
  useEffect(() => {
    store.setClientList(listParse(data, col));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col, data]);
  return (
    <Wrapper style={style}>
      <NoSSR key="server" server={false}>
        <PictureContent>
          <SkeletonContent>
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
                <SkeletonItem key={i}>
                  <SkeletonAvatar />
                  <SkeletonName />
                </SkeletonItem>
              ))
            }
          </SkeletonContent>
        </PictureContent>
      </NoSSR>
      <NoSSR key="client">
        <Col
          style={{ display: 'grid' }}
          like={like}
          col={col}
          list={store.clientList}
        />
        <Empty loading={!noMore} />
      </NoSSR>
    </Wrapper>
  );
});
