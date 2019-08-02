import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class ValidatorEmailDto {
  @IsString()
  @Expose()
  public readonly id!: string;

  @IsString()
  @Expose()
  public readonly identifier!: string;

  @IsString()
  @Expose()
  public readonly verificationToken!: string;
}
