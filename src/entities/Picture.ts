import { Field, ID, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('picture')
@ObjectType()
export class Picture {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  public title: string;

  @Field()
  @Column()
  public hash: string;

  @Field()
  @ManyToOne(type => User)
  @JoinColumn()
  public user: User;

  @Field(type => Date)
  @CreateDateColumn()
  public createdAt: Date;

}
