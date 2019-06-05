import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

@Exclude()
export class CreateCollectionDot {

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
