import { Request } from 'express';
import { PaginationDto } from '../dto/pagination.dto';

export const clientInfo = (req: Request) => ({
  agent: req.header('user-agent'),
  referrer: req.header('referrer'),
  ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
  screen: {
    width: req.param('width'),
    height: req.param('height'),
  },
});

export const listRequest = <Q extends Omit<PaginationDto, 'time'>, T>(query: Q, data: T, count: number) => ({
  count,
  data,
  page: query.page,
  pageSize: query.pageSize,
  timestamp: query.timestamp || new Date().getTime(),
});
