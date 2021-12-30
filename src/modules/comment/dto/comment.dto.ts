import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import { PaginationDto } from '@server/common/dto/pagination.dto';
import { CommentEntity } from '../comment.entity';

@Exclude()
export class CreatePictureCommentDot implements Partial<CommentEntity> {
  /**
   * picture标题
   *
   * @type {string}
   * @memberof CreateUserDto
   */
  @IsString()
  @Expose()
  public readonly content!: string;
}

export class GetPictureCommentListDto extends PaginationDto {}
