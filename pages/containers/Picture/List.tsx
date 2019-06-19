import React, { useEffect } from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { getScrollHeight, getScrollTop, getWindowHeight, isSafari, server } from '@pages/common/utils';
import { listParse } from '@pages/common/utils/waterfall';
import { Loading } from '@pages/components/Loading';
import { NoSSR } from '@pages/components/SSR';
import { debounce } from 'lodash';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import Col from './Col';
import { Footer, Wapper } from './styles';

import { defaultBreakpoints } from 'styled-media-query';

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

const colArr = [4, 3, 2, 1];

export const PictureList: React.FC<IProps> = ({
  data,
  like,
  onPage,
  noMore = false,
}) => {
  let serverList: PictureEntity[][][] = [];
  const [clientList, setClientList] = React.useState<PictureEntity[][]>([]);
  const [col, setCol] = React.useState<number>(4);
  const mediaList = React.useRef<MediaQueryList[]>([]);
  const pageLock = React.useRef<boolean>(false);
  // 媒体查询事件绑定
  useEffect(() => {
    if (!server) {
      if (isSafari) {
        // window.addEventListener('resize', this.onresize);
        return () => undefined;
      }
      for (const info of mediaArr) {
        const mediaData = window.matchMedia(info.media);
        mediaList.current.push(mediaData);
        mediaData.addEventListener('change', mediaSetCol);
        if (mediaData.matches) {
          setCol(info.col);
        }
      }
      return () => {
        for (const mediaData of mediaList.current) {
          mediaData.removeEventListener('change', mediaSetCol);
        }
      };
    }
    return;
  }, []);
  // 滚动事件绑定
  useEffect(() => {
    if (noMore) {
      window.addEventListener('scroll', scrollEvent);
      return () => window.removeEventListener('scroll', scrollEvent);
    }
    return;
  }, []);
  // 处理客户端列表数据
  useEffect(() => {
    pictureList();
  }, [col]);
  // 服务端渲染列表
  if (server) {
    serverList = colArr.map(_col => listParse(data, col));
  }

  const pictureList = () => {
    setClientList(_ => listParse(data, col));
  };

  const mediaSetCol = (mediaInfo: MediaQueryListEvent) => {
    if (mediaInfo.matches) {
      const media = mediaArr.find(info => info.media === mediaInfo.media);
      if (media) {
        setCol(media.col);
      }
    }
  };

  const scrollEvent = debounce(async () => {
    const offset = getScrollHeight() - (getScrollTop() + getWindowHeight());
    if (offset <= 300 && !pageLock.current && !noMore) {
      if (onPage) {
        pageLock.current = true;
        await onPage();
        setTimeout(() => {
          pageLock.current = false;
        }, 200);
      }
    }
  }, 50);

  return (
    <Wapper>
      <NoSSR server={false}>
        {
          serverList.map((mainCol, i) => (
            <Col ssr={true} col={colArr[i]} key={colArr[i]} list={mainCol} />
          ))
        }
      </NoSSR>
      <NoSSR>
        <Col like={like} col={col} list={clientList} />
      </NoSSR>
      <Footer>
        {
          noMore ? (
            <span>没有更多内容啦</span>
          ) : (
            <Loading size={8} />
          )
        }
      </Footer>
    </Wapper>
  );
};

// @observer
// export class PictureList extends React.Component<IProps> {
//   public static defaultProps: Partial<IProps> = {
//     noMore: false,
//   };
//   @observable public col = 4;
//   @observable public colArr = [4, 3, 2, 1];
//   // 这是给服务端渲染用的
//   @observable public colList: PictureEntity[][][] = [];

//   // 浏览器时使用这个数据
//   @observable public pictureList: PictureEntity[][] = [];

//   public _pageLock = false;

//   public _removeEvent = false;

//   public eventScroll = debounce(async () => {
//     const offset = getScrollHeight() - (getScrollTop() + getWindowHeight());
//     if (offset <= 300 && !this._pageLock && !this.props.noMore) {
//       if (this.props.onPage) {
//         this._pageLock = true;
//         await this.props.onPage();
//         setTimeout(() => {
//           this._pageLock = false;
//         }, 400);
//       }
//     }
//   }, 50);

//   public onresize = debounce(() => {
//     for (const info of mediaArr) {
//       const mediaData = window.matchMedia(info.media);
//       if (mediaData.matches) {
//         this.col = info.col;
//       }
//     }
//   }, 50);

//   constructor(props: IProps) {
//     super(props);
//     this.formatList(props.data);
//     reaction(
//       () => this.props.data,
//       () => {
//         this.pictureFormat();
//       },
//     );
//     reaction(
//       () => this.props.noMore,
//       (noMore) => {
//         if (!server) {
//           if (noMore) {
//             window.removeEventListener('scroll', this.eventScroll);
//             this._removeEvent = true;
//           } else {
//             if (this._removeEvent) {
//               window.addEventListener('scroll', this.eventScroll);
//               this._removeEvent = false;
//             }
//           }
//         }
//       },
//     );
//     reaction(
//       () => this.col,
//       (col) => {
//         this.pictureFormat(col);
//       },
//     );
//   }
//   public componentWillMount() {
//     if (!server) {
//       if (!this.props.noMore) {
//         window.addEventListener('scroll', this.eventScroll);
//       }
//       this.media();
//       this.pictureFormat();
//     }
//   }
//   public componentWillUnmount() {
//     window.removeEventListener('resize', this.onresize);
//     this._removeEvent = true;
//   }
//   public pictureFormat = (col = this.col) => {
//     this.pictureList = listParse(this.props.data, col);
//   }
//   public media = () => {
//     for (const info of mediaArr) {
//       const mediaData = window.matchMedia(info.media);
//       if (isSafari) {
//         window.addEventListener('resize', this.onresize);
//         // (mediaData as any).addEventListener((data: any) => {
//         //   if (data.matches) {
//         //     this.col = info.col;
//         //   }
//         // });
//       } else {
//         mediaData.addEventListener('change', (data) => {
//           if (data.matches) {
//             this.col = info.col;
//           }
//         });
//       }
//       if (mediaData.matches) {
//         this.col = info.col;
//       }
//     }
//   }
//   public formatList = (data: PictureEntity[]) => {
//     this.colList = this.colArr.map(col => listParse(data, col));
//   }
//   public render() {
//     const { noMore } = this.props;
//     return (
//       <Wapper>
//         <NoSSR server={false}>
//           {
//             this.colList.map((mainCol, i) => (
//               <Col ssr={true} col={this.colArr[i]} key={this.colArr[i]} list={mainCol} />
//             ))
//           }
//         </NoSSR>
//         <NoSSR>
//           <Col like={this.props.like} col={this.col} list={this.pictureList} />
//         </NoSSR>
//         <Footer>
//           {
//             noMore ? (
//               <span>没有更多内容啦</span>
//             ) : (
//               <Loading size={8} />
//             )
//           }
//         </Footer>
//       </Wapper>
//     );
//   }
// }
