import React from 'react';

import { CollectionEntity } from '@lib/common/interfaces/collection';
import { Wrapper } from './styles';
import { CollectionItem } from './Item';

export interface ICollectionListProps {
  list: CollectionEntity[];
}

export const CollectionList: React.FC<ICollectionListProps> = ({
  list,
}) => (
  <Wrapper>
    {
      list.map(collection => (
        <CollectionItem info={collection} key={collection.id} />
      ))
    }
  </Wrapper>
);
