import React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { connect } from '@pages/common/utils/store';
import { PictureItem } from './Item';
import { Col, ColItem } from './styles';

interface IProps {
  list: PictureEntity[][];
  col: number;
  ssr?: boolean;
  like?: (data: PictureEntity) => void;
}

interface IListProps {
  list: PictureEntity[];
  like?: (data: PictureEntity) => void;
}

export const List = connect<React.FC<IListProps>>()(({
  list,
  like,
}: IListProps) => {
  return (
    <>
      {
        list.map(picture => (
          <PictureItem like={like} key={picture.id} detail={picture} />
        ))
      }
    </>
  );
});

export default connect<React.FC<IProps>>()(({
  list,
  col,
  like,
  ssr = false,
}) => {
  if (list.length === 1) {
    return (
      <Col col={col} ssr={ssr}>
        <ColItem>
          <List like={like} list={list[0]} />
        </ColItem>
      </Col>
    );
  }
  return (
    <Col col={col} ssr={ssr}>
      {
        list.map((pictureList, index) => (
          <ColItem key={index} >
            <List like={like} list={pictureList} />
          </ColItem>
        ))
      }
    </Col>
  );
});
