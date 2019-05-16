import * as React from 'react';

import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { server } from '@pages/common/utils';
import useMedia from '@pages/common/utils/useMedia';
import { listParse } from '@pages/common/utils/waterfall';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { PictureItem } from './Item';
import { Col, ColItem, Wapper } from './styles';

interface IProps {
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
  public render() {
    return (
      <Wapper>
        {
          this.colList.map((mainCol, i) => (
            <Col col={this.colArr[i]} key={this.colArr[i]}>
              {
                mainCol.map((col, index) => (
                  <ColItem key={index}>
                    {
                      col.map(picture => (
                        <PictureItem key={picture.id} detail={picture} />
                      ))
                    }
                  </ColItem>
                ))
              }
            </Col>
          ))
        }
        <Col col={1}>
          <ColItem>
            {
              this.props.data.map(picture => (
                <PictureItem key={picture.id} detail={picture} />
              ))
            }
          </ColItem>
        </Col>
      </Wapper>
    );
  }
}
