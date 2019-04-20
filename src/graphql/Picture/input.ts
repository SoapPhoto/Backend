import { ArgsType, Field, ID, InputType } from 'type-graphql';

import { Picture } from '@entities/Picture';

@InputType()
export class PictureInput implements Partial<Picture> {
  @Field(type => ID)
  public title: string;
}

@ArgsType()
export class PictureListArgs {
  @Field({
    nullable: true,
    description: '用户id，获取用户列表',
  })
  public userId?: string;
  @Field({
    nullable: true,
    description: '图片id，用于分页',
  })
  public picture?: string;
  @Field({
    nullable: true,
    description: '返回后面n个图片',
  })
  public last?: number;
  @Field({
    nullable: true,
    description: '返回前面n个图片',
  })
  public first?: number;
}
