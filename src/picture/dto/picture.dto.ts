import { PaginationDto } from '@server/common/dto/pagination.dto';
import { TagEntity } from '@server/tag/tag.entity';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsJSON, IsString } from 'class-validator';

export class GetPictureListDto extends PaginationDto {

}

@Exclude()
export class CreatePictureAddDot {
  /**
   * 图片信息
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @IsJSON()
  @Expose()
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
  @IsJSON()
// tslint:disable-next-line: prefer-array-literal
  public readonly tags!: string;
}
