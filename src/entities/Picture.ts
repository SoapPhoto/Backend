import { Field, ID, InputType, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@InputType('PictureExifInput')
@ObjectType('PictureExif')
export class PictureExif {
  @Field({
    nullable: true,
  })
  public aperture?: number;

  @Field({
    nullable: true,
  })
  public exposureTime?: string;

  @Field({
    nullable: true,
  })
  public focalLength?: number;

  @Field(type => [Number], {
    nullable: true,
  })
  public gps?: number[];

  @Field({
    nullable: true,
  })
  public iso?: number;

  @Field({
    nullable: true,
  })
  public make?: string;

  @Field({
    nullable: true,
  })
  public model?: string;
}

@InputType('PictureInfoInput')
@ObjectType('PictureInfo')
export class PictureInfo {
  @Field()
  public width: number;

  @Field()
  public height: number;

  @Field(type => PictureExif, {
    nullable: true,
  })
  public exif: PictureExif;

  @Field(type => [Number])
  public color: number[];
}

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
  @Column()
  public key: string;

  @Field(type => PictureInfo)
  @Column('simple-json')
  public info: PictureInfo;

  @Field()
  @ManyToOne(type => User)
  @JoinColumn()
  public user: User;

  @Field(type => Date)
  @CreateDateColumn()
  public createdAt: Date;

}
