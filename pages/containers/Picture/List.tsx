import React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { getScrollHeight, getScrollTop, getWindowHeight, server } from '@pages/common/utils';
import { listParse } from '@pages/common/utils/waterfall';
import { Loading } from '@pages/components/Loading';
import { NoSSR } from '@pages/components/SSR';
import { debounce } from 'lodash';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import Col, { List } from './Col';
import { PictureItem } from './Item';
import { ColItem, Footer, Wapper } from './styles';

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

@observer
export class PictureList extends React.Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    noMore: false,
  };
  @observable public colArr = [4, 3, 2];
  @observable public colList: PictureEntity[][][] = [];

  public _pageLock = false;

  public eventScroll = debounce(async () => {
    const offset = getScrollHeight() - (getScrollTop() + getWindowHeight());
    if (offset <= 300 && !this._pageLock && !this.props.noMore) {
      if (this.props.onPage) {
        this._pageLock = true;
        await this.props.onPage();
        this._pageLock = false;
      }
    }
  }, 50);

  constructor(props: IProps) {
    super(props);
    this.formatList(props.data);
    reaction(
      () => this.props.data,
      () => {
        this.formatList(this.props.data);
      },
    );
    reaction(
      () => this.props.noMore,
      (noMore) => {
        if (!server && noMore) {
          window.removeEventListener('scroll', this.eventScroll);
        }
      },
    );
  }
  public componentDidMount() {
    if (!this.props.noMore) {
      window.addEventListener('scroll', this.eventScroll);
    }
  }
  public formatList = (data: PictureEntity[]) => {
    this.colList = this.colArr.map(col => listParse(data, col));
  }
  public render() {
    const { noMore } = this.props;
    return (
      <Wapper>
        <NoSSR server={false}>
          {
            this.colList.map((mainCol, i) => (
              <Col col={this.colArr[i]} key={this.colArr[i]} list={mainCol} />
            ))
          }
        </NoSSR>
        <NoSSR>
          <div>123</div>
          <Col col={4} list={this.colList[0]} />
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
  }
}
