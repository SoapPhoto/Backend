import { Field, ID, InputType } from 'type-graphql';

import { User } from '@entities/User';

@InputType()
export class UserInput implements Partial<User> {
  @Field(type => String)
  public nickname: string;

  @Field(type => String, {
    nullable: true,
  })
  public avatar: string;
}
