import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('picture')
@ObjectType()
export class Picture {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Field()
  @Column()
  public title: string;

  @Field(type => Date)
  @Column()
  public createdAt: Date;

}
