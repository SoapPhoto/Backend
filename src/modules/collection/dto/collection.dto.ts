import { PaginationDto } from '@server/common/dto/pagination.dto';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { CollectionEntity } from '../collection.entity';

export class GetCollectionPictureListDto extends PaginationDto {

}
export class GetUserCollectionListDto extends PaginationDto {

}

@Exclude()
export class CreateCollectionDot implements Partial<CollectionEntity> {
  @IsString()
  @Expose()
  public name!: string;

  @IsString()
  @Expose()
  public bio!: string;

  @IsBoolean()
  @Expose()
  public isPrivate!: boolean;
}

export class UpdateCollectionDot extends CreateCollectionDot {}

@Exclude()
export class AddPictureCollectionDot {
  @IsString()
  @Expose()
  public pictureId!: string;
}
