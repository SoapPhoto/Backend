import React from 'react';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { connect } from '@pages/common/utils/store';
import { PictureItem } from './Item';
import { Col, ColItem } from './styles';

interface IProps {
  list: PictureEntity[][];
  col: number;
}

interface IListProps {
  list: PictureEntity[];
}

export const List = connect<React.FC<IListProps>>()(({
  list,
}: IListProps) => {
  return (
    <>
      {
        list.map(picture => (
          <PictureItem key={picture.id} detail={picture} />
        ))
      }
    </>
  );
});

export default connect<React.FC<IProps>>()(({
  list,
  col,
}) => {
  if (list.length === 1) {
    return (
      <ColItem>
        <List list={list[0]} />
      </ColItem>
    );
  }
  return (
    <Col col={col}>
      {
        list.map((pictureList, index) => (
          <ColItem key={index} >
            <List list={pictureList} />
          </ColItem>
        ))
      }
    </Col>
  );
});
