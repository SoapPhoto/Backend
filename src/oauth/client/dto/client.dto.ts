import { IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  public readonly secret: string;
}
