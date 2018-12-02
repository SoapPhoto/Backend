import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Client } from './Client';
import { User } from './User';

@Entity('refreshToken')
@ObjectType()
export class RefreshToken {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Field()
  @Column({
    unique: true,
  })
  public refreshToken: string;

  @Field(type => Date)
  @Column()
  public expires: Date;

  @Field(type => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @Column({
    nullable: true,
  })
  public scope: string;

  @Field()
  @ManyToOne(type => Client)
  @JoinColumn()
  public client: Client;

  @Field()
  @ManyToOne(type => User)
  @JoinColumn()
  public user: User;

}
