import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/user/user.entity';
import { CollectionService } from './collection.service';
import { CreateCollectionDot } from './dto/collection.dto';

@Controller('api/collection')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
  ) {}

  @Post('')
  @Roles('user')
  public async createCollection(
    @Body() body: CreateCollectionDot,
    @User() user: UserEntity,
  ) {
    return this.collectionService.create(body, user);
  }
}
