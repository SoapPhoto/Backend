import { Controller, UseFilters } from '@nestjs/common';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';

@Controller('notification')
@UseFilters(new AllExceptionFilter())
export class NotificationController {}
