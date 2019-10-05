import { computed, observable, runInAction } from 'mobx';

import { IBaseQuery } from '@lib/common/interfaces/global';
import { IPictureLikeRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { LikePicture, UnLikePicture } from '@lib/schemas/mutations';
import Fragments from '@lib/schemas/fragments';
import { BaseStore } from './BaseStore';

export class ListStore<L, Q = {}> extends BaseStore {
  @observable public init = false;

  @observable public list: L[] = [];

  @observable public listQuery!: Q & IBaseQuery;

  @observable public count = 0;

  constructor() {
    super();
  }

  @computed get maxPage() {
    const { pageSize } = this.listQuery;
    return Math.ceil(this.count / pageSize);
  }

  @computed get isNoMore() {
    const { pageSize, page } = this.listQuery;
    const maxPage = Math.ceil(this.count / pageSize);
    return maxPage <= page;
  }

  public like = async (picture: PictureEntity) => {
    try {
      let req: IPictureLikeRequest;
      if (!picture.isLike) {
        const { data } = await this.client.mutate<{likePicture: IPictureLikeRequest}>({
          mutation: LikePicture,
          variables: {
            id: picture.id,
          },
        });
        req = data!.likePicture;
      } else {
        const { data } = await this.client.mutate<{unlikePicture: IPictureLikeRequest}>({
          mutation: UnLikePicture,
          variables: {
            id: picture.id,
          },
        });
        req = data!.unlikePicture;
      }
      const cacheData = this.client.readFragment<PictureEntity>({
        fragment: Fragments,
        fragmentName: 'PictureFragment',
        id: `Picture:${picture.id}`,
      });
      if (cacheData) {
        this.client.writeFragment<PictureEntity>({
          fragment: Fragments,
          fragmentName: 'PictureFragment',
          id: `Picture:${picture.id}`,
          data: {
            ...cacheData,
            isLike: req.isLike,
            likes: req.count,
          } as PictureEntity,
        });
      }
      runInAction(() => {
        picture.isLike = req.isLike;
        picture.likes = req.count;
      });
    // tslint:disable-next-line: no-empty
    } catch (err) {
      console.dir(err);
    }
  }
}
