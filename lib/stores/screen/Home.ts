import { action } from 'mobx';

import { Pictures } from '@lib/schemas/query';
import { PicturesType } from '@common/enum/picture';
import { PictureListStore } from '../base/PictureListStore';

const typeObj: Record<string, PicturesType> = {
  new: PicturesType.NEW,
  hot: PicturesType.HOT,
  choice: PicturesType.CHOICE,
  feed: PicturesType.FEED,
};

export class HomeScreenStore extends PictureListStore<{type: PicturesType}> {
  constructor() {
    super({
      query: Pictures,
      label: 'pictures',
      restQuery: {
        type: PicturesType.HOT,
      },
    });
  }

  @action public setType = (type: string) => {
    this.restQuery.type = typeObj[type];
  }
}
