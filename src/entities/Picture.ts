import { ObjectID } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

@Entity('picture')
@ObjectType()
export class Picture {
  @Field(type => ID)
  @ObjectIdColumn()
  // tslint:disable-next-line:variable-name
  public readonly _id: ObjectID;

  @Field()
  @Column()
  public title: string;

  @Field(type => Date)
  @Column()
  public createdAt: Date;

}
