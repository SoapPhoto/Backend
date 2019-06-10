import { Exclude, Expose, Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

import { PaginationDto } from '@server/common/dto/pagination.dto';
import { transformJson } from '@server/common/utils/transform';

export class GetPictureListDto extends PaginationDto {
}

export class GetUserPictureListDto extends GetPictureListDto {
  public readonly id!: string;

  public readonly username!: string;
}

@Exclude()
export class CreatePictureAddDot {
  /**
   * 图片信息
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @Transform(transformJson)
  @Expose()
  @IsNotEmpty()
  public readonly info!: string;

  /**
   * picture标题
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @IsString()
  @Expose()
  public readonly title!: string;

  /**
   * picture简介
   *
   * @type {string}
   * @memberof CreatePictureAddDot
   */
  @IsString()
  @Expose()
  public readonly bio!: string;

  @Expose()
  @Transform(transformJson)
  @IsNotEmpty()
  @IsArray()
  public readonly tags!: string;

  @IsBoolean()
  @Transform(value => value === '0' ? false : true)
  @Expose()
  public readonly isPrivate!: boolean;
}
