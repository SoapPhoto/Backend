import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

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

@Exclude()
export class ResetPasswordDto {
  @Length(8, 30)
  @IsString()
  @Expose()
  public password!: string;

  @Length(8, 30)
  @IsString()
  @Expose()
  public newPassword!: string;
}

@Exclude()
export class NewPasswordDto {
  @Length(8, 30)
  @IsString()
  @Expose()
  public newPassword!: string;
}
