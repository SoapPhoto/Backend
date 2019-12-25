import { action, observable } from 'mobx';

import { SearchPictures } from '@lib/schemas/query';
import { PictureListStore } from '../../base/PictureListStore';

export class SearchScreenPictures extends PictureListStore<{words: string}> {
  @observable public loading = false;

  constructor() {
    super({
      query: SearchPictures,
      label: 'searchPictures',
      restQuery: {
        words: '',
      },
    });
  }

  @action public setWords = (words: string) => {
    this.restQuery.words = words;
  }

  @action public search = async (words: string) => {
    if (this.loading) return;
    this.setLoading(true);
    this.restQuery.words = words;
    try {
      if (words) {
        await this.getList(false, true);
      }
    } finally {
      this.setLoading(false);
    }
  }

  @action public setLoading = (loading: boolean) => this.loading = loading;
}
