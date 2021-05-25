import {
  Exclude, Expose, Type,
} from 'class-transformer';
import {
  IsArray, IsBoolean, IsNotEmpty, IsString, IsOptional, IsObject,
} from 'class-validator';

import { PaginationDto } from '@server/common/dto/pagination.dto';
import dayjs from 'dayjs';
import { BaiduClassify } from '@server/shared/baidu/interface/baidu.interface';
import { PictureEntity } from '../picture.entity';
import { PictureLocation } from '../interface/location.interface';

export class GetPictureListDto extends PaginationDto {

}

export class GetNewPictureListDto extends PaginationDto {
  @Type(() => Number)
  public readonly lastTimestamp?: number;

  get lastTime() {
    if (this.lastTimestamp) {
      return dayjs(this.lastTimestamp).format();
    }
    return undefined;
  }
}

export class GetUserPictureListDto extends GetPictureListDto {

}

@Exclude()
export class CreatePictureAddDot implements Partial<PictureEntity> {
  @IsString()
  @Expose()
  public readonly key!: string;

  /**
   * 图片信息
   *
   * @type {string}
   * @memberof CreateUserDto
   */
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
  @IsNotEmpty()
  @IsArray()
  public readonly tags!: any;

  @IsBoolean()
  @Expose()
  public readonly isPrivate!: boolean;

  @IsOptional()
  @IsObject()
  @Expose()
  public readonly location?: PictureLocation;

  @Type(() => BaiduClassify)
  @Expose()
  public readonly classify?: BaiduClassify[];
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
  @Expose()
  public readonly isPrivate!: boolean

  @Expose()
  @IsNotEmpty()
  @IsArray()
  public readonly tags!: any;
}
