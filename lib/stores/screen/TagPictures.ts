import { action, observable } from 'mobx';

import { IPictureListRequest } from '@lib/common/interfaces/picture';
import { TagPictures } from '@lib/schemas/query';
import { PictureListStore } from '../base/PictureListStore';

interface ICollectionPictureQuery {
  name: string;
}

interface ITagPicturesGqlReq {
  tagPictures: IPictureListRequest;
}

export class TagScreenPictureList extends PictureListStore<ICollectionPictureQuery> {
  @observable public name = '';

  constructor() {
    super({
      query: TagPictures,
      label: 'tagPictures',
      restQuery: {
        name: '',
      },
    });
  }

  @action public setName = (name: string) => {
    this.restQuery.name = name;
  }
}
