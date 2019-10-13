import {
  computed, observable, runInAction, toJS,
} from 'mobx';
import { DocumentNode } from 'graphql';

import { IBaseQuery } from '@lib/common/interfaces/global';
import { IPictureLikeRequest, PictureEntity, IPictureListRequest } from '@lib/common/interfaces/picture';
import { LikePicture, UnLikePicture } from '@lib/schemas/mutations';
import Fragments from '@lib/schemas/fragments';
import { BaseStore } from './BaseStore';

export class ListStore<L, V = any, Q = {}> extends BaseStore {
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
    return this.count <= this.list.length;
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

  public setPlusListCache = (query: DocumentNode, label: string, data: IPictureListRequest, type: Record<string, any> = {}) => {
    try {
      const cacheData = this.client.readQuery({
        query,
        variables: {
          ...this.listQuery,
          ...type,
          page: 1,
        },
      });
      if (cacheData) {
        cacheData[label].data = cacheData[label].data.concat(data.data);
        cacheData[label].page = data.page;
        cacheData[label].pageSize = data.pageSize;
        this.client.writeQuery({
          query,
          variables: {
            ...this.listQuery,
            ...type,
            page: 1,
          },
          data: cacheData,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }
}
