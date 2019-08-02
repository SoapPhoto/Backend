import {
  Args, Context, Query, Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { CollectionService } from './collection.service';
import { UserEntity } from '../user/user.entity';

@Resolver()
@UseGuards(AuthGuard)
export class CollectionResolver {
  constructor(
    private readonly collectionService: CollectionService,
  ) {}

  @Query()
  public async collection(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: string,
  ) {
    return this.collectionService.getCollectionDetail(id, user);
  }
}
