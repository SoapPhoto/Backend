import { action } from 'mobx';

import { CollectionPictures } from '@lib/schemas/query';
import { PictureListStore } from '../base/PictureListStore';

interface ICollectionPictureQuery {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface

export class CollectionScreenPictureList extends PictureListStore<ICollectionPictureQuery> {
  constructor() {
    super({
      query: CollectionPictures,
      label: 'collectionPictures',
      // restQuery: {
      //   id: '',
      // },
    });
  }

  @action public setId = (id: number) => {
    this.restQuery.id = id;
  }
}
