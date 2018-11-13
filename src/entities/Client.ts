import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('client')
@ObjectType()
export class Client {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createTime: Date;

  @Field()
  @Column()
  public clientName: string;

  @Field()
  @Column()
  public clientSecret: string;

  @Field()
  @Column()
  public clientId: string;

  @Field({ nullable: true })
  @Column({ unique: true })
  public grantTypes: string;

  @Field(types => [String])
  @Column('simple-array')
  public grants: string[];

  @Field({ nullable: true })
  @Column({
    unique: true,
  })
  public redirectUri: string;
}
