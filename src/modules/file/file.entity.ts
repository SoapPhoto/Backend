import {
  Column, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';

import { BaseEntity } from '@server/common/base.entity';
import { FileType } from './enum/type.enum';
import { UserEntity } from '../user/user.entity';
import { PictureEntity } from '../picture/picture.entity';

@Entity('file')
export class FileEntity extends BaseEntity {
  @PrimaryColumn()
  public readonly key!: string;

  @Column({ type: 'enum', enum: FileType })
  public type!: FileType;

  @ManyToOne(() => UserEntity, { eager: true })
  public readonly user?: UserEntity;

  @ManyToOne(() => PictureEntity, { eager: true, onDelete: 'CASCADE' })
  public readonly picture?: PictureEntity;

  @Column({ type: 'bool', default: false })
  public active!: boolean;

  /** 七牛的hash */
  @Column()
  public readonly hash!: string;

  /** 图片原始文件名 */
  @Column()
  public readonly originalname!: string;

  /** 图片类型 */
  @Column()
  public readonly mimetype!: string;

  /** 图片大小 */
  @Column()
  public readonly size!: number;
}
