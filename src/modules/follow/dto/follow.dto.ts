import { IsNumber } from 'class-validator';
import { Expose, Exclude, Type } from 'class-transformer';
import { Default } from '@server/common/transformer/default';

@Exclude()
export class FollowUserDto {
  @IsNumber()
  @Expose()
  @Type(() => Number)
  public readonly userId!: number
}

@Exclude()
export class FollowUsersDto {
  @IsNumber()
  @Expose()
  @Type(() => Number)
  public readonly id!: number

  @Type(() => Number)
  @Expose()
  @Default(30)
  public readonly limit!: number

  @Type(() => Number)
  @Expose()
  @Default(0)
  public readonly offset!: number
}
