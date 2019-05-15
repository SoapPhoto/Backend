import * as React from 'react';

import { IPictureListRequest, PictureEntity } from '@pages/common/interfaces/picture';
import { listParse } from '@pages/common/utils/waterfall';
import { PictureItem } from './Item';
import { Col, ColItem, Wapper } from './styles';

interface IProps {
  data: PictureEntity[];
}

export const PictureList: React.FC<IProps> = ({
  data,
}) => {
  const [list, setList] = React.useState(listParse(data, 4));
  React.useEffect(
    () => {
      setList(listParse(data, 4));
    },
    [data],
  );
  return (
    <Wapper>
      <Col col={4}>
        {
          list.map((col, index) => (
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
    </Wapper>
  );
};
