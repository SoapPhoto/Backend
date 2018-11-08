import { ObjectID } from 'mongodb';
import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

@Entity('client')
@ObjectType()
export class Client {
  @Field(type => ID)
  @ObjectIdColumn()
  public readonly _id: ObjectID;

  @Field()
  @Column()
  public clientName: string;

  @Field()
  @Column()
  public clientSecret: string;

  @Field()
  @Column()
  public clientId: string;

  @Field()
  @Column()
  public grantTypes: string;

  @Field(types => [String])
  @Column('simple-array')
  public grants: string[];

  @Field()
  @Column()
  public redirectUri: string;

}
