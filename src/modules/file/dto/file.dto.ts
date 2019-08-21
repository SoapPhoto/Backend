import { Exclude, Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { FileEntity } from '../file.entity';
import { FlieType } from '../enum/type.enum';

@Exclude()
export class CreateFileDot implements Partial<FileEntity> {
  @IsString()
  @Expose()
  public key!: string;

  @IsString()
  @Expose()
  public hash!: string;

  @Type(() => String)
  @Expose()
  public userId!: ID;

  @Expose()
  public type!: FlieType;

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
  public type!: FlieType;
}
