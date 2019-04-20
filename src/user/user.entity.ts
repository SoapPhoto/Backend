import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from '@/common/base.entity';
import { IsEmail } from 'class-validator';

@Entity('user')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @PrimaryColumn({
    readonly: true,
    unique: true,
    length: 15,
  })
  public readonly username: string;

  @IsEmail()
  @Column({
    unique: true,
  })
  public readonly email: string;

  @Exclude()
  @Column({ select: false })
  public hash: string;

  @Exclude()
  @Column({ select: false })
  public salt: string;

}
