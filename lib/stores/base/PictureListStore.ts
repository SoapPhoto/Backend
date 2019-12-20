import {
  runInAction,
} from 'mobx';

import { IPictureLikeRequest, PictureEntity } from '@lib/common/interfaces/picture';
import { LikePicture, UnLikePicture } from '@lib/schemas/mutations';
import Fragments from '@lib/schemas/fragments';
import { apolloErrorLog } from '@lib/common/utils/error';
import { ListStore, IListStoreData } from './ListStore';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IPictureListData<T> extends IListStoreData<T> {

}

export class PictureListStore<Query = {}> extends ListStore<PictureEntity, Query> {
  constructor(data: IPictureListData<Query>) {
    super(data);
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
            likedCount: req.count,
          } as PictureEntity,
        });
      }
      runInAction(() => {
        picture.isLike = req.isLike;
        picture.likedCount = req.count;
      });
    // tslint:disable-next-line: no-empty
    } catch (err) {
      apolloErrorLog(err);
    }
  }
}
