import { Exclude, Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { FileEntity } from '../file.entity';
import { FileType } from '../enum/type.enum';

@Exclude()
export class CreateFileDot implements Partial<FileEntity> {
  @IsString()
  @Expose()
  public key!: string;

  @IsString()
  @Expose()
  public hash!: string;

  @Type(() => Number)
  @Expose()
  public userId!: number;

  @Expose()
  public type!: FileType;

  @Expose()
  public originalname!: string;

  @Type(() => Number)
  @Expose()
  public size!: number;

  @Expose()
  public mimetype!: string;
}


@Exclude()
export class GetTokenDot {
  @IsString()
  @Expose()
  public type!: FileType;
}
