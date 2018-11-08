import { ObjectID } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ObjectIdColumn, OneToOne } from 'typeorm';

import { Client } from './Client';
import { User } from './User';

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

@Entity('refreshToken')
@ObjectType()
export class RefreshToken {
  @Field(type => ID)
  @ObjectIdColumn()
  public readonly _id: ObjectID;

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
