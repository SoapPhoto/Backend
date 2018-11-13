import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
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
  @Column()
  public refreshToken: string;

  @Field(type => Date)
  @Column()
  public expires: Date;

  @Field(type => Date)
  @CreateDateColumn()
  public createdAt: Date;

  @Field()
  @Column()
  public scope: string;

  @Field()
  @OneToOne(type => Client)
  @JoinColumn()
  public client: Client;

  @Field()
  @OneToOne(type => User)
  @JoinColumn()
  public user: User;

}
