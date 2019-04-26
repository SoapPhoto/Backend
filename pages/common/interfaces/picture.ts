import { BaseEntity } from './base';
import { UserEntity } from './user';

export declare class PictureEntity extends BaseEntity {
  public readonly id: number;
  public readonly key: string;
  public readonly hash: string;
  public readonly originalname: string;
  public readonly mimetype: string;
  public readonly size: number;
  public readonly user: UserEntity;
  public isLike: boolean;
  public likes: number;
}
