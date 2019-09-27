import {
  action, observable, computed,
} from 'mobx';
import { merge, pick } from 'lodash';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { PictureEntity } from '@lib/common/interfaces/picture';
import { addComment, getPictureComment } from '@lib/services/comment';
import {
  likePicture, unlikePicture, deletePicture,
} from '@lib/services/picture';

import { Picture } from '@lib/schemas/query';
import { queryToMobxObservable } from '@lib/common/apollo';
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
      let func = unlikePicture;
      if (!this.info.isLike) {
        func = likePicture;
      }
      const { data } = await func(this.info.id);
      this.info.isLike = data.isLike;
      this.info.likes = data.count;
      const cacheData = this.client.readQuery<IPictureGqlReq>({
        query: Picture,
        variables: { id: this.info.id },
      });
      this.client.writeQuery({
        query: Picture,
        variables: { id: this.info.id },
        data: {
          picture: {
            ...cacheData!.picture,
            isLike: data.isLike,
            likes: data.count,
          },
        },
      });
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
    const cacheData = this.client.readQuery<IPictureGqlReq>({
      query: Picture,
      variables: { id: this.info.id },
    });
    const newData = pick(picture, ['title', 'bio', 'tags', 'isPrivate']);
    this.client.writeQuery({
      query: Picture,
      variables: { id: this.info.id },
      data: {
        picture: {
          ...cacheData!.picture,
          ...newData,
        },
      },
    });
    this.setInfo(merge(this.info, newData));
  }
}
