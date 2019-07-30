import {
  IsOptional, IsPositive, Max, Min,
} from 'class-validator';

import { Type } from 'class-transformer';
import moment from 'moment';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  public readonly page: number = 1;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  public readonly pageSize: number = Number(process.env.LIST_PAGE_SIZE);

  @Type(() => Number)
  public readonly timestamp?: number;

  get time() {
    if (this.timestamp) {
      return moment(this.timestamp).format();
    }
    return undefined;
  }
}
