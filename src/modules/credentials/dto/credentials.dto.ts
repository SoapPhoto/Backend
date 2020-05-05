import { IsString } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class AuthorizeDto {
  @IsString()
  @Expose()
  public readonly code!: string;
}
