import * as React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { listParse } from '@pages/common/utils/waterfall';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { PictureItem } from './Item';
import { Col, ColItem, Wapper } from './styles';

interface IProps {
  /**
   * picture列表数据
   *
   * @type {PictureEntity[]}
   * @memberof IProps
   */
  data: PictureEntity[];
}

@observer
export class PictureList extends React.Component<IProps> {
  @observable public colArr = [4, 3, 2];
  @observable public colList: PictureEntity[][][] = [];

  constructor(props: IProps) {
    super(props);
    this.formatList(props.data);
    reaction(
      () => this.props.data,
      (list) => {
        this.formatList(list);
      },
    );
  }
  public formatList = (data: PictureEntity[]) => {
    this.colList = this.colArr.map(col => listParse(data, col));
  }
  public colRender = (col: PictureEntity[], key?: number | string) => (
    <ColItem key={key}>
      {
        col.map((picture, index) => (
          <PictureItem lazyload={index > 10} key={picture.id} detail={picture} />
        ))
      }
    </ColItem>
  )
  public render() {
    return (
      <Wapper>
        {
          this.colList.map((mainCol, i) => (
            <Col col={this.colArr[i]} key={this.colArr[i]}>
              {
                mainCol.map((col, index) => this.colRender(col, index))
              }
            </Col>
          ))
        }
        <Col col={1}>
          {this.colRender(this.props.data)}
        </Col>
      </Wapper>
    );
  }
}
