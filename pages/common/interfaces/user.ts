import { BaseEntity } from './base';
import { PictureEntity } from './picture';

export declare class UserEntity extends BaseEntity {
  public readonly id: number;
  public readonly username: string;
  public readonly email: string;
  public hash: string;
  public readonly salt: string;
  public readonly role: string;
  public readonly pictures: PictureEntity[];
  public likes: number;
  public pictureCount: number;
}
