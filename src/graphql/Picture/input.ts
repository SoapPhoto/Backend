import { Field, ID, InputType } from 'type-graphql';

import { Picture } from '@entities/Picture';

@InputType()
export class PictureInput implements Partial<Picture> {
  @Field(type => ID)
  public title: string;
}
