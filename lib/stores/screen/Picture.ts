import {
  action, observable, computed,
} from 'mobx';
import { merge, pick } from 'lodash';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { PictureEntity, IPictureLikeRequest } from '@lib/common/interfaces/picture';
import { addComment, getPictureComment } from '@lib/services/comment';
import {
  deletePicture,
} from '@lib/services/picture';

import { Picture } from '@lib/schemas/query';
import { queryToMobxObservable } from '@lib/common/apollo';
import Fragments from '@lib/schemas/fragments';
import { LikePicture, UnLikePicture } from '@lib/schemas/mutations';
import { BaseStore } from '../base/BaseStore';

interface IPictureGqlReq {
  picture: PictureEntity;
}

export class PictureScreenStore extends BaseStore {
  // @observable public gqlData: Apollo

  @observable public info!: PictureEntity;

  @observable public comment: CommentEntity[] = [];

  @observable public id!: number;

  @action public setInfo = (data: PictureEntity) => {
    this.id = Number(data.id);
    this.info = data;
  }

  @action public setComment = (data: CommentEntity[]) => {
    this.comment = data;
  }

  @computed
  get isCollected() {
    return !!(this.info && this.info.currentCollections.length > 0);
  }

  public getPictureInfo = async (id: ID) => {
    await queryToMobxObservable(this.client.watchQuery<{picture: PictureEntity}>({
      query: Picture,
      variables: { id },
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      console.log(data.picture);
      this.setInfo(data.picture);
    });
  }

  @action public getComment = async () => {
    const { data } = await getPictureComment(this.id);
    this.setComment(data.data);
  }

  public addComment = async (content: string) => {
    const { data } = await addComment(content, this.id);
    this.pushComment(data);
  }

  public deletePicture = async () => {
    await deletePicture(this.id);
  }

  @action public pushComment = (comment: CommentEntity) => {
    this.comment.unshift(comment);
  }

  @action
  public like = async () => {
    try {
      let req;
      if (!this.info.isLike) {
        const { data } = await this.client.mutate<{likePicture: IPictureLikeRequest}>({
          mutation: LikePicture,
          variables: {
            id: this.info.id,
          },
        });
        req = data!.likePicture;
      } else {
        const { data } = await this.client.mutate<{unlikePicture: IPictureLikeRequest}>({
          mutation: UnLikePicture,
          variables: {
            id: this.info.id,
          },
        });
        req = data!.unlikePicture;
      }
      this.info.isLike = req.isLike;
      this.info.likes = req.count;
      const cacheData = this.client.readFragment<PictureEntity>({
        fragment: Fragments,
        fragmentName: 'PictureFragment',
        id: `Picture:${this.info.id}`,
      });
      if (cacheData) {
        this.client.writeFragment<PictureEntity>({
          fragment: Fragments,
          fragmentName: 'PictureFragment',
          id: `Picture:${this.info.id}`,
          data: {
            ...cacheData,
            isLike: req.isLike,
            likes: req.count,
          } as PictureEntity,
        });
      }
    // tslint:disable-next-line: no-empty
    } catch (err) {
      console.error(err);
    }
  }

  public getCache = async (id: ID) => {
    try {
      const data = this.client.readQuery<IPictureGqlReq>({
        query: Picture,
        variables: { id },
      });
      if (data) {
        this.setInfo(data.picture);
      } else {
        throw new Error();
      }
    } catch {
      await this.getPictureInfo(id);
    }
  }

  public updateInfo = (picture: PictureEntity) => {
    const cacheData = this.client.readFragment<PictureEntity>({
      fragment: Fragments,
      fragmentName: 'PictureDetailFragment',
      id: `Picture:${this.info.id.toString()}`,
    });
    const newData = pick(picture, ['title', 'bio', 'tags', 'isPrivate']);
    if (cacheData) {
      this.client.writeFragment<PictureEntity>({
        fragment: Fragments,
        fragmentName: 'PictureDetailFragment',
        id: `Picture:${this.info.id.toString()}`,
        data: {
          ...cacheData,
          ...newData,
        } as PictureEntity,
      });
    }
    this.setInfo(merge(this.info, newData));
  }
}
