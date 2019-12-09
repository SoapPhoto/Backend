import {
  action, observable, computed,
} from 'mobx';
import { merge, pick } from 'lodash';
import animateScrollTo from 'animated-scroll-to';

import { CommentEntity } from '@lib/common/interfaces/comment';
import { PictureEntity, IPictureLikeRequest } from '@lib/common/interfaces/picture';
import {
  deletePicture,
} from '@lib/services/picture';

import { queryToMobxObservable } from '@lib/common/apollo';
import { Picture, Comments } from '@lib/schemas/query';
import Fragments from '@lib/schemas/fragments';
import { LikePicture, UnLikePicture, AddComment } from '@lib/schemas/mutations';
import { IPaginationList } from '@lib/common/interfaces/global';
import Toast from '@lib/components/Toast';
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
    await queryToMobxObservable(this.client.watchQuery<{comments: IPaginationList<CommentEntity>}>({
      query: Comments,
      variables: { id: this.id },
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      this.setComment(data.comments.data);
    });
    // // const { data } = await getPictureComment(this.id);
  }

  public addComment = async (content: string, commentId?: ID) => {
    const { data } = await this.client.mutate<{addComment: CommentEntity}>({
      mutation: AddComment,
      variables: {
        id: this.id,
        commentId,
        data: {
          content,
        },
      },
    });
    this.pushComment(data!.addComment, commentId);
  }

  public deletePicture = async () => {
    await deletePicture(this.id);
  }

  @action public pushComment = (comment: CommentEntity, commentId?: ID) => {
    const func = (child: CommentEntity[]) => child.forEach((item) => {
      if (item.id === commentId) {
        if (item.parentComment) {
          const index = this.comment.findIndex(v => v.id === item.parentComment.id);
          if (index >= 0) {
            this.comment[index].childComments.push(comment);
          }
        } else if (!item.childComments) {
          item.childComments = [comment];
        } else {
          item.childComments.push(comment);
        }
      } else {
        func(item.childComments || []);
      }
    });
    if (commentId) {
      func(this.comment);
    } else {
      this.comment.push(comment);
    }
    Toast.success('评论成功！');
    setTimeout(() => {
      const query = document.querySelector(`#comment-${comment.id}`);
      if (query) {
        animateScrollTo(query, {
          verticalOffset: -window.innerHeight / 2,
        });
      }
    }, 300);
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
      this.info.likedCount = req.count;
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
            likedCount: req.count,
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
    } catch (err) {
      console.error(err);
      await this.getPictureInfo(id);
    }
  }

  @action
  public setPicture = (picture: Partial<PictureEntity>) => {
    const cacheData = this.getCachePicture();
    if (cacheData) {
      this.info = {
        ...cacheData,
        ...picture,
      } as PictureEntity;
      this.setCachePicture(this.info);
    }
  }

  public updateInfo = (picture: PictureEntity) => {
    const cacheData = this.getCachePicture();
    const newData = pick(picture, ['title', 'bio', 'tags', 'isPrivate']);
    if (cacheData) {
      this.setCachePicture({
        ...cacheData,
        ...newData,
      } as PictureEntity);
    }
    this.setInfo(merge(this.info, newData));
  }

  public setCachePicture = (picture: PictureEntity) => {
    this.client.writeFragment<PictureEntity>({
      fragment: Fragments,
      fragmentName: 'PictureDetailFragment',
      id: `Picture:${this.info.id}`,
      data: picture,
    });
  }

  public getCachePicture = () => {
    try {
      return this.client.readFragment<PictureEntity>({
        fragment: Fragments,
        fragmentName: 'PictureDetailFragment',
        id: `Picture:${this.info.id}`,
      });
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
