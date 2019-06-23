import { action, observable } from 'mobx';

import { CommentEntity } from '@pages/common/interfaces/comment';
import { PictureEntity } from '@pages/common/interfaces/picture';
import { addComment, getPictureComment } from '@pages/services/comment';
import { getPicture, likePicture } from '@pages/services/picture';
import { BaseStore } from '../base/BaseStore';

export class PictureScreenStore extends BaseStore {
  @observable public info!: PictureEntity;
  @observable public comment: CommentEntity[] = [];
  @observable public id!: number;

  @action public setInfo = (data: PictureEntity) => {
    this.id = data.id;
    this.info = data;
  }
  public getPictureInfo = async (id: string, header?: any) => {
    const { data } = await getPicture(id, header);
    if (!data) {
      return {
        error: {
          statusCode: 404,
        },
      };
    }
    this.setInfo(data);
    return undefined;
  }
  @action public getComment = async () => {
    const { data } = await getPictureComment(this.id);
    this.comment = data.data;
  }
  public addComment = async (content: string) => {
    const { data } = await addComment(content, this.id);
    this.pushComment(data);
  }
  @action public pushComment = (comment: CommentEntity) => {
    this.comment.unshift(comment);
  }
  @action
  public like = async () => {
    const oldData = this.info.isLike;
    this.info.isLike = !this.info.isLike;
    try {
      await likePicture(this.info.id);
    } catch (err) {
      this.info.isLike = oldData;
      console.error(err);
    }
  }
}
