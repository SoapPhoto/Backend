import { BaseEntity } from './base';
import { UserEntity } from './user';

import { PaginationList } from './global';

export declare class PictureEntity extends BaseEntity {
  public readonly id: number;
  public readonly key: string;
  public readonly hash: string;
  public readonly originalname: string;
  public readonly mimetype: string;
  public readonly size: number;
  public readonly user: UserEntity;
  public readonly height: number;
  public readonly width: number;
  public isLike: boolean;
  public likes: number;
}

export interface IPictureListRequest extends PaginationList {
  data: PictureEntity[];
}
