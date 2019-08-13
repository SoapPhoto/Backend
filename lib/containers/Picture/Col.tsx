import React from 'react';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { connect } from '@lib/common/utils/store';
import { PictureItem } from './Item';
import { Col, ColItem } from './styles';

interface IProps {
  list: PictureEntity[][];
  col: number;
  ssr?: boolean;
  like?: (data: PictureEntity) => void;
  style?: React.CSSProperties;
}

interface IListProps {
  list: PictureEntity[];
  like?: (data: PictureEntity) => void;
}

export const List = connect<React.FC<IListProps>>()(({
  list,
  like,
}: IListProps) => (
  <>
    {
      list.map((picture, index) => (
        <PictureItem size="small" lazyload={index > 4} like={like} key={picture.id} detail={picture} />
      ))
    }
  </>
));

export default connect<React.FC<IProps>>()(({
  list,
  col,
  like,
  ssr = false,
  style,
}) => {
  if (list.length === 1) {
    return (
      <Col style={style} col={col} ssr={ssr}>
        <ColItem>
          <List like={like} list={list[0]} />
        </ColItem>
      </Col>
    );
  }
  return (
    <Col style={style} col={col} ssr={ssr}>
      {
        list.map((pictureList, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <ColItem key={index}>
            <List like={like} list={pictureList} />
          </ColItem>
        ))
      }
    </Col>
  );
});
