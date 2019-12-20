import { action } from 'mobx';

import { Pictures } from '@lib/schemas/query';
import { PicturesType } from '@common/enum/picture';
import { PictureListStore } from '../base/PictureListStore';

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
    this.restQuery.type = type === 'new' ? PicturesType.NEW : PicturesType.HOT;
  }
}
