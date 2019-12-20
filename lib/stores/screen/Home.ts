import { Pictures } from '@lib/schemas/query';
import { PictureListStore } from '../base/PictureListStore';

export class HomeScreenStore extends PictureListStore {
  constructor() {
    super({
      query: Pictures,
      label: 'pictures',
    });
  }
}
