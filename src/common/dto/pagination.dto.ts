import { IsNumber } from 'class-validator';

import { Type } from 'class-transformer';
import moment from 'moment';

export class PaginationDto {

  @IsNumber()
  @Type(() => Number)
  public readonly page: number = 1;

  @IsNumber()
  @Type(() => Number)
  public readonly pageSize: number = 30;

  @Type(type => Number)
  public readonly timestamp?: number;

  get time() {
    if (this.timestamp) {
      return moment(this.timestamp).format();
    }
    return undefined;
  }
}
