import { ObjectID } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

@Entity('user')
@ObjectType()
export class User {
  @Field(type => ID)
  @ObjectIdColumn()
  public readonly _id: ObjectID;

  @Field()
  @Column()
  public nickname: string;

  @Field()
  @Column()
  public hash: string;

  @Field()
  @Column()
  public salt: string;

  @Field()
  @Column()
  public username: string;

  @Field()
  @Column()
  public email: string;

  @Field()
  @Column()
  public description: string;

  @Field()
  @Column()
  public avatar: string;

  @Field()
  @Column()
  public cover: string;

  @Field(type => Date)
  @Column()
  public createdAt: Date;

}
