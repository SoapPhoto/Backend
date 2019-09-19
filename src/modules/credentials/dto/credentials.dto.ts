import { IsString } from 'class-validator/decorator/decorators';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class AuthorizeDto {
  @IsString()
  @Expose()
  public readonly code!: string;
}
