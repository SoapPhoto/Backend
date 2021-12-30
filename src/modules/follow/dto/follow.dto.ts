import { IsNumber } from 'class-validator';
import { Expose, Exclude, Type } from 'class-transformer';

@Exclude()
export class FollowUserDto {
  @IsNumber()
  @Expose()
  @Type(() => Number)
  public readonly userId!: number;
}

@Exclude()
export class FollowUsersDto {
  @IsNumber()
  @Expose()
  @Type(() => Number)
  public readonly id!: number;
}
