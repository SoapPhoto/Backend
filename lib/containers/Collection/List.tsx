import React from 'react';

import { CollectionEntity } from '@lib/common/interfaces/collection';
import { Empty } from '@lib/components/Empty';
import { Wrapper, List } from './styles';
import { CollectionItem } from './Item';

export interface ICollectionListProps {
  list: CollectionEntity[];
  noMore: boolean;
}

export const CollectionList: React.FC<ICollectionListProps> = ({
  list,
  noMore,
}) => (
  <Wrapper>
    <List>
      {
        list.map(collection => (
          <CollectionItem info={collection} key={collection.id} />
        ))
      }
    </List>
    <Empty loading={!noMore} />
  </Wrapper>
);
