import { IsEmail, IsNumber, IsString } from 'class-validator';

import { Type } from 'class-transformer';
import moment = require('moment');

export class PaginationDto {

  @IsNumber()
  public readonly page: number = 1;

  @IsNumber()
  public readonly pageSize: number = 10;

  @Type(type => Number)
  public readonly timestamp?: number;

  get time() {
    if (this.timestamp) {
      return moment(this.timestamp).format();
    }
    return undefined;
  }
}
