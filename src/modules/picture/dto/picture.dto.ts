import {
  Exclude, Expose, Transform,
} from 'class-transformer';
import {
  IsArray, IsBoolean, IsNotEmpty, IsString,
} from 'class-validator';

import { PaginationDto } from '@server/common/dto/pagination.dto';
import { transformJson } from '@server/common/utils/transform';
import { PictureEntity } from '../picture.entity';

export class GetPictureListDto extends PaginationDto {

}

export class GetUserPictureListDto extends GetPictureListDto {
  public readonly id!: string;

  public readonly username!: string;
}

@Exclude()
export class CreatePictureAddDot implements Partial<PictureEntity> {
  /**
   * 图片信息
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @Transform(transformJson)
  @Expose()
  @IsNotEmpty()
  public readonly info!: any;

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
  public readonly tags!: any;

  @IsBoolean()
  @Transform(value => (value !== '0'))
  @Expose()
  public readonly isPrivate!: boolean;
}

@Exclude()
export class UpdatePictureDot implements Partial<PictureEntity> {
  @IsString()
  @Expose()
  public readonly title!: string

  @IsString()
  @Expose()
  public readonly bio!: string

  @IsBoolean()
  @Transform(value => (value !== '0'))
  @Expose()
  public readonly isPrivate!: boolean

  @Expose()
  @IsNotEmpty()
  @IsArray()
  public readonly tags!: any;
}
