import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/user/user.entity';
import { CollectionService } from './collection.service';
import { CreateCollectionDot } from './dto/collection.dto';

@Controller('api/collection')
@UseGuards(AuthGuard)
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
