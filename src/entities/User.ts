import * as crypto from 'crypto';
import { Field, ID, ObjectType } from 'type-graphql';
import { AfterLoad, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
@ObjectType()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public nickname: string;

  @Column()
  public hash: string;

  @Column()
  public salt: string;

  @Field()
  @Column({
    unique: true,
  })
  public username: string;

  @Field()
  @Column({
    unique: true,
  })
  public email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public avatar: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public cover: string;

  @CreateDateColumn()
  public createdAt: Date;

  @Field(types => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  public roles: string[];

  @AfterLoad()
  public setDefaultAvatar() {
    if (!this.avatar) {
      const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
      this.avatar = `//gravatar.loli.net/avatar/${emailHash}?d=mp&s=300`;
    }
  }
}
