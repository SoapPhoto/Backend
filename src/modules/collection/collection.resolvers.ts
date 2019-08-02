import {
  Args, Context, Query, Resolver, Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { CollectionService } from './collection.service';
import { UserEntity } from '../user/user.entity';
import { GetCollectionPictureListDto, AddPictureCollectionDot } from './dto/collection.dto';
import { Roles } from '@server/common/decorator/roles.decorator';
import { Role } from '../user/role.enum';

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

  @Query()
  public async collectionPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args() query: GetCollectionPictureListDto,
    @Args('id') id: string,
  ) {
    return this.collectionService.getCollectionPictureList(id, query, user);
  }

  @Mutation()
  @Roles(Role.USER)
  public async addPictureCollection(
    @Context('user') user: UserEntity,
    @Args('id') id: string,
    @Args('input') input: AddPictureCollectionDot,
  ) {
    return this.collectionService.addPicture(id, input, user);
  }
}
