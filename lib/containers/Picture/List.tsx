import React, { useEffect } from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import {
  getScrollHeight, getScrollTop, getWindowHeight, server,
} from '@lib/common/utils';
import { listParse } from '@lib/common/utils/waterfall';
import { Loading } from '@lib/components/Loading';
import { NoSSR } from '@lib/components/SSR';
import { debounce } from 'lodash';

import useMedia from '@lib/common/utils/useMedia';
import { defaultBreakpoints } from 'styled-media-query';
import { css } from 'styled-components';
import { Footer, PictureContent, Wrapper } from './styles';
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
}

const mediaArr = [
  {
    media: `(min-width: ${defaultBreakpoints.large})`,
    col: 4,
  },
  {
    media: `(max-width: ${defaultBreakpoints.large}) and (min-width: ${defaultBreakpoints.medium})`,
    col: 3,
  },
  {
    media: `(max-width: ${defaultBreakpoints.medium}) and (min-width: ${defaultBreakpoints.small})`,
    col: 2,
  },
  {
    media: `(max-width: ${defaultBreakpoints.small})`,
    col: 1,
  },
];

const colArr = mediaArr.map(media => media.col);

const OFFSET = 700;

export const PictureList: React.FC<IProps> = ({
  data,
  like,
  onPage,
  noMore = false,
}) => {
  let serverList: PictureEntity[][][] = [];
  const [clientList, setClientList] = React.useState<PictureEntity[][]>([]);
  const pageLock = React.useRef<boolean>(false);
  const col = useMedia(
    mediaArr.map(media => media.media),
    mediaArr.map(media => media.col),
    4,
  );

  const scrollEvent = debounce(async () => {
    const offset = getScrollHeight() - (getScrollTop() + getWindowHeight());
    if (offset <= OFFSET && !pageLock.current && !noMore) {
      if (onPage) {
        pageLock.current = true;
        await onPage();
        setTimeout(() => {
          pageLock.current = false;
        }, 200);
      }
    }
  }, 50);

  const pictureList = () => {
    setClientList(() => listParse(data, col));
  };
  useEffect(() => {
    scrollEvent();
  }, []);
  // 滚动事件绑定
  useEffect(() => {
    if (!noMore) {
      window.addEventListener('scroll', scrollEvent);
      return () => window.removeEventListener('scroll', scrollEvent);
    }
    return () => null;
  }, []);
  // 处理客户端列表数据
  useEffect(() => {
    pictureList();
  }, [col, data]);
  // 服务端渲染列表
  if (server) {
    serverList = colArr.map(_col => listParse(data, _col));
  }
  return (
    <Wrapper>
      <NoSSR key="server" server={false}>
        <PictureContent>
          {
            serverList.map((mainCol, i) => (
              <Col ssr col={colArr[i]} key={colArr[i]} list={mainCol} />
            ))
          }
        </PictureContent>
      </NoSSR>
      <NoSSR key="client">
        <Col
          css={css`
            display: grid;
          `}
          like={like}
          col={col}
          list={clientList}
        />
      </NoSSR>
      <span>
        <Footer key="footer">
          {
            noMore ? (
              <span>没有更多内容啦</span>
            ) : (
              <Loading size={8} />
            )
          }
        </Footer>
      </span>
    </Wrapper>
  );
};
